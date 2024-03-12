import { extractLogProvider, validateSignatureLength } from './crypto'
import { getKeyOwnerId } from '../db/AccessKeyModel'
import { frameExists, getFrameDataByUrl } from '../db/FrameModel'
import {
  CLICK_ALLOWED_TIME_MINUTES,
  getExpectedClick,
  getUniqueClick,
  removeExpectedClick,
  setUniqueClick,
} from './memcached/clicks'
import { incrementVisitors } from '../db/FrameVisitorsModel'
import { upsertContribution } from '../db/ContributionModel'
import { extractClickData } from './extract-click'
import { getISODate, isWithinMaxMinutes } from './time'

/**
 * Maximum length of click data
 */
export const MAX_CLICK_DATA_LENGTH = 10000

/**
 * Information extracted from clickData and signature
 */
export interface SignedClickInfo {
  /**
   * Frame ID in the exchange system
   */
  frameId: bigint
  /**
   * Clicker ID
   */
  fid: bigint
  /**
   * ISO time of the click
   */
  isoTime: string
}

/**
 * Get signed click information with verification
 * @param clickData Click data
 * @param signature Signature of the click's provider
 */
export async function getSignedClickInfo(clickData: string, signature: string): Promise<SignedClickInfo> {
  validateMaxClickDataLength(clickData)
  validateSignatureLength(signature)
  const logProviderAddress = extractLogProvider(clickData, signature)
  const logOwnerId = await getKeyOwnerId(logProviderAddress)

  if (!logOwnerId) {
    throw new Error(`Signature key is not found in the database or inactive: ${logProviderAddress}`)
  }

  const { appUrl, fid, timestamp } = await extractClickData(clickData)
  const frameByUrlInfo = await getFrameDataByUrl(appUrl)

  if (!frameByUrlInfo) {
    throw new Error(`Frame by url is not found: ${appUrl}`)
  }

  if (logOwnerId !== frameByUrlInfo.frame_owner_id) {
    throw new Error(`The signer is not the author of the Frame in which the click was made.`)
  }

  return {
    frameId: frameByUrlInfo.id,
    fid,
    isoTime: timestamp.toISOString(),
  }
}

/**
 * Register a click for analytics and traffic exchange
 * @param frameId Target Frame ID
 * @param fid Clicker ID
 * @param isoTime ISO time of the click
 */
export async function registerClick(frameId: bigint, fid: bigint, isoTime: string): Promise<void> {
  const date = getISODate()
  const previouslyClickedToday = await getUniqueClick(frameId, date, fid)

  if (!previouslyClickedToday) {
    await setUniqueClick(frameId, date, fid)
  }

  // increment visitors for analytics
  await incrementVisitors(frameId, 1, previouslyClickedToday ? 0 : 1, date)
  const clickSourceAppId = await getExpectedClick(frameId, fid)

  // increment contribution only 1 time per day per user for traffic exchange
  if (clickSourceAppId && !previouslyClickedToday) {
    if (isWithinMaxMinutes(isoTime, CLICK_ALLOWED_TIME_MINUTES)) {
      // increment contribution to the source app that registered the click
      await upsertContribution(clickSourceAppId, BigInt(1))
    }

    // remove registration of the click that source app made
    await removeExpectedClick(frameId, fid)
  }
}

/**
 * Validate frameId correctness and existence
 * @param frameId Frame ID
 */
export async function validateFrameId(frameId: number): Promise<void> {
  if (!frameId || !Number.isSafeInteger(frameId)) {
    throw new Error('Invalid frameId')
  }

  if (!(await frameExists(BigInt(frameId)))) {
    throw new Error('Frame not found in the database')
  }
}

/**
 * Validate clickData length
 * @param clickData Click data
 */
export function validateMaxClickDataLength(clickData: string): void {
  if (clickData.length > MAX_CLICK_DATA_LENGTH) {
    throw new Error(`Click data is too long. Max length is ${MAX_CLICK_DATA_LENGTH} characters`)
  }
}
