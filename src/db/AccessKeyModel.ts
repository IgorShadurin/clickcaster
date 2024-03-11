import { db } from './index'

export const TABLE_NAME = 'clicks_access_key'

export const ACCESS_KEY_LENGTH = 40

/**
 * Access key interface
 */
interface IAccessKey {
  id?: number
  eth_address: string
  active: boolean
  user_id: bigint
  created_at: string
  updated_at: string
}

/**
 * Check if the key exists
 * @param key The key
 */
export async function keyExists(key: string): Promise<boolean> {
  key = key.toLowerCase()
  const result = await db(TABLE_NAME).where('eth_address', key).first()

  return Boolean(result)
}

/**
 * Insert the key
 * @param userId The user ID
 * @param key The key
 * @param active The key status
 */
export async function keyInsert(userId: bigint, key: string, active: boolean): Promise<void> {
  const date = db.fn.now() as unknown as string
  const data: IAccessKey = {
    eth_address: key.toLowerCase(),
    active,
    user_id: userId,
    created_at: date,
    updated_at: date,
  }
  await db(TABLE_NAME).insert(data)
}

/**
 * Extracts the owner ID of an access key.
 * @param key The access key.
 * @returns The user ID associated with the access key or undefined if not found.
 */
export async function getKeyOwnerId(key: string): Promise<bigint | undefined> {
  key = key.toLowerCase()
  const result = await db(TABLE_NAME).select('user_id').where('eth_address', key).andWhere('active', true).first()

  return result ? BigInt(result.user_id) : undefined
}
