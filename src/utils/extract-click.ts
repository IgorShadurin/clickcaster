import { getConfigData } from '../config'
import { NeynarAPIClient } from '@neynar/nodejs-sdk'
import { ValidateFrameActionResponse } from '@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster'

/**
 * Decoded click data
 */
export interface ClickData {
  /**
   * App url
   */
  appUrl: string
  /**
   * User ID
   */
  fid: bigint
  /**
   * Timestamp
   */
  timestamp: Date
  /**
   * Decoded click data
   */
  decodedClick?: ValidateFrameActionResponse
}

/**
 * Extracts click data from the given string
 * @param data Click data
 */
export async function extractClickData(data: string): Promise<ClickData> {
  const { neynarApiKey } = getConfigData()
  const client = new NeynarAPIClient(neynarApiKey)
  const decodedClick = await client.validateFrameAction(data, { castReactionContext: false, followContext: false })

  // url property is not documented in the library
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const appUrl = decodedClick.action?.url

  if (!appUrl) {
    throw new Error('Cannot extract click url from decoded click data')
  }

  const fid = decodedClick.action?.interactor?.fid

  if (!fid) {
    throw new Error('Cannot extract fid from decoded click data')
  }

  const timestamp = decodedClick.action?.timestamp

  if (!timestamp) {
    throw new Error('Cannot extract timestamp from decoded click data')
  }

  return {
    appUrl,
    fid: BigInt(fid),
    timestamp: new Date(timestamp),
    decodedClick,
  }
}
