import React from 'react'
import { Snippet, Avatar, Button } from '@nextui-org/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { QRCode } from 'react-qrcode-logo'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import useAuth from '@/hooks/useAuth'
// notification hook

interface IProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  balance: number
  address: string
}

const ProfileModal: React.FC<IProps> = ({ setVisible, address, balance }) => {
  const { disconnect } = useWallet()
  const router = useRouter()
  const [show, setShow] = React.useState<string>('PROFILE')
  const { signIn, signOut, isAuthenticated, user, isAuthenticating } = useAuth()

  const _handleSignIn = async () => {
    signIn()
  }

  const _renderSignActions = () => {
    if (!isAuthenticated) {
      return (
        <div onClick={_handleSignIn} className="flex gap-2 w-full">
          {!isAuthenticating ? (
            <Icon
              icon="material-symbols:lab-profile-outline"
              width={20}
              height={20}
            />
          ) : (
            <Icon icon="eos-icons:bubble-loading" width={20} height={20} />
          )}
          SIGN IN
        </div>
      )
    } else {
      return <></>
    }
  }

  const _renderProfile = () => (
    <>
      <div className="relative p-5 border-b dark:border-gray-800 border-gray-200">
        <div className="flex gap-2">
          <Avatar radius="md" showFallback src={user?.avatar ?? ''} />
          {user && (
            <div className="flex items-center text-[16px]">
              <h3>@{user?.fullName}</h3>
            </div>
          )}
        </div>
        <div className="flex mt-5 items-center">
          <div className="flex-none flex justify-center items-center">
            <div className="w-10 flex justify-center items-center flex-none aspect-square rounded-full dark:bg-gray-700 bg-gray-300">
              <Avatar src="/tokens/sol.png" className="w-6 h-6 text-tiny" />
            </div>
          </div>
          <div className="flex grow flex-col items-center">
            <div className="pl-3 flex w-full justify-between items-center text-sm">
              {balance} SOL
            </div>
            <div className="pl-3 flex w-full justify-between items-center">
              <Snippet
                disableTooltip
                size="lg"
                className="bg-transparent opacity-50 dark:text-white -mt-1 -mb-2 p-0 text-black"
                hideSymbol
                codeString={address}
              >
                {address
                  ? address.substring(0, 4) +
                    '....' +
                    address.substr(address.length - 4, 4)
                  : ''}
              </Snippet>
              <h3
                onClick={() => setShow('ADD_FUNDS')}
                className="opacity-50 cursor-pointer hover:underline text-[15px]"
              >
                ADD FUNDS
              </h3>
            </div>
          </div>
        </div>
        <div className="flex mt-5 items-center justify-end">
          <h3
            onClick={signOut}
            className="cursor-pointer opacity-50 hover:opacity-100"
          >
            Disconnect
          </h3>
        </div>
      </div>

      <div className="py-2 relative border-b dark:border-gray-800 border-gray-200">
        <div className="px-6 py-3 flex gap-2 hover:dark:bg-[#1e1a42] hover:bg-[#28235352] cursor-pointer text-[16px] font-normal">
          {_renderSignActions()}
        </div>
      </div>
      <div className="px-5 relative py-3 flex gap-2">
        <Button
          isIconOnly
          className="dark:bg-[#554C5F] bg-[#554c5f5e] rounded-md"
          size="sm"
          aria-label="Like"
        >
          <Icon
            icon="line-md:twitter-x-alt"
            className="text-black dark:text-white"
            width={18}
          />
        </Button>
        <Button
          onClick={() => window.open('https://discord.gg/63JbDWV', '_blank')}
          isIconOnly
          className="dark:bg-[#554C5F] bg-[#554c5f5e] rounded-md"
          size="sm"
          aria-label="Like"
        >
          <Icon
            icon="bi:discord"
            className="text-black dark:text-white"
            width={18}
          />
        </Button>
        <Button
          isIconOnly
          className="dark:bg-[#554C5F] bg-[#554c5f5e] rounded-md"
          size="sm"
          aria-label="Like"
        >
          <Icon
            icon="ant-design:instagram-filled"
            className="text-black dark:text-white"
            width={18}
          />
        </Button>
      </div>
    </>
  )

  const _renderAddFunds = () => (
    <div className="relative p-5 pb-8">
      <div
        onClick={() => setShow('PROFILE')}
        className="text-[15px] flex gap-2 items-center cursor-pointer hover:underline hover:opacity-60"
      >
        <Icon icon="icon-park-outline:back" className="text-xl" />
        ADD FUNDS
      </div>
      <div className="mt-2 dark:bg-[#040413d2] bg-[#F3F4F6] rounded-lg">
        <div className="flex mt-5 items-center p-2 px-3 border-b dark:border-[#100E28] border-white">
          <div className="w-10 flex justify-center items-center flex-none aspect-square rounded-full dark:bg-[#141330] bg-gray-300">
            <Avatar src={''} className="w-6 h-6 text-tiny" />
          </div>
          <div className="flex grow flex-col items-center">
            <div className="pl-3 flex w-full justify-between items-center">
              <h3 className="flex">{'solana'}</h3>
              <h3>{balance} SOL</h3>
            </div>
          </div>
        </div>
        <div className="w-full px-5 py-10 items-center gap-2 flex justify-center flex-col">
          <div className="p-3 rounded-md bg-white">
            <QRCode
              quietZone={0}
              eyeRadius={2}
              value={address}
              logoImage={'/favicon.svg'}
              logoWidth={45}
              logoHeight={30}
            />
          </div>
          <div className="mt-5">
            <Snippet
              disableTooltip
              size="lg"
              className="bg-transparent dark:text-white -mt-1 -mb-2 p-0 text-black"
              hideSymbol
              codeString={address}
            >
              Copy Address
            </Snippet>
          </div>
          <a
            href={`https://zapper.xyz/account/${address}`}
            target="_blank"
            className="w-full cursor-pointer break-all text-wrap text-center text-xs dark:text-gray-400 text-gray-800 hover:underline hover:opacity-60"
          >
            {address}
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed bg-white dark:bg-black z-50 right-1 top-1 rounded-lg sm:left-auto left-1 sm:right-4 sm:top-4 sm:w-96 shadow-md dark:shadow-[#ffffff23]">
      <div
        className="fixed top-0 left-0 bottom-0 right-0"
        onClick={() => setVisible(false)}
      ></div>
      <Icon
        onClick={() => setVisible(false)}
        icon="ion:close"
        className="absolute right-4 top-4 cursor-pointer hover:opacity-50 z-50"
        width={20}
      />
      {show === 'PROFILE' && _renderProfile()}
      {show === 'ADD_FUNDS' && _renderAddFunds()}
    </div>
  )
}

export default ProfileModal
