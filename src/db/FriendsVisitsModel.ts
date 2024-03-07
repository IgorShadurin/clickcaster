import { db } from './index'

export const TABLE_NAME = 'friends_visits'

interface IFriendsVisit {
  id: number
  page_owner_id: number
  visitor_id: number
  created_at: string
  updated_at: string
}

/**
 * Upsert the visit.
 * @param item Visit data
 */
export async function upsertVisit(item: Omit<IFriendsVisit, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
  const date = db.fn.now()
  const newItem = { ...item, updated_at: date }

  await db(TABLE_NAME)
    .insert({ ...newItem, created_at: date })
    .onConflict(['page_owner_id', 'visitor_id'])
    .merge(newItem)
}

/**
 * Get the visitor count.
 * @param pageOwnerId The page owner ID
 */
export async function getVisitorCount(pageOwnerId: number): Promise<number> {
  const count = await db(TABLE_NAME).where('page_owner_id', pageOwnerId).count({ count: '*' }).first()

  return count ? Number(count.count) : 0
}

export async function listVisits(pageOwnerId: number, limit: number = 1000): Promise<IFriendsVisit[]> {
  return db(TABLE_NAME).where('page_owner_id', pageOwnerId).orderBy('created_at', 'desc').limit(limit)
}

export async function listVisitsWithUserInfo(pageOwnerId: number, limit: number = 1000): Promise<unknown[]> {
  return db(`${TABLE_NAME} as fv`)
    .join('warpcast_user as wu', 'fv.visitor_id', 'wu.fid')
    .select(
      'fv.*',
      'wu.username',
      'wu.display_name',
      'wu.profile_image',
      'wu.data',
      'wu.fid',
      'wu.created_at as user_created_at',
      'wu.updated_at as user_updated_at',
    )
    .where('fv.page_owner_id', pageOwnerId)
    .orderBy('fv.created_at', 'desc')
    .limit(limit)
}
