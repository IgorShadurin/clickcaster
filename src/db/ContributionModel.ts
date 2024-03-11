import { db } from './index'

export const TABLE_NAME = 'clicks_contribution'

export interface IContribution {
  balance: bigint
  frame_id: bigint
}

/**
 * Upserts contribution balance by incrementing existing balance or inserting a new record.
 * @param frameId The ID of the frame.
 * @param incrementBalance The value to increment the balance by.
 */
export async function upsertContribution(frameId: bigint, incrementBalance: bigint): Promise<void> {
  await db(TABLE_NAME)
    .insert({
      frame_id: frameId,
      balance: incrementBalance,
    })
    .onConflict('frame_id')
    .merge({
      balance: db.raw('balance + ?', [incrementBalance]),
    })
}

/**
 * Retrieves the balance for a given frame_id.
 * @param frameId The ID of the frame to search for.
 * @returns The balance as bigint or bigint 0 if not found.
 */
export async function getBalance(frameId: bigint): Promise<bigint> {
  const result = await db(TABLE_NAME).select('balance').where('frame_id', frameId.toString()).first()

  return result ? BigInt(result.balance) : BigInt(0)
}
