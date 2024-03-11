import { Request, Response, NextFunction } from 'express'
import { IAddResponse } from './interface/IAddResponse'
import { IAddRequest } from './interface/IAddRequest'
import { ACCESS_KEY_LENGTH, keyExists, keyInsert } from '../../../db/AccessKeyModel'
import { processAuthData } from '../../../utils/auth'

export default async (req: Request, res: Response<IAddResponse>, next: NextFunction): Promise<void> => {
  try {
    const { key, auth } = req.body as IAddRequest
    // todo verify auth data from auth to identity the user by Farcaster protocol
    // todo add or update the user from auth data
    const userId = await processAuthData(auth)

    if (!key || key.length !== ACCESS_KEY_LENGTH) {
      throw new Error('Invalid "key"')
    }

    if (await keyExists(key)) {
      throw new Error('Key already exists')
    }

    await keyInsert(userId, key, true)

    res.json({ status: 'ok' })
  } catch (e) {
    next(e)
  }
}
