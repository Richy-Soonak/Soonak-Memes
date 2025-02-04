import { Icon } from '@iconify/react/dist/iconify.js'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SharedSelection,
} from '@nextui-org/react'
import {
  getAssociatedTokenAddress,
  getAccount,
  getMint,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useSearchParams } from 'next/navigation'
import useNotification from '@/hooks/useNotification'

interface IProps {
  className?: string
  setCanUpload?: any
}

interface PriceData {
  [key: string]: number // Adjust the type based on your expected data structure
}

const Exchange: React.FC<IProps> = ({ className, setCanUpload }) => {
  const { showNotification } = useNotification()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') as string
  const [NATIVETOKEN, setNativeToken] = useState<PublicKey>(
    new PublicKey('H218TQViAXsSqwCLnf7L41zewUTRmdN1r4neLtjBXYXS')
  )
  const SOONAK_MINT_ADDRESS = new PublicKey(
    'H218TQViAXsSqwCLnf7L41zewUTRmdN1r4neLtjBXYXS'
  )
  const tokens = [
    {
      name: 'SOL',
      address: 'So11111111111111111111111111111111111111112',
      decimals: 9,
    },
    {
      name: 'USDC',
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6,
    },
    {
      name: 'SOONAK',
      address: 'H218TQViAXsSqwCLnf7L41zewUTRmdN1r4neLtjBXYXS',
    },
  ]
  const [selectedKeys] = React.useState(new Set(['text']))
  const [isSwap, setSwap] = useState<boolean>(false)
  const [amount, setAmount] = useState<number>(0)
  const [prices, setPrice] = useState<PriceData>({})
  console.log(prices, 'prices')
  const [soonakValue, setSValue] = useState<number>(0)
  const [isLink, setLink] = useState(false)
  const [txid, setTxid] = useState(
    '2QXp9xgXb8s4wKdquiEdpLo3epp6ZuRsdHFzqycP56jkAa9H8kd8zaRdaE9b1TcAuJfieaTT4iTr7DLWZbjaeB9z'
  )
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [donateToken, setDonateToken] = React.useState<string>('SOL')
  const [solBalance, setSolBalance] = useState<number>(0)
  const [snoonakBalance, setSnoonakBalance] = useState<bigint>(0n)
  const [, setNativeBalance] = useState<bigint>(0n)
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const [arrow, setArrow] = useState<boolean>(false)
  const [InputValue, setInputValue] = useState<string>('')
  const getSoonakBalance = async () => {
    if (publicKey !== null) {
      try {
        // Get the associated token address for the user's wallet and SOONAK token
        const associatedTokenAddress = await getAssociatedTokenAddress(
          SOONAK_MINT_ADDRESS,
          publicKey
        )

        // Fetch the account info for the associated token address
        const accountInfo = await connection.getAccountInfo(
          associatedTokenAddress
        )

        if (accountInfo) {
          const mintInfo = await getMint(connection, SOONAK_MINT_ADDRESS)
          const decimals = mintInfo.decimals
          const tokenAccount = await getAccount(
            connection,
            associatedTokenAddress
          )
          setSnoonakBalance(tokenAccount.amount / BigInt(10 ** decimals))
          if (tokenAccount.amount >= 1000 * 10 ** decimals) {
            setCanUpload(true)
          }
          console.log('SOONAK Balance:', tokenAccount.amount.toString())
        } else {
          //console.log('No SOONAK token account found.')
        }
      } catch (error) {
        console.error('Error fetching SOONAK balance:', error)
      }
    } else {
      console.error('Public key is null. Cannot fetch balance.')
    }
  }
  const getNativeBalance = async () => {
    if (publicKey !== null) {
      // Explicit null check
      try {
        // Get the associated token address for the user's wallet and SOONAK token
        const associatedTokenAddress = await getAssociatedTokenAddress(
          NATIVETOKEN,
          publicKey
        )

        // Fetch the account info for the associated token address
        const accountInfo = await connection.getAccountInfo(
          associatedTokenAddress
        )

        if (accountInfo) {
          const mintInfo = await getMint(connection, SOONAK_MINT_ADDRESS)
          const decimals = mintInfo.decimals
          const tokenAccount = await getAccount(
            connection,
            associatedTokenAddress
          )
          setNativeBalance(tokenAccount.amount)
          if (tokenAccount.amount >= 1000 * 10 ** decimals) {
            setCanUpload(true)
          }
          console.log('SOONAK Balance:', tokenAccount.amount.toString())
        } else {
          console.log('No SOONAK token account found.')
        }
      } catch (error) {
        console.error('Error fetching SOONAK balance:', error)
      }
    } else {
      console.error('Public key is null. Cannot fetch balance.')
    }
  }
  const getBalance = async () => {
    if (publicKey !== null) {
      // Explicit null check
      try {
        const balance = await connection.getBalance(publicKey)
        setSolBalance(balance / LAMPORTS_PER_SOL)
        console.log('Balance:', balance / LAMPORTS_PER_SOL)
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    } else {
      console.error('Public key is null. Cannot fetch balance.')
    }
  }
  console.log(isOpen, 'isOpen')
  const setTokenType = (keys: SharedSelection) => {
    setIsOpen(!isOpen)
    setInputValue('')
    setSValue(0)
    console.log(keys.currentKey)
    setDonateToken(keys.currentKey ?? '')
  }
  const fetchTokenPrice = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.jup.ag/price/v2?ids=${address}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any other headers you need, e.g., 'x-auth-token': 'your-token'
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log('DataPRICE', data.data[address].price)
      const price = data.data[address].price
      setPrice((prePrices) => ({ ...prePrices, [address]: price }))
    } catch (err) {
      console.log('Error fetching price:', err)
      setPrice((prePrices) => ({ ...prePrices, [address]: 0 }))
    }
  }

  const fetchPrices = async () => {
    try {
      await Promise.all(tokens.map((token) => fetchTokenPrice(token.address)))
    } catch (error) {
      console.error('Error fetching prices:', error)
    }
  }

  useEffect(() => {
    if (id) setNativeToken(new PublicKey(id))
    getSoonakBalance()
    getBalance()
    getNativeBalance()
    fetchPrices()
  }, [publicKey, isLink])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(e.target.value)
    console.log('err', Object.values(prices)[0], 'valueeee')
    if (Object.values(prices)[0] == 0) await fetchPrices()
    else if (/^[0-9]+([.,][0-9]+)?$/.test(value)) {
      const numericValue = parseFloat(value)
      if (!isOpen) {
        setAmount(numericValue * 10 ** 9)
        if (arrow)
          setSValue(
            (numericValue / prices[tokens[0].address]) *
            prices[tokens[2].address]
          )
        else
          setSValue(
            (numericValue * prices[tokens[0].address]) /
            prices[tokens[2].address]
          )
      } else {
        if (arrow) setAmount(numericValue * 10 ** 9)
        else setAmount(numericValue * 10 ** 6)
        if (arrow)
          setSValue(
            (numericValue / prices[tokens[1].address]) *
            prices[tokens[2].address]
          )
        else
          setSValue(
            (numericValue * prices[tokens[1].address]) /
            prices[tokens[2].address]
          )
      }
    } else setSValue(0)
  }

  const handleSwap1 = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    const address: string = !isOpen
      ? tokens[0]?.address || ''
      : tokens[1]?.address || ''
    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_DRPC_ENDPOINT!
      )
      let quoteResponse: any = ''
      if (arrow) {
        quoteResponse = await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${tokens[2].address}&outputMint=${address}&amount=${amount}&slippageBps=100`
        ).then((res) => res.json())
      } else {
        quoteResponse = await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${address}&outputMint=${tokens[2].address}&amount=${amount}&slippageBps=100`
        ).then((res) => res.json())
      }
      console.log('1', quoteResponse)
      const { swapTransaction } = await fetch(
        'https://quote-api.jup.ag/v6/swap',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: publicKey?.toString(),
            wrapAndUnwrapSol: true,
          }),
        }
      ).then((res) => res.json())
      console.log('2', swapTransaction)
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64')
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

      if (signTransaction) {
        setSwap(true)
        const vTxn = await signTransaction(transaction)
        console.log('here are sin')
        const simulationResult = await connection.simulateTransaction(vTxn, {
          commitment: 'processed',
        })

        if (simulationResult.value.err) {
          return showNotification('Simulation Error', 'warning')
        } else {
          console.log('- Simulation success for transaction.')
        }
        const rawTransaction = vTxn.serialize()
        const txid = await connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true,
          maxRetries: 2,
        })
        console.log('here are sin')
        await connection.confirmTransaction(txid)
        setSwap(false)
        setSValue(0)
        setInputValue('0')
        showNotification('Success Token Swap', 'success')
        setTxid(txid)
        setLink(true)
        console.log(`https://solscan.io/tx/${txid}`)
        window.open(
          `https://solscan.io/tx/${txid}`,
          '_blank',
          'noopener,noreferrer'
        )
      }
    } catch (error) {
      setSwap(false)
      setSValue(0)
      setInputValue('0')
      showNotification('Rejected Swap', 'warning')
      console.error('Swap failed:', error)
    }
  }
  return (
    <div
      className={twMerge(
        'w-full bg-white dark:bg-black rounded-lg p-4',
        className
      )}
    >
      <div className="text-[#3E8ED4] text-lg my-3">Exchange</div>
      {arrow ? (
        <>
          <div className="text-[#677785]">
            Available Balance: {Number(snoonakBalance).toFixed(2)} Soonak
          </div>
          <div className="grid grid-cols-[60%_40%] items-center">
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/tokens/soonak.png"
                  width={70}
                  height={70}
                  className="flex-none rounded-full aspect-square"
                  alt="dst"
                />
                <span>{'Soonak'}</span>
              </div>
            </div>
            <div>
              <div>
                <input
                  className="transition-all text-medium px-3 py-2 bg-[#EFEFEF] dark:bg-[#131313] w-full rounded-lg text-blue-gray-700 font-sans font-normal border-[#98bdea3d] dark:border-white/0 outline-none focus:ring-1 focus:ring-[#8ca8cba2] focus:border-[#8ca8cba2] border"
                  placeholder="0"
                  value={InputValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-full h-[2px] bg-[#E7E7EE] my-8 relative">
            <div className="absolute top-1/2 left-1/2 p-1 bg-white dark:bg-black rounded-full -translate-x-1/2 -translate-y-1/2">
              <div className="p-3 bg-[#3E8ED4] rounded-full">
                <Icon
                  onClick={() => {
                    setArrow(!arrow)
                    setInputValue('')
                    setSValue(0)
                  }}
                  icon="mingcute:transfer-2-fill"
                  className="text-medium  cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="text-[#677785]">
            Available Balance: {solBalance.toFixed(4)} SOL
          </div>
          <div className="grid grid-cols-[60%_40%] items-center">
            <div className="flex gap-2 items-start justify-between mr-5">
              <div className="flex gap-2">
                <Image
                  src="/tokens/sol.png"
                  width={70}
                  height={70}
                  className="flex-none rounded-full"
                  alt="src"
                />
                <div className="flex items-center gap-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <div className="flex items-center gap-1 cursor-pointer">
                        <span>{donateToken}</span>
                        <Icon icon="icon-park-outline:down" />
                      </div>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Single selection example"
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setTokenType}
                    >
                      <DropdownItem key="SOL">SOL</DropdownItem>
                      <DropdownItem key="USDC">USDC</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div
              className={`${soonakValue == 0 ? 'text-slate-400' : 'text-blue-gray-700'
                } overflow-x-auto  truncate scrollbar-hide transition-all text-medium px-3 py-2 bg-[#EFEFEF] dark:bg-[#131313] w-full rounded-lg font-sans font-normal border-[#98bdea3d] dark:border-white/0 border box-border pr-4`}
            >
              {soonakValue.toFixed(5)}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-[#677785]">
            Available Balance: {solBalance.toFixed(4)} SOL
          </div>
          <div className="grid grid-cols-[60%_40%] items-center">
            <div className="flex gap-2 items-start justify-between mr-5">
              <div className="flex gap-2">
                <Image
                  src="/tokens/sol.png"
                  width={70}
                  height={70}
                  className="flex-none rounded-full"
                  alt="src"
                />
                <div className="flex items-center gap-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <div className="flex items-center gap-1 cursor-pointer">
                        <span>{donateToken}</span>
                        <Icon icon="icon-park-outline:down" />
                      </div>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Single selection example"
                      variant="flat"
                      disallowEmptySelection
                      selectionMode="single"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setTokenType}
                    >
                      <DropdownItem key="SOL">SOL</DropdownItem>
                      <DropdownItem key="USDC">USDC</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div>
              <input
                className="transition-all text-medium px-3 py-2 bg-[#EFEFEF] dark:bg-[#131313] w-full rounded-lg text-blue-gray-700 font-sans font-normal border-[#98bdea3d] dark:border-white/0 outline-none focus:ring-1 focus:ring-[#8ca8cba2] focus:border-[#8ca8cba2] border"
                placeholder="0"
                value={InputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e)
                }}
              />
            </div>
          </div>
          <div className="w-full h-[2px] bg-[#E7E7EE] my-8 relative">
            <div className="absolute top-1/2 left-1/2 p-1 bg-white dark:bg-black rounded-full -translate-x-1/2 -translate-y-1/2">
              <div className="p-3 bg-[#3E8ED4] rounded-full">
                <Icon
                  onClick={() => {
                    setArrow(!arrow)
                    setInputValue('')
                    setSValue(0)
                  }}
                  icon="mingcute:transfer-2-fill"
                  className="text-medium cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="text-[#677785]">
            Available Balance: {Number(snoonakBalance).toFixed(2)} Soonak
          </div>
          <div className="grid grid-cols-[60%_40%] items-center">
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/tokens/soonak.png"
                  width={70}
                  height={70}
                  className="flex-none rounded-full aspect-square"
                  alt="dst"
                />
                <span>{'Soonak'}</span>
              </div>
            </div>
            <div>
              <div
                className={`${soonakValue == 0 ? 'text-slate-400' : 'text-blue-gray-700'
                  } overflow-x-auto  truncate scrollbar-hide transition-all text-medium px-3 py-2 bg-[#EFEFEF] dark:bg-[#131313] w-full rounded-lg font-sans font-normal border-[#98bdea3d] dark:border-white/0 border box-border pr-4`}
              >
                {soonakValue.toFixed(2)}
              </div>
            </div>
          </div>
        </>
      )}

      <Button color="primary" className="w-full mt-5" onClick={handleSwap1}>
        {isSwap ? (
          <Icon
            icon="mdi:refresh"
            className="animate-spin"
            width={30}
            height={30}
          />
        ) : (
          <>Swap</>
        )}
      </Button>
    </div>
  )
}

export default Exchange
