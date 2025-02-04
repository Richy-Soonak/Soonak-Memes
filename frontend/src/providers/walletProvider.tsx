'use client'
import { FC, ReactNode, useMemo } from 'react'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  MathWalletAdapter,
  TrustWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { ConnectionConfig } from '@solana/web3.js'

// Set endpoint
const network = process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'solana-devnet' : 'solana'
const SOLANA_DRPC_URL = `https://lb.drpc.org/ogrpc?network=${network}&dkey=${process.env.NEXT_PUBLIC_DRPC_KEY}`
const SOLANA_DRPC_WSS_URL = `wss://lb.drpc.org/ogws?network=${network}&dkey=${process.env.NEXT_PUBLIC_DRPC_KEY}`

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  
  // Use the Helius RPC URL directly
  const endpoint = SOLANA_DRPC_URL
  const config = useMemo(
    () => ({ commitment: 'confirmed', wsEndpoint: SOLANA_DRPC_WSS_URL }),
    []
  ) as ConnectionConfig

  // Wallets setup
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new MathWalletAdapter(),
      new TrustWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint} config={config}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletContextProvider
