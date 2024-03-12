import { Request, Response, NextFunction } from 'express'
import { IAddResponse } from './interface/IAddResponse'
import { IAddRequest } from './interface/IAddRequest'
import { ACCESS_KEY_LENGTH, keyExists, keyInsert } from '../../../db/AccessKeyModel'
import { processAuthData } from '../../../utils/auth'
import { getConfigData } from '../../../config'

/**
 * Add key for tracking traffic
 * @param req Request
 * @param res Response
 * @param next Next function
 */
export default async (req: Request<IAddRequest>, res: Response<IAddResponse>, next: NextFunction): Promise<void> => {
  try {
    const { key, message, signature, nonce } = req.body

    if (process.env.ENV_TYPE === 'production' && nonce === 'zqFSIZNWpnfensOJk') {
      throw new Error('Invalid "nonce". You are not allowed to use this nonce.')
    }

    const { appDomain } = getConfigData()
    const { fid } = await processAuthData(message, signature as `0x${string}`, appDomain, nonce)

    if (!key || key.length !== ACCESS_KEY_LENGTH) {
      throw new Error('Invalid "key"')
    }

    if (await keyExists(key)) {
      throw new Error('Key already exists')
    }

    await keyInsert(BigInt(fid), key, true)
    res.json({ status: 'ok' })
  } catch (e) {
    next(e)
  }
}
