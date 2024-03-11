import { db } from './index'

export const TABLE_NAME = 'clicks_frame_visitors'

export interface IClicksFrameVisitor {
  stata_date: string
  all_visitors: bigint
  unique_visitors: bigint
  frame_id: bigint
}

/**
 * Increment `all_visitors` and `unique_visitors` for a given frame and date. If no entry exists for the date, inserts a new row.
 * @param frameId The ID of the frame to update or insert.
 * @param incrementAllVisitors The value to increment `all_visitors` by.
 * @param incrementUniqueVisitors The value to increment `unique_visitors` by.
 * @param stataDate The date for which to increment or insert visitor counts.
 */
export async function incrementVisitors(
  frameId: bigint,
  incrementAllVisitors: number,
  incrementUniqueVisitors: number,
  stataDate: string,
): Promise<void> {
  // todo the info about record existence can be cached
  const existingRow = await db(TABLE_NAME)
    .where({
      frame_id: frameId,
      stata_date: stataDate,
    })
    .first()

  if (existingRow) {
    await db(TABLE_NAME)
      .where({
        frame_id: frameId,
        stata_date: stataDate,
      })
      .update({
        all_visitors: db.raw(`all_visitors + ?`, [incrementAllVisitors]),
        unique_visitors: db.raw(`unique_visitors + ?`, [incrementUniqueVisitors]),
      })
  } else {
    // If no row exists for this date, insert a new one
    await db(TABLE_NAME).insert({
      frame_id: frameId,
      stata_date: stataDate,
      all_visitors: incrementAllVisitors,
      unique_visitors: incrementUniqueVisitors,
    })
  }
}

/**
 * Retrieves visitor count information for a specific app and date.
 * @param frameId The ID of the frame to query.
 * @param stataDate The date for which to retrieve visitor counts.
 */
export async function getVisitorsCount(
  frameId: bigint,
  stataDate: string,
): Promise<{ all_visitors: bigint; unique_visitors: bigint }> {
  const result = await db(TABLE_NAME)
    .select('all_visitors', 'unique_visitors')
    .where({
      frame_id: frameId,
      stata_date: stataDate,
    })
    .first()

  if (result) {
    return { all_visitors: BigInt(result.all_visitors), unique_visitors: BigInt(result.unique_visitors) }
  } else {
    return { all_visitors: BigInt(0), unique_visitors: BigInt(0) }
  }
}
