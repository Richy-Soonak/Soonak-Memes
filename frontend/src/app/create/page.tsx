'use client'
import Image from 'next/image'
import React from 'react'
import useAsyncEffect from 'use-async-effect'
import axios from 'axios'
import ImageWithFallback from '@/components/share/ImageWithFallback'
import Exchange from '@/components/exchange'
import { Button, Input, Skeleton, Tooltip, Progress, Spacer } from '@nextui-org/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { getTokenMetadata } from '../share/web3utils'
import { useAtom } from 'jotai'
import { projectsAtom } from '@/store'
import { useRouter } from 'next/navigation'
import { useServerAPI } from '@/hooks/useServerAPI'
import { TokenMetadata } from '@/types'
import VerticalCollapsibleSteps from '@/components/create/verticalCollapsibleSteps'

const guidelines = [
  {
    title: '1. File Format and Size:',
    description:
      'Images must be in JPG format, with a resolution of 1600 x 900 pixels and a file size under 1MB. Videos (if supported) should follow platform guidelines for format and duration.',
  },
  {
    title: '2. Content:',
    description:
      'Submissions must be original and relevant to the competition theme. No offensive, defamatory, or inappropriate content.',
  },
  {
    title: '3. Licensing:',
    description:
      'By submitting, you agree to allow your meme to be used by the platform for promotional purposes.',
  },
  {
    title: '4. Fees:',
    description:
      'Each submission requires a small fee, payable in the platform’s supported tokens (e.g., SOL, ETH, CRDD).',
  },
  {
    title: '5. Voting:',
    description:
      'Entries are subject to community voting. Memes with the most votes will be eligible for prizes.',
  },
  {
    title: '6. Specifications:',
    description:
      'Ensure your meme meets platform specifications before submitting to avoid disqualification. A link to an image converter will be provided.',
  },
  {
    title: '7. Contact:',
    description:
      'Optionally, you can indicate if you wish to be contacted for future collaborations. Please keep the area within the required size, and allow people to scroll through the text if they want.',
  },
]

const CompetitionCreator: React.FC = () => {
  // hooks
  const router = useRouter()
  const { serverAPI } = useServerAPI()
  // atoms
  const [tokenAddress, setTokenAddress] = React.useState<string>('')
  const [metadataError, setMetadataError] = React.useState<string>('')
  const [step, setStep] = React.useState<number>(0)
  const [projects, setProjects] = useAtom(projectsAtom)
  // states
  const [isFetchingMetaData, setIsFetchingMetaData] =
    React.useState<boolean>(false)
  const [isPaid, setIsPaid] = React.useState<boolean>(false)
  const [token, setToken] = React.useState<TokenMetadata | undefined>(undefined)

  useAsyncEffect(async () => {
    try {
      setIsFetchingMetaData(true)
      setStep(0)
      if (!tokenAddress) return
      const {
        data: { status, msg, payload },
      } = await serverAPI.get(`/api/metadata/${tokenAddress}`)
      if (status === 'SUCCESS') {
        setToken(payload)
        setMetadataError('')
      } else if (status === 'ERR') {
        throw msg
      }
    } catch (err: any) {
      setToken(undefined)
      setMetadataError(String(err))
    } finally {
      setIsFetchingMetaData(false)
    }
  }, [tokenAddress])

  const startCompetition = async (_token: TokenMetadata) => {
    const _project = {
      ticker: _token.symbol,
      symbol: _token.symbol,
      description: _token.description,
      publicKey: tokenAddress,
      logo: _token.image,
      decimals: 9,
      marketCap: 1e12,
      price: 0.000001,
      memes: [],
    }
    setProjects([_project, ...projects])
    router.push('/')
  }

  const _renderTokenMetadata = () => (
    <div className="flex items-start flex-col break-all">
      {token?.name && (
        <div className="text-wrap">
          Name: <span className="text-green-400">{token?.name}</span>
        </div>
      )}
      {token?.symbol && (
        <div className="text-wrap">
          Symbol: <span className="text-green-400">{token?.symbol}</span>
        </div>
      )}
      {token?.description && (
        <div className="text-wrap">
          Description:{' '}
          <span className="text-green-400">{token?.description}</span>
        </div>
      )}
      {token?.website && (
        <div className="text-wrap">
          Website: <span className="text-green-400">{token?.website}</span>
        </div>
      )}
      {token?.telegram && (
        <div className="text-wrap">
          Telegram: <span className="text-green-400">{token?.telegram}</span>
        </div>
      )}
      {token?.creator && (
        <div className="text-wrap">
          Creator:{' '}
          <span className="text-green-400">{token?.creator?.name}</span>
        </div>
      )}
      {token?.createdOn && (
        <div className="text-wrap">
          CreatedOn: <span className="text-green-400">{token?.createdOn}</span>
        </div>
      )}
    </div>
  )
  const _renderData = [
    {
      title: (
        <li className="mb-10 ms-6">
          <h3 className="font-medium leading-tight pt-2">
            Enter token address
          </h3>
          {step === 0 && (
            <>
              <div className="text-sm pt-4">
                <Input
                  key="outside"
                  value={tokenAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTokenAddress(e.target.value)
                  }
                  description={!isFetchingMetaData && metadataError}
                  type="email"
                  label="Enter contract address"
                  labelPlacement="outside"
                  endContent={
                    isFetchingMetaData && (
                      <Icon
                        icon="eos-icons:three-dots-loading"
                        className="text-5xl"
                      />
                    )
                  }
                  classNames={{
                    input: [
                      'bg-transparent',
                      'text-black/90 dark:text-white/90',
                      'placeholder:text-default-700/50 dark:placeholder:text-white/60',
                    ],
                    innerWrapper: 'bg-transparent',
                    inputWrapper: [
                      'shadow-xl',
                      'bg-default-200/50',
                      'dark:bg-default/60',
                      'backdrop-blur-xl',
                      'backdrop-saturate-200',
                      'hover:bg-default-200/70',
                      'focus-within:!bg-default-200/50',
                      'dark:hover:bg-default/70',
                      'dark:focus-within:!bg-default/60',
                      '!cursor-text',
                    ],
                  }}
                />
              </div>
              {token && step === 0 && (
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={() => setStep(1)}
                    color="primary"
                    size="sm"
                  >
                    Next
                    <Icon icon="mdi:navigate-next" />
                  </Button>
                </div>
              )}
            </>
          )}
        </li>
      )
    },
    {
      title: (
        <li className="mb-10 ms-6">
          <h3 className="font-medium leading-tight pt-2">
            Pay spam filter fee
          </h3>
          {step === 1 && (
            <>
              <p className="text-sm mt-2">
                Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make
              </p>
              {isPaid && (
                <div className="flex gap-1 text-green-700 text-sm mt-2">
                  <Icon icon="mynaui:check-solid" className="text-2xl" />{' '}
                  Successfully paid spam filter fee
                </div>
              )}
              <p className="text-sm flex gap-1 items-center pt-4">
                {isPaid ? (
                  <Button
                    onClick={() => setStep(2)}
                    color="primary"
                    size="sm"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsPaid(true)}
                    color="primary"
                    size="sm"
                  >
                    Pay Now
                  </Button>
                )}
                <Button
                  onClick={() => setStep(0)}
                  variant="bordered"
                  size="sm"
                >
                  Back
                </Button>
              </p>
            </>
          )}
        </li>
      )
    },
    {
      title: (
        <li className="mb-10 ms-6">
          <h3 className="font-medium leading-tight pt-2">
            Start Competition
          </h3>
          {step === 2 && token && (
            <>
              <p className="text-sm mt-2">
                Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make
              </p>
              <p className="text-sm flex gap-1 items-center pt-4">
                <Button
                  onClick={() => startCompetition(token)}
                  color="primary"
                  size="sm"
                >
                  Start Comp
                </Button>
                <Button
                  onClick={() => setStep(1)}
                  variant="bordered"
                  size="sm"
                >
                  <Icon icon="mdi:navigate-next" hFlip={true} />
                  Back
                </Button>
              </p>
            </>
          )}
        </li>
      )
    }
  ]

  return (
    <div className="w-full flex flex-col lg:flex-row w1400:gap-8 lg:gap-4 h-full rounded-md dark:bg-[#131313] bg-[#F2F5FF] border border-[#E1E1E1] dark:border-white/0 p-2 sm:p-6">
      <div className="w-full flex-none w1200:w-2/3 lg:w-1/2">
        <div className="flex flex-col relative rounded-xl bg-[#5593C2] p-2 sm:p-8">
          {!token ? (
            <Image
              src="/images/gold.png"
              width={0}
              height={0}
              sizes="100vw"
              className="w-1/2 top-0 right-0"
              alt="header"
            />
          ) : (
            <div className="flex gap-2">
              <div className="p-2 w-[100px] sm:w-[150px] flex-none flex justify-center items-center aspect-square bg-white rounded-xl">
                <ImageWithFallback
                  fallbackSrc="/images/coin.svg"
                  src={token.image}
                  alt="logo"
                  className="rounded-xl w-full h-full"
                />
              </div>
              <div className="grow items-center justify-center text-white">
                <div className="flex flex-col gap-2 justify-center h-full">
                  <div className="gap-1 flex items-center">
                    <h1>{token?.symbol}</h1>
                    <Tooltip content={_renderTokenMetadata()}>
                      <Icon
                        icon="lets-icons:info-alt-fill"
                        className="text-2xl hover:opacity-60 cursor-pointer"
                      />
                    </Tooltip>
                  </div>
                  <div className="break-all text-sm text-white/70">
                    {tokenAddress}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-start flex-col mt-3 text-white">
            {_renderTokenMetadata()}
          </div>
        </div>
        {/* <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400 mx-5 mt-10">
          <li className="mb-10 ms-6">
            {step === 0 ? (
              <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                <Icon icon="mdi:number-1" className="text-3xl" />
              </span>
            ) : (
              <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                <Icon icon="gg:check" className="text-3xl" />
              </span>
            )}

            <h3 className="font-medium leading-tight pt-2">
              Enter token address
            </h3>
            {step === 0 && (
              <>
                <div className="text-sm pt-4">
                  <Input
                    key="outside"
                    value={tokenAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTokenAddress(e.target.value)
                    }
                    description={!isFetchingMetaData && metadataError}
                    type="email"
                    label="Enter contract address"
                    labelPlacement="outside"
                    endContent={
                      isFetchingMetaData && (
                        <Icon
                          icon="eos-icons:three-dots-loading"
                          className="text-5xl"
                        />
                      )
                    }
                    classNames={{
                      input: [
                        'bg-transparent',
                        'text-black/90 dark:text-white/90',
                        'placeholder:text-default-700/50 dark:placeholder:text-white/60',
                      ],
                      innerWrapper: 'bg-transparent',
                      inputWrapper: [
                        'shadow-xl',
                        'bg-default-200/50',
                        'dark:bg-default/60',
                        'backdrop-blur-xl',
                        'backdrop-saturate-200',
                        'hover:bg-default-200/70',
                        'focus-within:!bg-default-200/50',
                        'dark:hover:bg-default/70',
                        'dark:focus-within:!bg-default/60',
                        '!cursor-text',
                      ],
                    }}
                  />
                </div>
                {token && step === 0 && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => setStep(1)}
                      color="primary"
                      size="sm"
                    >
                      Next
                      <Icon icon="mdi:navigate-next" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </li>
          <li className="mb-10 ms-6">
            {step > 1 ? (
              <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                <Icon icon="gg:check" className="text-3xl" />
              </span>
            ) : (
              <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                <Icon icon="mdi:number-2" className="text-3xl" />
              </span>
            )}

            <h3 className="font-medium leading-tight pt-2">
              Pay spam filter fee
            </h3>
            {step === 1 && (
              <>
                <p className="text-sm mt-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make
                </p>
                {isPaid && (
                  <div className="flex gap-1 text-green-700 text-sm mt-2">
                    <Icon icon="mynaui:check-solid" className="text-2xl" />{' '}
                    Successfully paid spam filter fee
                  </div>
                )}
                <p className="text-sm flex gap-1 items-center pt-4">
                  {isPaid ? (
                    <Button
                      onClick={() => setStep(2)}
                      color="primary"
                      size="sm"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsPaid(true)}
                      color="primary"
                      size="sm"
                    >
                      Pay Now
                    </Button>
                  )}
                  <Button
                    onClick={() => setStep(0)}
                    variant="bordered"
                    size="sm"
                  >
                    Back
                  </Button>
                </p>
              </>
            )}
          </li>
          <li className="mb-10 ms-6">
            {step > 2 ? (
              <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                <Icon icon="gg:check" className="text-3xl" />
              </span>
            ) : (
              <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                <Icon icon="mdi:number-2" className="text-3xl" />
              </span>
            )}

            <h3 className="font-medium leading-tight pt-2">
              Start Competition
            </h3>
            {step === 2 && token && (
              <>
                <p className="text-sm mt-2">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make
                </p>
                <p className="text-sm flex gap-1 items-center pt-4">
                  <Button
                    onClick={() => startCompetition(token)}
                    color="primary"
                    size="sm"
                  >
                    Start Comp
                  </Button>
                  <Button
                    onClick={() => setStep(1)}
                    variant="bordered"
                    size="sm"
                  >
                    <Icon icon="mdi:navigate-next" hFlip={true} />
                    Back
                  </Button>
                </p>
              </>
            )}
          </li>
        </ol> */}
        <div>
          <Progress
            classNames={{
              base: "",
              label: "text-small",
              value: "text-small text-default-400",
            }}
            label="Steps"
            maxValue={_renderData.length - 1}
            minValue={0}
            showValueLabel={true}
            size="md"
            value={step}
            valueLabel={`${step + 1} of ${_renderData.length}`}
          />
          <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400 mt-10">
            <VerticalCollapsibleSteps
              currentStep={step}
              steps={_renderData}
              onStepChange={setStep}
            />
          </ol>
        </div>
      </div>
      <div className="grow">
        <Exchange />
        <div className="bg-white dark:bg-black rounded-lg p-5 mt-4">
          <h2 className="text-[#3E8ED4] text-lg text-center my-2">
            Submission Guide
          </h2>
          <div>
            {guidelines.map((g, index) => (
              <div key={index}>
                <h2 className="text-[#86b2da] mt-1">{g.title}</h2>
                <p className="text-sm">{g.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompetitionCreator
