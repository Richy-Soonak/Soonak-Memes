import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex } from '@metaplex-foundation/js'

import {
  getTokenMetadata
} from '@solana/spl-token'
/**
 * fetch spl token metadata
 * @param address 
 * @returns 
 */
export const fetchTokenMetadata = async (address: string) => {
  try {
    const connection: Connection = new Connection(process.env.DRPC_ENDPOINT!)
    const metaPlex = new Metaplex(connection)
    const mintAddress = new PublicKey(address)

    const metadataAccount = metaPlex
      .nfts()
      .pdas()
      .metadata({ mint: new PublicKey(address) })
    const metadataAccountInfo = await connection.getAccountInfo(metadataAccount)

    if (metadataAccountInfo) {
      const metadata = await metaPlex.nfts().findByMint({ mintAddress })
      return Promise.resolve(metadata.json)
    } else {
      const metadata = await getTokenMetadata(
        connection,
        mintAddress // Mint Account address
      )
      return Promise.resolve(metadata)
    }
  } catch (err) {
    console.log(err)
    return Promise.reject('invalid token')
  }
}
/**
 * make new token url according to decentralized storage url
 * @param url
 * @returns
 */
export const makeNewTokenUri = (url: string) => {
  // Patterns to match various IPFS-related URLs
  const patterns = [
    // 1. Standard ipfs.io URL (https://ipfs.io/ipfs/{CID})
    /^https:\/\/ipfs\.io\/ipfs\/([a-zA-Z0-9]+)$/,

    // 2. NFT.Storage URL (https://{CID}.ipfs.nftstorage.link)
    /^https:\/\/([a-zA-Z0-9]+)\.ipfs\.nftstorage\.link/,

    // 3. Pinata URL (https://gateway.pinata.cloud/ipfs/{CID})
    /^https:\/\/gateway\.pinata\.cloud\/ipfs\/([a-zA-Z0-9]+)$/,

    // 4. Web3.Storage URL (https://{CID}.ipfs.dweb.link)
    /^https:\/\/([a-zA-Z0-9]+)\.ipfs\.dweb\.link/,

    // 5. Cloudflare IPFS URL (https://cloudflare-ipfs.com/ipfs/{CID})
    /^https:\/\/cloudflare-ipfs\.com\/ipfs\/([a-zA-Z0-9]+)$/,

    // 6. Infura IPFS URL (https://ipfs.infura.io/ipfs/{CID})
    /^https:\/\/ipfs\.infura\.io\/ipfs\/([a-zA-Z0-9]+)$/,
  ]

  // Try matching the URL against all patterns
  for (let pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return `https://ipfs.io/ipfs/` + match[1] // Return the CID
    }
  }

  // Return null if no CID was found
  return url
}
