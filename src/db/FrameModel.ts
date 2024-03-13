import { db } from './index'

export const TABLE_NAME = 'clicks_frame'

/**
 * DB limit for indexed urls
 */
export const MAX_URL_LENGTH = 768

export interface IFrame {
  id: bigint
  title: string
  description: string
  url: string
  data: string
  verify_tag?: string
  promo_data: string
  promo_approved: boolean
  frame_owner_id: bigint
  created_at: Date
  updated_at: Date
}

export type IFrameData = Omit<IFrame, 'id' | 'created_at' | 'updated_at'>

/**
 * Inserts a new frame
 * @param frame The frame data to insert
 */
export async function insertFrame(frame: IFrameData): Promise<bigint> {
  if (frame.url.length > MAX_URL_LENGTH) {
    throw new Error(`URL is too long: ${frame.url.length} > ${MAX_URL_LENGTH}`)
  }

  const date = db.fn.now()
  const result = await db(TABLE_NAME).insert({
    title: frame.title,
    description: frame.description,
    url: frame.url,
    data: frame.data,
    verify_tag: frame.verify_tag,
    promo_data: frame.promo_data,
    promo_approved: frame.promo_approved,
    frame_owner_id: frame.frame_owner_id,
    created_at: date,
    updated_at: date,
  })

  return BigInt(result[0])
}

/**
 * Retrieves all data for a frame based on its URL.
 * @param url The URL of the frame to search for.
 * @returns All frame data associated with the URL or undefined if not found.
 */
export async function getFrameDataByUrl(url: string): Promise<IFrame | undefined> {
  const result = await db(TABLE_NAME).where('url', url).first()
  const frameResult = result as IFrame

  if (frameResult) {
    frameResult.frame_owner_id = BigInt(frameResult.frame_owner_id)
  }

  return result ? frameResult : undefined
}

/**
 * Retrieves the count of frames in the table.
 * @returns The count of items as bigint or 0.
 */
export async function getFrameCount(): Promise<bigint> {
  const result = await db(TABLE_NAME).count({ count: '*' }).first()

  return result ? BigInt(result.count as string) : BigInt(0)
}

/**
 * Checks if a frame exists by its ID.
 * @param frameId The ID of the frame to search for.
 * @returns true if the frame exists, false otherwise.
 */
export async function frameExists(frameId: bigint): Promise<boolean> {
  const result = await db(TABLE_NAME)
    .select('id')
    .where('id', frameId.toString()) // Convert bigint to string for compatibility
    .first()

  return Boolean(result)
}

/**
 * Retrieves a frame by owner ID
 * @param userId The ID of the user to search for.
 * @param limit The maximum number of frames to retrieve.
 */
export async function getFramesByUserId(userId: bigint, limit = 100): Promise<IFrame[]> {
  const result = await db(TABLE_NAME).where('frame_owner_id', userId.toString()).orderBy('id', 'desc').limit(limit)

  return result.map(frame => {
    frame.frame_owner_id = BigInt(frame.frame_owner_id)

    return frame as IFrame
  })
}

/**
 * Retrieves a frame by its ID
 * @param frameId The ID of the frame to search for.
 */
export async function getFrameById(frameId: bigint): Promise<IFrame> {
  const result = await db(TABLE_NAME).where('id', frameId.toString()).first()

  if (result) {
    result.frame_owner_id = BigInt(result.frame_owner_id)
  } else {
    throw new Error('Frame not found')
  }

  return result
}
