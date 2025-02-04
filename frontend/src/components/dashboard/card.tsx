import React from 'react'
import ImageWithFallback from '../share/ImageWithFallback'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Progress } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { Project } from '@/types'
interface IProps {
  project: Project
}

const PorjectCard: React.FC<IProps> = ({ project }) => {
  const router = useRouter()
  return (
    <div>
      <div className="relative w-full h-auto rounded-xl bg-gradient-to-br from-[#3E8ED4] via-[#CE1328]  to-[#BC8C5B] p-[1px]">
        <div className="flex flex-col gap-3 w-full h-full bg-white dark:bg-black p-4 rounded-xl">
          <div className="w-full aspect-[16/11] relative overflow-hidden rounded-lg flex items-center cursor-pointer card-image-wrapper">
            <ImageWithFallback
              fallbackSrc={'/images/placeholder.png'}
              src={project.logo}
              className="w-full card-image duration-300"
              alt="aaa"
            />
          </div>
          <div className="flex gap-2">
            <ImageWithFallback
              src="/images/avatars/default.svg"
              height={32}
              width={32}
              alt="avatar"
            />
            <div className="flex-col">
              <p className="text-sm text-black dark:text-white">
                {project.ticker}
              </p>
              <p className="text-xs dark:text-white/30 text-black/30">
                Fair launch
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Icon icon="token-branded:usdx" className="text-2xl" />
            <span className="text-xs text-[#3E82D4]">{project.price} USD</span>
          </div>
          <div className="flex flex-col gap-[2px] text-black/70 dark:text-white/70">
            <div className="text-[10px] px-1">Progress (30%)</div>
            <Progress size="sm" aria-label="Loading..." value={30} />
            <div className="text-[10px] px-1 flex justify-between">
              <span>0.1 SOL</span>
              <span>2 SOL</span>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="rounded-full bg-[#3E8ED4] p-2 text-xs flex gap-1 items-center truncate">
              <Icon icon="svg-spinners:clock" className="text-xl" />
              15d 12h 12m 11s
            </button>
            <div className="flex gap-1">
              <button className="rounded-full bg-[#3e8ed459] hover:bg-[#3E8ED4] text-blue-500 hover:text-white p-2 text-xs flex gap-1 items-center truncate px-4">
                <Icon icon="solar:heart-broken" className="text-xl" />
              </button>
              <button
                onClick={() => router.push(`/project?id=${project.publicKey}`)}
                className="rounded-full bg-[#3E8ED4] p-2 text-xs flex gap-1 items-center truncate px-4"
              >
                View
              </button>
            </div>
          </div>
        </div>
        <div className="ribbon">
          <div className="w-20 h-6"></div>
        </div>
      </div>
    </div>
  )
}

export default PorjectCard
