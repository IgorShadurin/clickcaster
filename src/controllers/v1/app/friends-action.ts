import { Request, Response, NextFunction } from 'express'
import { NeynarAPIClient } from '@neynar/nodejs-sdk'
import { getConfigData } from '../../../config'
import indexPage from './friends-pages'
import installPage from './friends-pages/install'
import { insertVisit } from './friends-utils'
import viewStataPage from './friends-pages/view-stata'
import { userExists } from '../../../db/UserModel'

async function processClick(pageOwnerId: number, frameData: string): Promise<string | undefined> {
  const { neynarApiKey } = getConfigData()
  const client = new NeynarAPIClient(neynarApiKey)
  const result = await client.validateFrameAction(frameData)

  if (result.valid && result.action) {
    const { fid } = result.action!.interactor

    if (fid === pageOwnerId) {
      return viewStataPage(fid)
    } else {
      await insertVisit(pageOwnerId, result)

      return installPage(fid)
    }
  }
}

export default async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
  try {
    const pageOwnerId = req.query.id
    const frameData = req.body?.trustedData?.messageBytes

    const isCorrectPageOwner = pageOwnerId && (await userExists(Number(pageOwnerId)))
    const resultPage =
      (isCorrectPageOwner && frameData && (await processClick(Number(pageOwnerId), frameData))) || indexPage()

    res.send(resultPage)
  } catch (e) {
    next(e)
  }
}
