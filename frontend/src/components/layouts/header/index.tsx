'use client'
import bs58 from 'bs58'
import axios from 'axios'
import React from 'react'
import useAuth from '@/hooks/useAuth'
import ProfileModal from './profile'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Avatar, Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const Header = () => {
  const { connection } = useConnection()
  const { publicKey, connecting, connected, signMessage } = useWallet()
  const router = useRouter()
  const [balance, setBalance] = React.useState<number>(0)
  const walletModal = useWalletModal()
  const { user } = useAuth()

  const [showProfileModal, setShowProfileModal] = React.useState<boolean>(false)

  const handleSignIn = async () => {
    try {
      if (!connected) {
        walletModal.setVisible(true)
      }

      if (!publicKey || !signMessage) return
      const address = publicKey.toBase58()

      const { data: challenge } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/request-message`,
        {
          network: 'mainnet',
          address,
        }
      )
      const encodedMessage = new TextEncoder().encode(challenge?.message)

      if (!encodedMessage) {
        throw new Error('Failed to get encoded message.')
      }
      const signedMessage = await signMessage?.(encodedMessage)
      const signature = bs58.encode(signedMessage as Uint8Array)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (!connection || !publicKey) {
      return
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL)
      },
      'confirmed'
    )

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info?.lamports / LAMPORTS_PER_SOL)
      }
    })
  }, [publicKey, connection])

  return (
    <div className="flex items-center flex-col-reverse md:flex-row flex-none gap-3 sm:gap-6 p-3.5 text-black dark:text-white w-full justify-between bg-[#F2F5FF] dark:bg-[#131313] border border-gray/30 dark:border-white/0">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 right-3 -translate-y-2/4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          className="bg-white transition-all text-[12px] px-3 py-2 dark:bg-[#2A2A2B] w-full rounded-lg text-blue-gray-700 font-sans font-normal border-[#98bdea3d] dark:border-white/0 outline-none focus:ring-1 focus:ring-[#8ca8cba2] focus:border-[#8ca8cba2] border"
          placeholder="search"
          // value={""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
        />
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex flex-col xs:flex-row gap-2 items-center truncate">
          <Button
            onClick={() => router.push('/create')}
            color="primary"
            size="sm"
            className="rounded-full"
          >
            Create
            <Icon
              icon="icon-park-solid:add-one"
              className="text-xl flex-none"
            />
          </Button>
          <Button color="primary" size="sm" className="rounded-full">
            Parnters
            <Icon
              icon="fluent:people-team-24-filled"
              className="text-xl flex-none"
            />
          </Button>
          {!publicKey ? (
            !connecting ? (
              <Button
                onClick={() => walletModal.setVisible(true)}
                color="primary"
                size="sm"
                className="rounded-full"
              >
                Connect Wallet
                <Icon
                  icon="solar:wallet-money-broken"
                  className="text-xl flex-none"
                />
              </Button>
            ) : (
              <Button
                isDisabled={true}
                color="primary"
                size="sm"
                className="rounded-full"
              >
                Connecting
                <Icon
                  icon="mingcute:loading-fill"
                  className="text-xl flex-none animate-spin"
                />
              </Button>
            )
          ) : (
            <div
              onClick={() => setShowProfileModal(true)}
              className="text-sm flex items-center gap-2 cursor-pointer hover:opacity-60"
            >
              <Avatar
                radius="md"
                showFallback
                src={user?.avatar ?? ''}
                className="rounded-full h-8 w-8"
                // height={32}
                // width={32}
                alt=""
              />
              <div>
                <span className="text-green-500 font-bold">{balance}</span> SOL
              </div>
            </div>
          )}

          {showProfileModal && publicKey && (
            <ProfileModal
              balance={balance}
              address={publicKey.toString()}
              setVisible={setShowProfileModal}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
