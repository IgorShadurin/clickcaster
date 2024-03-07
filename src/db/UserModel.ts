import { db } from './index'

export const TABLE_NAME = 'warpcast_user'

export interface IUser {
  fid: number
  username: string
  display_name: string
  profile_image: string
  data: string
  created_at: string
  updated_at: string
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
