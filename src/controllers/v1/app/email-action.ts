import { Request, Response, NextFunction } from 'express'
import { NeynarAPIClient } from '@neynar/nodejs-sdk'
import { getConfigData } from '../../../config'
import indexPage from './email-pages'
import endPage from './email-pages/end'
import { ApiKeySession, ListEnum, ProfileBulkImportJobEnum, ProfileEnum, ProfilesApi } from 'klaviyo-api'
import validator from 'email-validator'
import { upsertUser } from '../../../db/UserModel'
import { ValidateFrameActionResponse } from '@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster'
import { currentYMDHIS } from '../../../db/utils'

async function processClick(frameData: string): Promise<{
  fid: number
  email: string
  profile_image: string
  display_name: string
  username: string
  rawData: ValidateFrameActionResponse
}> {
  const { neynarApiKey } = getConfigData()
  const client = new NeynarAPIClient(neynarApiKey)
  const result = await client.validateFrameAction(frameData)

  // https://THE_SITE/v1/app/email
  // console.log('result.action.url', (result.action as any).url)
  if (!result.valid) {
    throw new Error('Invalid frame data')
  }

  const email = result.action?.input?.text || ''
  const { fid, pfp_url: profile_image, display_name, username } = result.action!.interactor

  return { fid, email, profile_image, display_name, username, rawData: result }
}

async function subscribeEmail(email: string, name: string, avatarUrl: string, fid: number): Promise<void> {
  email = email.trim()

  if (!validator.validate(email)) {
    throw new Error('Invalid email')
  }

  const { klaviyoApiKey, klaviyoListId } = getConfigData()

  const session = new ApiKeySession(klaviyoApiKey)
  const profilesApi = new ProfilesApi(session)

  const data = {
    data: {
      type: ProfileBulkImportJobEnum.ProfileBulkImportJob,
      attributes: {
        profiles: {
          data: [
            {
              type: ProfileEnum.Profile,
              attributes: {
                email: email,
                first_name: name,
                fid: fid.toString(),
                image: avatarUrl,
              },
            },
          ],
        },
      },
      relationships: {
        lists: {
          data: [
            {
              type: ListEnum.List,
              id: klaviyoListId,
            },
          ],
        },
      },
    },
  }

  await profilesApi.spawnBulkProfileImportJob(data)
}

export default async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
  try {
    const frameData = req.body?.trustedData?.messageBytes
    let resultPage = indexPage()

    try {
      if (frameData) {
        const { email, display_name, profile_image, fid, username, rawData } = await processClick(frameData)
        await subscribeEmail(email, display_name, profile_image, fid)

        await upsertUser({
          fid,
          username,
          display_name,
          profile_image,
          data: JSON.stringify(rawData),
        })

        resultPage = endPage()
        console.log(`[${currentYMDHIS()}] Email subscribed! ${fid} ${email}`)
      }
    } catch (e) {
      console.log(`Email processing error: ${(e as Error).message}`)
    }

    res.send(resultPage)
  } catch (e) {
    next(e)
  }
}
