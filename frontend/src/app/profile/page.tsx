'use client'
import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Loader from '@/components/share/loading'
import InputInfo from '@/components/register/infoInput'
import { useAtom } from 'jotai'
// import { IMGBB_API_KEY } from "@/constants/config";
const Description = dynamic(
  () => import('@/components/register/descriptionInput'),
  { ssr: false }
)
// import { uploadToPinata } from "@/utils";

import { isAuthenticatedAtom, userAtom } from '@/store/user'
import useAuth from '@/hooks/useAuth'
// router
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Router } from 'next/router'
import path from 'path'
import { useWallet } from '@solana/wallet-adapter-react'
import useNotification from '@/hooks/useNotification'
import axios from 'axios'
import ImageWithFallback from '@/components/share/ImageWithFallback'
import { IUSER } from '@/types'

const acceptables = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']

const Evangilists = () => {
  //states
  const [fullName, setFullName] = React.useState<string>('')
  const [company, setCompany] = React.useState<string>('')
  const [website, setWebsite] = React.useState<string>('')
  const [twitter, setTwitter] = React.useState<string>('')
  const [linkedin, setLinkedin] = React.useState<string>('')
  const [facebook, setFacebook] = React.useState<string>('')
  const [instagram, setInstagram] = React.useState<string>('')
  const [farcaster, setFarcaster] = React.useState<string>('')
  const [lens, setLens] = React.useState<string>('')
  const [avatar, setAvatar] = React.useState<string>('')
  const [newAvatar, setNewAvatar] = React.useState<File | undefined>(undefined)
  const [bio, setBio] = React.useState<string>('')
  const [preview, setPreview] = React.useState<string>('')
  const [isInvalid, setIsInvalid] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [fetching, setFetching] = React.useState<boolean>(true)

  //atoms
  const [user, setUser] = useAtom(userAtom)
  const { isAuthenticated } = useAuth()
  //hooks
  const wallet = useWallet()
  const { showNotification } = useNotification()
  // router
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const edit = searchParams.get('edit') === 'true' ? true : false

  const [avatarUrl, setAvatarUrl] = React.useState<string>('')

  // handle editable
  const _handleEdit = () => {
    router.push(`${pathname}?edit=${!edit}`)
  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('this is profile upload avaar')
    try {
      if (!event.target.files) throw 'no files'
      const file: File = event.target.files[0]
      if (!file) throw 'Emptry file'
      if (!acceptables.includes(file.type)) throw 'Invalid Image file.'
      if (file.size > 32 * 1024 * 1024)
        throw 'Overflow maximum file size (32MB).'
      setNewAvatar(file)
      const reader = new window.FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        const _file: string = String(reader.result)
        setPreview(_file)
      }
    } catch (err) {
      showNotification(String(err), 'warning')
      setPreview('')
    }
  }

  const removeAvatar = () => {
    setPreview('')
    setAvatar('')
    setNewAvatar(undefined)
  }

  React.useEffect(() => {
    if (!isAuthenticated) return
    ;(async () => {
      try {
        setFetching(true)
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user/me`
        )
        const {
          avatar,
          bio,
          company,
          fullName,
          website,
          twitter,
          linkedin,
          facebook,
          instagram,
          farcaster,
          lens,
        } = data
        setAvatar(avatar ?? '')
        setBio(bio)
        setCompany(company)
        setFullName(fullName)
        setWebsite(website)
        setTwitter(twitter)
        setLinkedin(linkedin)
        setFacebook(facebook)
        setInstagram(instagram)
        setFarcaster(farcaster)
        setLens(lens)
      } catch (err) {
      } finally {
        setFetching(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const _updateProfile = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      let _avatar = avatar

      if (newAvatar) {
        const formData = new FormData()
        formData.append('file', newAvatar)
        formData.append('page', 'avatar')
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        _avatar = data.imageUrl
      }

      await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/user`, {
        avatar: _avatar,
        bio,
        company,
        fullName,
        website,
        twitter,
        facebook,
        instagram,
        farcaster,
        lens,
        linkedin,
      })
      setAvatar(_avatar)
      if (user) {
        setUser({ ...user, avatar: _avatar, company, fullName })
      }
      showNotification('Updated profile successfully', 'success')
    } catch (err: any) {
      showNotification(String(err.message), 'error')
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (isLoading) return

    setIsInvalid(true)
    let valid = true

    if (!fullName) {
      showNotification('Input your full name', 'warning')
      valid = false
    }
    if (!company) {
      showNotification('Input your company name', 'warning')
      valid = false
    }
    if (!bio) {
      showNotification('Input your Bio', 'warning')
      valid = false
    }

    if (valid) {
      if (!wallet.connected) {
        showNotification('Connect your wallet!', 'warning')
      } else {
        await _updateProfile()
        router.push(`${pathname}?edit=${false}`)
      }
    }
  }

  return (
    <div className="flex w-full flex-col gap-2 text-[#141416] dark:text-[#FAFCFF]">
      <h1 className="text-lg px-1">Profile</h1>
      <Loader loading={fetching}>
        <div className="dark:bg-[#131313] bg-white px-3 xs:px-6 py-6 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="bg-[#4285EC] w-3 h-6 rounded-sm"></div>
              <h3 className="dark:text-[#CCCCCC] text-[#1A1D1F]">
                Profile information
              </h3>
            </div>
            <div
              onClick={_handleEdit}
              className="gap-1 flex items-center text-sm cursor-pointer hover:underline hover:opacity-60"
            >
              <Icon icon="solar:user-id-bold" className="text-2xl" />
              EDIT PROFILE
            </div>
          </div>
          <section className="mt-5 flex gap-3 items-center">
            {preview || avatar ? (
              <Image
                src={preview ? preview : avatar}
                width={70}
                height={70}
                alt=""
                className="rounded-full aspect-square bg-[#be6a6a6b]"
              />
            ) : (
              <Icon
                icon="flowbite:user-solid"
                width={70}
                height={70}
                className="rounded-full bg-[#46455367] opacity-50"
              />
            )}
            <label
              htmlFor="avatar"
              className="bg-[#2B6EC8] cursor-pointer rounded-lg py-[10px] px-4 text-white text-xs hover:bg-[#2b35c8] font-bold flex gap-1"
            >
              <Icon icon="ph:plus-bold" width={14} />
              <span>Upload new avatar</span>
            </label>
            <input hidden id="avatar" type="file" onChange={onFileChange} />
            <button
              onClick={removeAvatar}
              className="bg-white text-black rounded-lg py-[10px] px-4 text-xs border-2 dark:border-none border-[#EFEFEF] hover:bg-gray-200 font-bold"
            >
              Remove
            </button>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-5">
            <InputInfo
              title="Display Name"
              info="*What' your name?"
              placeholder="*Enter your Display Name"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
              isInvalid={isInvalid}
              readOnly={!edit}
              message="Input fullName"
            />
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-5">
            <InputInfo
              title="Company"
              placeholder="*Enter your Company name"
              value={company}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCompany(e.target.value)
              }
              isInvalid={isInvalid}
              readOnly={!edit}
              info="*What' your Company name?"
              message="Input your company name"
            />
            <InputInfo
              title="Instagram"
              placeholder="*Enter your Instagram"
              value={instagram}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInstagram(e.target.value)
              }
              isInvalid={false}
              readOnly={!edit}
              info="*What' your Instagram Link?"
              message="Input Instagram link"
            />
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
            <InputInfo
              title="Website"
              placeholder="*Enter your Website link"
              value={website}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setWebsite(e.target.value)
              }
              isInvalid={false}
              readOnly={!edit}
              info="*What' your Website Link?"
              message="Input your Website link"
            />
            <InputInfo
              title="Linkedin"
              placeholder="*Enter your Linkedin link"
              value={linkedin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLinkedin(e.target.value)
              }
              isInvalid={false}
              readOnly={!edit}
              info="*What' your Linkedin link?"
              message="Input Linkedin link"
            />
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
            <InputInfo
              title="Twitter"
              placeholder="*Enter your Twitter link"
              value={twitter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTwitter(e.target.value)
              }
              isInvalid={false}
              readOnly={!edit}
              info="*What' your Twitter link?"
              message="Input your Twitter link"
            />
            <InputInfo
              title="Facebook"
              placeholder="*Enter your Facebook link"
              value={facebook}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFacebook(e.target.value)
              }
              isInvalid={false}
              readOnly={!edit}
              info="*What' your Facebook link?"
              message="Input your Facebook link"
            />
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
            <InputInfo
              title="Farcaster"
              placeholder="*Enter your Farcaster link"
              value={farcaster}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFarcaster(e.target.value)
              }
              isInvalid={false}
              readOnly={!edit}
              info="*What' your Farcaster Link?"
              message="Input your Farcaster link"
            />
            <InputInfo
              title="Lens"
              placeholder="*Enter your Lens link"
              value={lens}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLens(e.target.value)
              }
              isInvalid={false}
              readOnly={!edit}
              info="*What' your Lens account?"
              message="Input your lens link"
            />
          </section>

          <Description
            title="Bio"
            readOnly={!edit}
            className="mt-5 bio"
            placeholder="*Enter Bio..."
            info="what' your short description"
            value={bio}
            onChange={(value: string) => setBio(value)}
            isInvalid={isInvalid}
            message="input your Bio"
          />

          <div>
            <button
              onClick={handleSubmit}
              className="bg-[#2B6EC8] flex gap-1 justify-center items-center rounded-lg py-2 px-4 text-white text-xs hover:bg-[#2b35c8] font-bold mt-3"
            >
              {!isLoading ? (
                <Icon icon="bx:cloud-upload" width={20} height={20} />
              ) : (
                <Icon icon="line-md:uploading-loop" width={20} height={20} />
              )}{' '}
              UPDATE
            </button>
          </div>
        </div>
      </Loader>
    </div>
  )
}

export default Evangilists
