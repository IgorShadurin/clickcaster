import { db } from './index'

export const TABLE_NAME = 'clicks_frame_visitors'

export interface IClicksFrameVisitor {
  stata_date: string
  all_visitors: bigint
  unique_visitors: bigint
  frame_id: bigint
}

export interface IFramesStatistics {
  [key: string]: { totalAllVisitors: bigint; totalUniqueVisitors: bigint }
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
): Promise<Omit<IClicksFrameVisitor, 'stata_date' | 'frame_id'>> {
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

/**
 * Retrieves visitor statistics for a list of frame IDs.
 * @param frameIds The list of frame IDs to query.
 */
export async function getVisitorsStatsByFrames(frameIds: bigint[]): Promise<IFramesStatistics> {
  const stats = await db(TABLE_NAME)
    .whereIn(
      'frame_id',
      frameIds.map(id => id.toString()),
    )
    .groupBy('frame_id')
    .select('frame_id')
    .select(db.raw('SUM(all_visitors) as totalAllVisitors, SUM(unique_visitors) as totalUniqueVisitors'))

  // Initialize the result object with all frame IDs set to zero statistics
  const result: IFramesStatistics = frameIds.reduce<IFramesStatistics>((acc, frameId) => {
    acc[frameId.toString()] = { totalAllVisitors: BigInt(0), totalUniqueVisitors: BigInt(0) }

    return acc
  }, {})

  // Populate the result object with actual statistics from the query
  stats.forEach(stat => {
    result[stat.frame_id.toString()] = {
      totalAllVisitors: BigInt(stat.totalAllVisitors),
      totalUniqueVisitors: BigInt(stat.totalUniqueVisitors),
    }
  })

  return result
}

/**
 * Retrieves the total count of all visitors and unique visitors across all frames and dates.
 */
export async function getTotalVisitorsAndUniqueVisitors(): Promise<{
  totalAllVisitors: bigint
  totalUniqueVisitors: bigint
}> {
  const results = await db(TABLE_NAME).select(
    db.raw('SUM(all_visitors) as totalAllVisitors, SUM(unique_visitors) as totalUniqueVisitors'),
  )

  if (results.length > 0 && results[0].totalAllVisitors !== null && results[0].totalUniqueVisitors !== null) {
    return {
      totalAllVisitors: BigInt(results[0].totalAllVisitors),
      totalUniqueVisitors: BigInt(results[0].totalUniqueVisitors),
    }
  } else {
    // Return zeros if no data found or in case of an unexpected null value
    return { totalAllVisitors: BigInt(0), totalUniqueVisitors: BigInt(0) }
  }
}
