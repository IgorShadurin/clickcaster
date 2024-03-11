import { upsertUser } from '../../../db/UserModel'
import { upsertVisit } from '../../../db/FriendsVisitsModel'
import { ValidateFrameActionResponse } from '@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster'

/**
 * Inserts information about the visit into the database.
 * @param pageOwnerId The ID of the page owner.
 * @param data The data about the visit.
 */
export async function insertVisit(pageOwnerId: number, data: ValidateFrameActionResponse): Promise<void> {
  const { fid, username, pfp_url: profile_image, display_name } = data.action!.interactor

  await upsertUser({
    fid: BigInt(fid),
    username,
    display_name,
    profile_image,
    data: JSON.stringify(data),
  })

  await upsertVisit({
    page_owner_id: pageOwnerId,
    visitor_id: fid,
  })
}
