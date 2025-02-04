'use client'

import type { FC } from 'react'
import React, { useState } from 'react'
import Image from 'next/image'
import { Skeleton } from '@nextui-org/react'

const fallbackImgSrc = '/images/avatars/default.svg'

type ImageWithFallbackProps = {
  src: string
  height?: number
  width?: number
  alt: string
  className?: string
  fallbackSrc?: string
}

const ImageWithFallback: FC<ImageWithFallbackProps> = ({
  fallbackSrc = fallbackImgSrc,
  src,
  className,
  height = 0,
  width = 0,
  alt,
}) => {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = React.useState<boolean>(false)

  return (
    <>
      <Image
        alt={alt}
        height={height}
        width={width}
        className={className}
        sizes="100vw"
        src={error ? fallbackSrc : src}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true)
        }}
      />
      <Skeleton
        className={`rounded-lg absolute top-0 left-0 w-full dark:bg-[#363639] bg-gray-400 ${
          loaded && 'hidden'
        } ${className}`}
      >
        <div
          className={`dark:bg-gray-700 bg-gray-400 aspect-square w-full h-full rounded-[19px]`}
        ></div>
      </Skeleton>
    </>
  )
}

export default ImageWithFallback
