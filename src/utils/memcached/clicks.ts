import Memcached from 'memcached'
import util from 'util'

export const memcached = new Memcached(process.env.MEMCACHED_URL || 'localhost:11211')
const NAMESPACE = 'clicks_ns'
const EXPECTED_CLICK_TO = 'expected_click_to'
const UNIQUE_CLICK = 'unique_click'

/**
 * Expected click expiration time in seconds
 */
const EXPECTED_CLICK_EXPIRATION_SECONDS = 60 * 5 // 5 minutes

/**
 * Unique click expiration time in seconds
 */
const UNIQUE_CLICK_EXPIRATION_SECONDS = 60 * 60 * 24 // 24 hours

const memcachedGet = util.promisify(memcached.get).bind(memcached)
const memcachedSet = util.promisify(memcached.set).bind(memcached)
const memcachedDel = util.promisify(memcached.del).bind(memcached)
const memcachedFlush = util.promisify(memcached.flush).bind(memcached)

/**
 * Get key for Memcached
 * @param params Key parts
 */
export function getKey(...params: string[]): string {
  return [NAMESPACE, ...params].join(':')
}

/**
 * Remove all data from Memcached
 */
export async function removeAll(): Promise<boolean[]> {
  return memcachedFlush()
}

/**
 * Register expected click
 * @param fromAppId From App ID
 * @param toAppId To App ID
 * @param fid User ID
 */
export async function setExpectedClick(fromAppId: bigint, toAppId: bigint, fid: bigint): Promise<void> {
  await memcachedSet(
    getKey(EXPECTED_CLICK_TO, toAppId.toString(), fid.toString()),
    fromAppId.toString(),
    EXPECTED_CLICK_EXPIRATION_SECONDS,
  )
}

/**
 * Remove expected click
 * @param toAppId To App ID
 * @param fid User ID
 */
export async function removeExpectedClick(toAppId: bigint, fid: bigint): Promise<void> {
  await memcachedDel(getKey(EXPECTED_CLICK_TO, toAppId.toString(), fid.toString()))
}

/**
 * Get expected click source app id
 * @param toAppId Target app id
 * @param fid User ID
 */
export async function getExpectedClick(toAppId: bigint, fid: bigint): Promise<bigint | undefined> {
  const result = await memcachedGet(getKey(EXPECTED_CLICK_TO, toAppId.toString(), fid.toString()))

  if (result !== undefined) {
    return BigInt(result)
  }

  return undefined
}

/**
 * Save unique click for the app, date and user
 * @param appId App ID
 * @param date Date
 * @param userId User ID
 */
export async function setUniqueClick(appId: bigint, date: string, userId: bigint): Promise<void> {
  await memcachedSet(
    getKey(UNIQUE_CLICK, appId.toString(), date, userId.toString()),
    '1',
    UNIQUE_CLICK_EXPIRATION_SECONDS,
  )
}

/**
 * Get unique click for the app, date and user
 * @param appId App ID
 * @param date Date
 * @param userId User ID
 */
export async function getUniqueClick(appId: bigint, date: string, userId: bigint): Promise<boolean> {
  return (await memcachedGet(getKey(UNIQUE_CLICK, appId.toString(), date, userId.toString()))) !== undefined
}
