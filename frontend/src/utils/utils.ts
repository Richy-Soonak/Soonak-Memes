/**
 * make address shorten
 * @param address
 * @param length
 * @returns
 */
export const shortenAddress = (address: string, length: number = 6) =>
  `${address?.substring(0, length)}...${address?.substr(
    address?.length - length,
    address?.length
  )}`
