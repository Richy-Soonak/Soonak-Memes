import express, { Router, Response } from "express";
import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

import {
  keypairIdentity,
  Metaplex,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import base58 from "bs58";
import multer from "multer";

interface MulterRequest extends express.Request {
  file: Express.Multer.File;
  name: string;
  caption: string;
  user: string;
}
const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const main = async (fileC: any) => {
  try {
    console.log("Starting token creation process...\n");

    console.log("Network selected:");
    const connection = new Connection(
      process.env.DRPC_ENDPOINT,
      "confirmed"
    );

    const userWallet = Keypair.fromSecretKey(base58.decode(PRIVATE_KEY));
    const balance = await connection.getBalance(userWallet.publicKey);
    console.log("Wallet balance:", balance / LAMPORTS_PER_SOL, "SOL");

    const metaplex = Metaplex.make(connection).use(keypairIdentity(userWallet));
    // console.log(metaplex)

    let metadataUri = await uploadMetadata(metaplex, fileC);
    return metadataUri;
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const uploadMetadata = async (metaplex: any, fileC: Express.Multer.File) => {
  try {
    // const buffer = fs.readFileSync("./hu.png");
    const buffer = await fileC.buffer;
    const file = toMetaplexFile(buffer, "codercoin.png");
    // console.log("file", file)
    const imageUri = await metaplex.storage().upload(file);
    // const { uri } = await metaplex.nfts().uploadMetadata(im);
    // console.log("imga", uri)

    return imageUri;
  } catch (error) {
    console.error("Error uploading token metadata:", error);
  }
};

router.post(
  "/",
  upload.single("file"),
  async (req: MulterRequest, res: Response) => {
    try {
      const fileContent = req.file;
      const pageContent = req.body.page;
      const name = req.name;
      console.log("pageContent", pageContent);
      const url = await main(fileContent);
      res.status(200).json({ imageUrl: url });
    } catch (err) {
      res.status(500).json({ status: "Error", msg: "Failed to upload image" });
    }
  }
);
export default router;
