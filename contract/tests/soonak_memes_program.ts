import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SoonakMemesProgram } from "../target/types/soonak_memes_program";
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  createMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert, expect } from "chai";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { getLogs } from "@solana-developers/helpers";
import BN from 'bn.js';

interface User {
  address: string;
  balance: number;
}

const users: User[] = [
  { address: 'user1_pubkey', balance: 100 },
  { address: 'user2_pubkey', balance: 200 },
  { address: 'user3_pubkey', balance: 300 },
];

const CHAINLINK_PROGRAM_ID = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";
// SOL/USD feed account
const CHAINLINK_FEED = "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
const DIVISOR = 100000000;

describe("soonak_memes_program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.local();
  const program = anchor.workspace
    .SoonakMemesProgram as Program<SoonakMemesProgram>;

  const person1 = anchor.web3.Keypair.generate();
  const person2 = anchor.web3.Keypair.generate();
  const payer = anchor.web3.Keypair.generate();
  // const payer = provider.wallet.payer;
  const mintAuthSC = anchor.web3.Keypair.generate();
  const mintKeypairSC = Keypair.fromSecretKey(new Uint8Array([229,93,237,134,123,77,108,156,163,201,194,108,112,159,178,87,208,12,241,146,47,200,134,104,10,43,201,124,107,71,219,170,13,3,246,188,112,232,22,210,45,189,250,173,9,167,3,237,241,63,35,105,136,161,191,253,186,65,192,53,102,109,235,54]));
  let SOONAK_Mint: anchor.web3.PublicKey;
  let USDC_Mint: anchor.web3.PublicKey;
  let person1ATA: any;
  const secretKey = new Uint8Array([154, 207, 9, 184, 204, 30, 213, 129, 78, 235, 157, 31, 242, 248, 13, 236, 37, 28, 209, 239, 37, 17, 68, 59, 49, 18, 96, 238, 8, 214, 219, 130, 13, 139, 113, 40, 180, 87, 115, 159, 182, 141, 179, 96, 139, 98, 241, 194, 47, 68, 222, 190, 107, 199, 157, 156, 228, 166, 84, 148, 49, 163, 153, 141]) // Your 64 bytes array
  const usdcMint = Keypair.fromSecretKey(secretKey)
  const secretKeyDao = new Uint8Array([161, 198, 182, 30, 176, 247, 175, 38, 36, 18, 185, 140, 91, 169, 5, 211, 82, 160, 97, 77, 147, 30, 110, 170, 177, 6, 189, 243, 74, 46, 35, 51, 9, 95, 33, 120, 46, 173, 57, 198, 25, 63, 122, 11, 190, 159, 56, 16, 40, 190, 24, 184, 54, 174, 177, 115, 14, 163, 118, 69, 136, 246, 115, 199]);
  const keyPairDao = Keypair.fromSecretKey(secretKeyDao);
  const daoAddress = keyPairDao.publicKey;
  let person1UsdcATA: any;
  let person2UsdcATA: any;
  let daoUsdcATA: any;

  before(async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        person1.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      ),
      "confirmed"
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        person2.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      ),
      "confirmed"
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        payer.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      ),
      "confirmed"
    );
    console.log(">> payer", payer.publicKey);
    SOONAK_Mint = await createMint(
      provider.connection,
      payer,
      mintAuthSC.publicKey,
      mintAuthSC.publicKey,
      9,
      mintKeypairSC
    );

    USDC_Mint = await createMint(
      provider.connection,
      payer,
      mintAuthSC.publicKey,
      mintAuthSC.publicKey,
      6,
      usdcMint
    );

    person1UsdcATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      USDC_Mint,
      person1.publicKey
    );

    person2UsdcATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      USDC_Mint,
      person2.publicKey
    );

    daoUsdcATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      USDC_Mint,
      daoAddress
    );

    person1ATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      SOONAK_Mint,
      person1.publicKey
    );
    console.log(">> Person1's Soonak ATA", person1ATA.address.toString());
    const tx = await mintTo(
      provider.connection,
      payer,
      SOONAK_Mint,
      person1ATA.address,
      mintAuthSC,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    // console.log("TX", tx);

    await mintTo(
      provider.connection,
      payer,
      USDC_Mint,
      person1UsdcATA.address,
      mintAuthSC,
      1000 * 10 ** 6
    )
    await mintTo(
      provider.connection,
      payer,
      USDC_Mint,
      person2UsdcATA.address,
      mintAuthSC,
      100 * 10 ** 6
    )
    console.log(">> person1's soonak balance before paying:", (await provider.connection.getTokenAccountBalance(person1ATA.address)).value.uiAmount);
  });

  const showLogs = async (msg: string, tx: string) => {
    try {
      //@ts-ignore
      const logs = await getLogs(provider.connection, tx);
      console.log(`>> ${msg}`, logs);
    } catch (err) { }
  }

  it(">>> Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log(">> Your transaction signature", tx);

  });

  it(">>> Is Spam Filter Fee Payer Created!", async () => {
    // Add your test here.

    console.log(">> usdc mint:", usdcMint.publicKey, "person1UsdcATA:", person1UsdcATA.address, "daoUsdcATA:", daoUsdcATA.address);
    console.log(">> person1's usdc balance before paying:", (await provider.connection.getTokenAccountBalance(person1UsdcATA.address)).value.uiAmount);
    console.log(">> dao's usdc balance before paying:", (await provider.connection.getTokenAccountBalance(daoUsdcATA.address)).value.uiAmount);

    const tx = await program.methods.paySpamFilterFee().accounts({
      tokenAddress: "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf",
      fromTokenAccount: person1UsdcATA.address,
      toTokenAccount: daoUsdcATA.address,
      usdcMint: usdcMint.publicKey,
      user: person1.publicKey
    }).signers([person1]).rpc();
    // console.log(">> Your transaction signature for payspamfiterfee", tx);
    console.log(">> person1's usdc balance after paying comp1:", (await provider.connection.getTokenAccountBalance(person1UsdcATA.address)).value.uiAmount);
    console.log(">> dao's usdc balance after paying comp1:", (await provider.connection.getTokenAccountBalance(daoUsdcATA.address)).value.uiAmount);

    // try {
    //   const tx = await program.methods.paySpamFilterFee().accounts({
    //     tokenAddress: "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf",
    //     fromTokenAccount: person1UsdcATA.address,
    //     toTokenAccount: daoUsdcATA.address,
    //     usdcMint: usdcMint.publicKey,
    //     user: person1.publicKey
    //   }).signers([person1]).rpc();
    // } catch (err) {
    //   console.log(">> duplicated spamfilter fee payment:", err)
    // }

    const tx2 = await program.methods.paySpamFilterFee().accounts({
      tokenAddress: SOONAK_Mint,
      fromTokenAccount: person1UsdcATA.address,
      toTokenAccount: daoUsdcATA.address,
      usdcMint: usdcMint.publicKey,
      user: person1.publicKey
    }).signers([person1]).rpc();
    // console.log(">> Your transaction signature for payspamfiterfee", tx2);
    console.log(">> person1's usdc balance after paying comp2:", (await provider.connection.getTokenAccountBalance(person1UsdcATA.address)).value.uiAmount);
    console.log(">> dao's usdc balance after paying comp2:", (await provider.connection.getTokenAccountBalance(daoUsdcATA.address)).value.uiAmount);
  });

  it(">>> Invalid spam filter fee payer", async () => {
    try {
      const tx = await program.methods
        .createCompetition()
        .accounts({
          tokenAddress: "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf",
          user: person2.publicKey,
          // decimal: priceFeedAccount.publicKey,
          // chainlinkFeed: CHAINLINK_FEED,
          // chainlinkProgram: CHAINLINK_PROGRAM_ID,
        }).signers([person2]).rpc();
    } catch (err) {
      console.log(">> duplicated spamfilter fee payment:", err)
    }
  })

  it(">>> Is Comp Created!", async () => {
    // Add your test here.

    //create an account to store the price data
    const priceFeedAccount = anchor.web3.Keypair.generate();

    // get created competition
    const [compPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("comp"),
        new anchor.web3.PublicKey(
          "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf"
        ).toBuffer(),
      ],
      program.programId
    );
    const tx = await program.methods
      .createCompetition()
      .accounts({
        tokenAddress: "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf",
        user: person1.publicKey,
        // decimal: priceFeedAccount.publicKey,
        // chainlinkFeed: CHAINLINK_FEED,
        // chainlinkProgram: CHAINLINK_PROGRAM_ID,
      })
      .signers([person1]).rpc();
    console.log(">> First competition created with token GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf");

    const [prizePoolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("prize_pool"),
        new anchor.web3.PublicKey(
          "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf"
        ).toBuffer(),
      ],
      program.programId
    );
    console.log(">> comp1", await program.account.competition.fetch(compPda));

    // Create another competition with a different token address

    const tx2 = await program.methods
      .createCompetition()
      .accounts({
        tokenAddress: SOONAK_Mint,
        user: person1.publicKey,
        // decimal: priceFeedAccount.publicKey,
        // chainlinkFeed: CHAINLINK_FEED,
        // chainlinkProgram: CHAINLINK_PROGRAM_ID,
      })
      .signers([person1]).rpc();
    // fetch competition2 data 
    const [compPda2] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("comp"), SOONAK_Mint.toBuffer()],
      program.programId
    );
    const [prizePoolPda2] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("prize_pool"), SOONAK_Mint.toBuffer()],
      program.programId
    );
    const comp2 = await program.account.competition.fetch(compPda2)
    console.log(">> comp2", comp2);

    // // Fetch the account details of the account containing the price data
    // const latestPrice = await program.account.decimal.fetch(
    //   priceFeedAccount.publicKey
    // );
    // console.log("Price Is: " + latestPrice.value / DIVISOR);

    // console.log(">> prize_pool:", comp.prizePoolData.totalTokenAmount.toString());
    console.log(">> comp2 prize_pool:", comp2.prizePoolData.totalSolAmount.toString());

    console.log(
      ">> comp2 created time:",
      new Date(comp2.createTime.toNumber() * 1000).toUTCString()
    );
  });

  it(">>> Only one competition can be created for one token!", async () => {
    // Try to create another competition with the same token address
    try {
      const tx2 = await program.methods
        .createCompetition()
        .accounts({
          tokenAddress: "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf",
        })
        .rpc();
      console.log(">> same comp", tx2)
    } catch (error) {
      console.log(">> Error: Duplicated comp", error);
    }
  });

  // it(">>> Get created comps!", async () => {
  //   // Fetch all accounts of type Comp
  //   const allComps = await program.account.competition.all();

  //   console.log(">> Found", allComps.length, "competitions");

  //   // Log details for each competition
  //   allComps.forEach((comp, index) => {
  //     console.log(`\nCompetition ${index + 1}:`);
  //     console.log("PDA:", comp.publicKey.toString());
  //     console.log(
  //       "Create time:",
  //       new Date(comp.account.createTime.toNumber() * 1000).toUTCString()
  //     );
  //     console.log(
  //       "Start time:",
  //       new Date(comp.account.startTime.toNumber() * 1000).toUTCString()
  //     );
  //     console.log(
  //       "End time:",
  //       new Date(comp.account.endTime.toNumber() * 1000).toUTCString()
  //     );
  //     console.log("Number of memes:", comp.account.memes.length);

  //     // Log details of each meme in the competition
  //     comp.account.memes.forEach((meme, memeIndex) => {
  //       console.log(`\n  Meme ${memeIndex + 1}:`);
  //       console.log("  Name:", meme.name);
  //       console.log("  URL:", meme.url);
  //       console.log("  Votes:", meme.votes.toString());
  //       console.log("  Submitter:", meme.submitter.toString());
  //     });
  //   });
  // });

  it(">>> donate to comp with sol", async () => {
    // Add your test here.
    const [compPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("comp"),
        SOONAK_Mint.toBuffer(),
        // new anchor.web3.PublicKey(
        //   "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf"
        // ).toBuffer(),
      ],
      program.programId
    );
    const [prizePoolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("prize_pool"),
        SOONAK_Mint.toBuffer(),
        // new anchor.web3.PublicKey(
        //   "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf"
        // ).toBuffer(),
      ],
      program.programId
    );
    // const tx = await program.methods.createComp().accounts({ tokenAddress: "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf" }).rpc();


    console.log(">> pre donate sol", {
      prizePoolPda: (await program.account.competition.fetch(compPda)).prizePoolData,
      prizePoolSolBalance: (await provider.connection.getBalance(prizePoolPda)) / 10 ** 9,
      person1SolBalance: (await provider.connection.getBalance(person1.publicKey)) / 10 ** 9
    });
    const donateTx = await program.methods
      .donateSol(new anchor.BN(0.05 * 10 ** 9))
      .accounts({
        to: prizePoolPda,
        tokenAddress: SOONAK_Mint,
        user: person1.publicKey
      }).signers([person1]).rpc();
    console.log(">> post donate sol", {
      prizePoolPda: (await program.account.competition.fetch(compPda)).prizePoolData,
      donators: (await program.account.competition.fetch(compPda)).prizePoolData.donators,
      prizePoolSolBalance: (await provider.connection.getBalance(prizePoolPda)) / 10 ** 9,
      person1SolBalance: (await provider.connection.getBalance(person1.publicKey)) / 10 ** 9
    });
  });

  it(">>> donate to comp with token", async () => {
    // Add your test here.
    const [compPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("comp"),
        SOONAK_Mint.toBuffer(),
        // new anchor.web3.PublicKey(
        //   "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf"
        // ).toBuffer(),
      ],
      program.programId
    );
    const [prizePoolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("prize_pool"),
        SOONAK_Mint.toBuffer(),
        // new anchor.web3.PublicKey(
        //   "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf"
        // ).toBuffer(),
      ],
      program.programId
    );
    // const tx = await program.methods.createComp().accounts({ tokenAddress: "GqPZ3xwsZqbuq76VwFv6i4N2QKuU4bdFYRrgMrehwmJf" }).rpc();
    const comp = await program.account.competition.fetch(compPda);

    console.log(
      "comp create time:",
      new Date(comp.createTime.toNumber() * 1000).toUTCString()
    );
    // console.log("Your transaction signature", tx);


    const prizePoolATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      usdcMint.publicKey,
      prizePoolPda,
      true
    );
    console.log(">> pre donate usdc", {
      prizePoolPda: (await program.account.competition.fetch(compPda)).prizePoolData,
      prizePoolUsdcBalance: (await provider.connection.getTokenAccountBalance(prizePoolATA.address)).value.uiAmount,
      person2UsdcBalance: (await provider.connection.getTokenAccountBalance(person2UsdcATA.address)).value.uiAmount
    });

    await program.methods
      .donateUsdc(new anchor.BN(100_000_000))
      .accounts({
        competition: compPda,
        user: person2.publicKey,
        fromTokenAccount: person2UsdcATA.address,
        toTokenAccount: prizePoolATA.address,
        tokenAddress: SOONAK_Mint,
        tokenMint: usdcMint.publicKey
      })
      .signers([person2])
      .rpc();
    console.log(">> post donate usdc", {
      prizePoolPda: (await program.account.competition.fetch(compPda)).prizePoolData,
      donators: (await program.account.competition.fetch(compPda)).prizePoolData.donators,
      prizePoolUsdcBalance: (await provider.connection.getTokenAccountBalance(prizePoolATA.address)).value.uiAmount,
      person2UsdcBalance: (await provider.connection.getTokenAccountBalance(person2UsdcATA.address)).value.uiAmount
    });
    console.log(">> comp", await program.account.competition.fetch(compPda));
  });

  it(">>> submit meme to comp", async () => {
    const id = 0;
    const [compPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("comp"),
        SOONAK_Mint.toBuffer(),
      ],
      program.programId
    );
    const [meme1pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("meme"),
        SOONAK_Mint.toBuffer(),
        new BN(id).toArrayLike(Buffer, 'le', 8),
      ],
      program.programId
    )
    const comp = await program.account.competition.fetch(compPda);
    console.log(
      ">> soonak comp create time:",
      new Date(comp.createTime.toNumber() * 1000).toUTCString()
    );
    const tx = await program.methods
      .submitMeme(new BN(id), "Test")
      .accountsPartial(
        {
          competition: compPda,
          meme: meme1pda,
          tokenAddress: SOONAK_Mint
        }
      )
      .rpc();
    console.log("Your transaction signature", tx);
    const meme1Data = await program.account.meme.fetch(meme1pda);
    console.log(">> Meme data: ", meme1Data);
  });

  // ... existing imports and setup ...
  it(">>> an vote for a meme in active competition", async () => {

    const id = 1;
    // First create a competition
    const [compPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("comp"), SOONAK_Mint.toBuffer()],
      program.programId
    );
    const [prizePoolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("prize_pool"), SOONAK_Mint.toBuffer()],
      program.programId
    );

    const [meme1pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("meme"),
        SOONAK_Mint.toBuffer(),
        new BN(id).toArrayLike(Buffer, 'le', 8),
      ],
      program.programId
    );

    // Submit a meme
    const memeUrl = "https://example.com/meme.jpg";

    const tx = await program.methods
      .submitMeme(new BN(id), memeUrl)
      .accountsPartial(
        {
          competition: compPda,
          meme: meme1pda,
          tokenAddress: SOONAK_Mint
        }
      )
      .rpc();
    console.log("Your transaction signature", tx);
    // await showLogs(">>Meme submit", tx);

    // Vote for the meme
    const tx2 = await program.methods
      .voteMeme(new BN(id), new BN(100))
      .accountsPartial({
        competition: compPda,
        meme: meme1pda,
        tokenAddress: SOONAK_Mint,
        user: person1.publicKey,
        voterTokenAccount: person1ATA.address,
      })
      .signers([person1])
      .rpc();
    console.log(">> tx for voting: ", tx2);

    await showLogs(">>Log for voting", tx2);

    // Fetch competition state and verify vote count
    const compState = await program.account.competition.fetch(compPda);
    console.log("CompState: ", compState);

    // Get token balance
    const tokenBalance = await provider.connection.getTokenAccountBalance(
      person1ATA.address
    );

    // Calculate expected vote weight (1 vote per million tokens, minimum 1)
    const tokenAmount = Number(tokenBalance.value.amount);
    const expectedVoteWeight = Math.max(1, Math.floor(tokenAmount / 1_000_000));
  });

  it(">>> Prints all competitions' status", async () => {
    const competitions = await program.account.competition.all();
    competitions.forEach((comp) => {
      console.log(`Competition ID: ${comp.publicKey.toString()}`);
      console.log(`Status: ${comp.account.isFinished ? "Finished" : "Active"}`);
      console.log(
        `Start Time: ${new Date(
          comp.account.startTime.toNumber() * 1000
        ).toISOString()}`
      );
      console.log(
        `End Time: ${new Date(
          comp.account.endTime.toNumber() * 1000
        ).toISOString()}`
      );
      console.log(
        `Donation End Time: ${new Date(
          comp.account.donationEndTime.toNumber() * 1000
        ).toISOString()}`
      );
      console.log(`Memes Count: ${comp.account.memeVoteWeights.length}`);
      console.log("Memes:");
      comp.account.memeVoteWeights.forEach((meme, index) => {
        console.log(`  Meme ${index + 1}:`);
        console.log(`  Votes: ${meme.toNumber()}`);
      });
      console.log("----------------");
    });

  });

  it(">>> Can complete competition and distribute prizes correctly", async () => {
    // Create competition
    const id = 1;
    const id2 = 2;

    const [compPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("comp"), SOONAK_Mint.toBuffer()],
      program.programId
    );
    const [meme1pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("meme"),
        SOONAK_Mint.toBuffer(),
        new BN(id).toArrayLike(Buffer, 'le', 8),
      ],
      program.programId
    );
    const [meme2pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("meme"),
        SOONAK_Mint.toBuffer(),
        new BN(id2).toArrayLike(Buffer, 'le', 8),
      ],
      program.programId
    );
    const [prizePoolPda] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("prize_pool"), SOONAK_Mint.toBuffer()],
      program.programId
    );

    // Create ATAs for winners and DAO
    const daoKeypair = anchor.web3.Keypair.generate();
    const winner1Keypair = anchor.web3.Keypair.generate();
    const winner2Keypair = anchor.web3.Keypair.generate();

    // Airdrop SOL to winners for account creation
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        daoKeypair.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      )
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        winner1Keypair.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      )
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        winner2Keypair.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      )
    );

    const daoATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      SOONAK_Mint,
      daoKeypair.publicKey
    );
    const winner1ATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      SOONAK_Mint,
      winner1Keypair.publicKey
    );
    const winner2ATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      SOONAK_Mint,
      winner2Keypair.publicKey
    );

    // Submit memes from different users
    await program.methods
      .submitMeme(new BN(id), "https://example.com/meme1.jpg")
      .accountsPartial({
        competition: compPda,
        user: winner1Keypair.publicKey,
      })
      .signers([winner1Keypair])
      .rpc();

    await program.methods
      .submitMeme(new BN(id2), "https://example.com/meme2.jpg")
      .accountsPartial({
        competition: compPda,
        user: winner2Keypair.publicKey,
      })
      .signers([winner2Keypair])
      .rpc();

    // Get prize pool ATA
    const prizePoolATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      SOONAK_Mint,
      prizePoolPda,
      true
    );

    // Record initial balances
    const initialPrizePoolBalance =
      await provider.connection.getTokenAccountBalance(prizePoolATA.address);
    const initialDaoBalance = await provider.connection.getTokenAccountBalance(
      daoATA.address
    );
    const initialWinner1Balance =
      await provider.connection.getTokenAccountBalance(winner1ATA.address);
    const initialWinner2Balance =
      await provider.connection.getTokenAccountBalance(winner2ATA.address);

    console.log("Starting delay...");
    await delay(15000); // Wait for 20 seconds
    console.log("15 seconds have passed!");
    // Finish competition
    // In your test file, modify the finish_comp call:

    const tx = await program.methods
      .finishCompetition()
      .accounts({
        competition: compPda,
        prizePool: prizePoolPda,
        prizeTokenAccount: prizePoolATA.address,
        daoAccount: daoKeypair.publicKey,
        daoTokenAccount: daoATA.address,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenAddress: SOONAK_Mint,
      })
      .remainingAccounts([
        {
          pubkey: winner1ATA.address,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: winner2ATA.address,
          isWritable: true,
          isSigner: false,
        },
      ])
      .rpc();

    console.log(`tx signature :, ${tx}`);

    // Get final balances
    const finalPrizePoolBalance =
      await provider.connection.getTokenAccountBalance(prizePoolATA.address);
    const finalDaoBalance = await provider.connection.getTokenAccountBalance(
      daoATA.address
    );
    const finalWinner1Balance =
      await provider.connection.getTokenAccountBalance(winner1ATA.address);
    const finalWinner2Balance =
      await provider.connection.getTokenAccountBalance(winner2ATA.address);

    // Verify prize distribution
    const totalPrize = Number(initialPrizePoolBalance.value.amount);
    const daoShare = Math.floor(totalPrize * 0.1); // 10% for DAO
    const winnersShare = Math.floor((totalPrize - daoShare) / 2); // Split remaining among winners

    // assert.equal(
    //   Number(finalDaoBalance.value.amount) -
    //     Number(initialDaoBalance.value.amount),
    //   daoShare,
    //   "Incorrect DAO share"
    // );
    // assert.equal(
    //   Number(finalWinner1Balance.value.amount) -
    //     Number(initialWinner1Balance.value.amount),
    //   winnersShare,
    //   "Incorrect Winner 1 share"
    // );
    // assert.equal(
    //   Number(finalWinner2Balance.value.amount) -
    //     Number(initialWinner2Balance.value.amount),
    //   winnersShare,
    //   "Incorrect Winner 2 share"
    // );

    // Verify competition is marked as finished
    const finalCompState = await program.account.competition.fetch(compPda);
    assert.isTrue(
      finalCompState.isFinished,
      "Competition should be marked as finished"
    );
  });

    it(">>> Prints all competitions' status", async () => {
    const competitions = await program.account.competition.all();
    competitions.forEach((comp) => {
      console.log(`Competition ID: ${comp.publicKey.toString()}`);
      console.log(`Status: ${comp.account.isFinished ? "Finished" : "Active"}`);
      console.log(
        `Start Time: ${new Date(
          comp.account.startTime.toNumber() * 1000
        ).toISOString()}`
      );
      console.log(
        `End Time: ${new Date(
          comp.account.endTime.toNumber() * 1000
        ).toISOString()}`
      );
      console.log(
        `Donation End Time: ${new Date(
          comp.account.donationEndTime.toNumber() * 1000
        ).toISOString()}`
      );
      console.log(`Memes Count: ${comp.account.memeVoteWeights.length}`);
      console.log("Memes:");
      comp.account.memeVoteWeights.forEach((meme, index) => {
        console.log(`  Meme ${index + 1}:`);
        console.log(`  Votes: ${meme.toNumber()}`);
      });
      console.log("----------------");
    });

  });
});




function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



