'use client'
import React from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react/dist/iconify.js'
import { twMerge } from 'tailwind-merge'
import { useTheme } from 'next-themes'
import { useWallet } from '@solana/wallet-adapter-react'
import { shortenAddress } from '@/utils/utils'
import { useRouter, usePathname } from 'next/navigation'
import useAuth from '@/hooks/useAuth'

interface INav {
  title: string
  url: string
  icon: string
  soon?: true
}

const navs: INav[] = [
  {
    title: 'Home',
    url: '/',
    icon: 'fa:home',
  },
  {
    title: 'Featured',
    url: '/featured',
    icon: 'majesticons:settings-cog-line',
  },
  {
    title: 'Tutorials',
    url: '/tutorials',
    icon: 'ic:round-school',
  },
  {
    title: 'Tools',
    url: '/tools',
    icon: 'fa-solid:tools',
  },
  {
    title: 'Become a Partner',
    url: '/be-partner',
    icon: 'carbon:partnership',
  },
  {
    title: 'Partner',
    url: '/partners',
    icon: 'fluent:people-team-32-regular',
  },
]

const Sider = () => {
  //hooks
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const { publicKey } = useWallet()
  const { isAuthenticated } = useAuth()
  //state
  const [current, setCurrent] = React.useState<string>('Dashboard')
  const [isCollapse, setIsCollapse] = React.useState<boolean>(true)
  //web3

  const address = React.useMemo(
    () => (publicKey ? shortenAddress(publicKey.toBase58(), 10) : ''),
    [publicKey?.toString()]
  )
  // const address = publicKey ? publicKey.toString() : ''

  const _renderThemeSwitch = () => (
    <div className="relative flex bg-[#EFF3FF] dark:bg-[#050606] rounded-xl w-full px-2 py-1 mt-4">
      <div
        className={`absolute left-1 dark:left-[calc(50%-4px)] rounded-lg h-[calc(100%-8px)] w-[50%] z-0 bg-gradient-to-r from-[#FF6802] to-[#EE0E72]  transition-[left] duration-200`}
      ></div>
      <div
        onClick={() => setTheme('light')}
        className={`flex z-10 justify-center cursor-pointer items-center gap-2 dark:text-[#6F767E] text-white text-sm p-2 w-1/2`}
      >
        <Icon icon="mage:sun-fill" width={20} height={20} />
        Light
      </div>
      <div
        onClick={() => setTheme('dark')}
        className={`flex z-10 justify-center cursor-pointer items-center gap-2 text-[#6F767E] dark:text-white text-sm p-2 w-1/2`}
      >
        <Icon icon="flowbite:moon-solid" width={20} height={20} />
        Dark
      </div>
    </div>
  )

  const _gotoURL = (url: string) => {
    router.push(url)
  }

  const _renderNavItem = ({ title, icon, url, soon }: INav) => (
    <li
      key={title}
      onClick={() => _gotoURL(url)}
      className={`w-full px-1 flex justify-between gap-2 items-center text-black dark:text-white text-[15px] py-[10px] ${
        pathname === url &&
        'bg-gradient-to-l to-[#7D5889] from-[#CE1328] !px-5 !py-4 font-bold !text-white my-1'
      }  rounded-xl cursor-pointer hover:font-bold`}
    >
      <div className="flex gap-2">
        <Icon icon={icon} width={22} /> {title}
      </div>
      {soon && (
        <span
          className={`text-[9px] text-center text-[#0776DA] bg-[#E5F6FF] dark:bg-[#e5f6ff13] rounded-full px-2 py-1 ${
            pathname === url && 'dark:text-white text-blue-600'
          }`}
        >
          Coming Soon
        </span>
      )}
    </li>
  )

  const handleCollapse = () => {
    setIsCollapse((prev) => !prev)
  }

  return (
    <>
      {!isCollapse && (
        <div
          onClick={handleCollapse}
          className="fixed z-50 md:hidden top-0 left-0 right-0 bottom-0 backdrop-filter backdrop-blur-[10px]"
        ></div>
      )}
      <div
        className={twMerge(
          isCollapse ? '-left-[300px]' : 'left-0',
          'fixed top-0 bottom-0 z-50 transition-all duration-200 md:!left-0 md:overflow-auto flex-col justify-between bg-white dark:bg-[#131313] w-[300px] dark:border-[#100E28] sider border border-l border-[#EFEFEF]'
        )}
      >
        <div className="w-full h-full overflow-y-scroll overflow-x-hidden vulcan-sider">
          <div className="w-[300px] flex flex-col justify-between min-h-screen">
            <section className="">
              <div className="flex justify-center items-center p-6">
                <Image
                  src={'/logo.png'}
                  width={160}
                  height={160}
                  alt={'sun'}
                  priority={true}
                />
              </div>
              <h3 className="text-black font-sans dark:text-white text-center font-bold mt-3 text-medium">
                {address ? address : 'Unknown'}
              </h3>
              <div className="text-sm justify-center mt-1 flex items-center gap-1">
                {isAuthenticated ? (
                  <>
                    <span>verified</span>
                    <Icon
                      className="text-[#0CAF60] text-[18px]"
                      icon="ic:baseline-verified"
                    />
                  </>
                ) : (
                  <>
                    <span>Not Verified</span>
                    <Icon
                      className="text-[#0CAF60] text-[18px]"
                      icon="octicon:unverified-24"
                    />
                  </>
                )}
              </div>
              <ul className="p-6">
                {navs.map((_nav: INav) => _renderNavItem(_nav))}
              </ul>
            </section>
            <div>
              <section id="theme-switcher" className="p-6">
                {_renderThemeSwitch()}
              </section>
              <div className="w-full flex gap-2 justify-center bg-[#F7F7F7] dark:bg-[#1A1919] p-3">
                <div className="bg-[#383D38] rounded-full p-2 cursor-pointer hover:bg-[#555855] flex justify-center items-center">
                  <Icon icon="prime:twitter" className="text-xl" />
                </div>
                <div className="bg-[#007EBB] rounded-full p-2 cursor-pointer hover:bg-[#555855] flex justify-center items-center">
                  <Icon icon="ri:linkedin-fill" className="text-xl" />
                </div>
                <div className="bg-[#1877F2] rounded-full p-2 cursor-pointer hover:bg-[#555855] flex justify-center items-center">
                  <Icon icon="mage:facebook" className="text-xl" />
                </div>
                <div className="bg-white rounded-full p-2 cursor-pointer hover:bg-[#555855] flex justify-center items-center">
                  <Icon icon="logos:google-gmail" className="text-medium" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Icon
          onClick={handleCollapse}
          icon="material-symbols:arrow-forward-ios"
          width={30}
          className={`absolute cursor-pointer hover:opacity-60 right-0 top-1/2 translate-x-full -translate-y-1/2 !z-50 md:hidden dark:text-white ${
            !isCollapse && 'hidden'
          }`}
        />
      </div>
    </>
  )
}

export default Sider
