import { Connection, PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  Metadata,
  mplTokenMetadata,
  fetchDigitalAsset,
} from "@metaplex-foundation/mpl-token-metadata";

export const getTokenMetadata = async (address: string) => {
  try {
    // Create a UMI instance
    const umi = createUmi(process.env.NEXT_PUBLIC_DRPC_ENDPOINT!);
    // Use the mplTokenMetadata plugin
    umi.use(mplTokenMetadata());
    const mintAddress = new PublicKey(address);
    if (!PublicKey.isOnCurve(mintAddress.toBytes())) {
      return Promise.reject("Invalid Public key");
    }
    console.log("Fetching NFT metadata...");
    //@ts-expect-error different types
    const asset = await fetchDigitalAsset(umi, mintAddress);
    return Promise.resolve(asset);
  } catch (err) {
    return Promise.reject("invalid token");
  }
};
