import { verifyMessage } from 'ethers'

/**
 * Extract the address of the log provider
 * @param data Data with the click info
 * @param signature Signature of the data provider
 */
export function extractLogProvider(data: string, signature: string): string {
  return verifyMessage(data, signature).replace('0x', '').toLowerCase()
}
