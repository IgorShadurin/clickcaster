import { db } from './index'

export const TABLE_NAME = 'warpcast_user'

export interface IUser {
  fid: bigint
  username: string
  display_name: string
  profile_image: string
  data: string
  created_at: string
  updated_at: string
  is_clickcaster?: boolean
}

/**
 * Upsert the user.
 * @param userData User data
 */
export async function upsertUser(userData: Omit<IUser, 'created_at' | 'updated_at'>): Promise<void> {
  const date = db.fn.now()
  // in the rare cases the data can be null
  userData.display_name = userData.display_name || ''
  userData.profile_image = userData.profile_image || ''
  userData.username = userData.username || ''
  const newItem = { ...userData, updated_at: date }

  await db(TABLE_NAME)
    .insert({ ...newItem, created_at: date })
    .onConflict('fid')
    .merge(newItem)
}

/**
 * Gets the user by the fid.
 * @param fid User fid
 */
export async function userExists(fid: number): Promise<boolean> {
  const result = await db(TABLE_NAME).where('fid', fid).first()

  return Boolean(result)
}

/**
 * Gets total users count.
 */
export async function getTotalUsersCount(): Promise<number> {
  const result = await db(TABLE_NAME).count({ count: '*' }).first()

  return Number(result?.count) || 0
}

/**
 * Updates the is_clickcaster status for a given user identified by fid.
 * This operation will attempt to update directly, without a preceding check for the user's existence.
 * @param fid The unique identifier for the user.
 * @param isClickcaster The new is_clickcaster value to be updated.
 */
export async function updateUserIsClickcaster(fid: number, isClickcaster: boolean): Promise<void> {
  await db(TABLE_NAME).where('fid', fid).update({
    is_clickcaster: isClickcaster,
    updated_at: db.fn.now(), // Update the updated_at field to the current time
  })
}

/**
 * Retrieves a user by their fid.
 * @param fid The unique identifier for the user.
 * @returns The user data if found, or null if not found.
 */
export async function getUserByFid(fid: number): Promise<IUser> {
  const result = await db(TABLE_NAME).where('fid', fid).first()

  if (!result) {
    throw new Error(`User with fid ${fid} not found`)
  }

  return result as IUser
}

/**
 * Gets the count of users who are marked as clickcasters.
 * @returns The count of users with is_clickcaster === true.
 */
export async function getCountOfClickcasters(): Promise<number> {
  const result = await db(TABLE_NAME)
    .where('is_clickcaster', true)
    .count({ count: '*' })
    .first();

  return Number(result?.count) || 0;
}
