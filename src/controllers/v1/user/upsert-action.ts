import { Request, Response, NextFunction } from 'express'
import { IUpsertResponse } from './interface/IUpsertResponse'
import { IUpsertRequest } from './interface/IUpsertRequest'
import { processAuthData } from '../../../utils/auth'
import { getConfigData } from '../../../config'
import { updateUserIsClickcaster, upsertUser, userExists } from '../../../db/UserModel'

export default async (
  req: Request<IUpsertRequest>,
  res: Response<IUpsertResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { message, signature, nonce } = req.body
    const { appDomain } = getConfigData()
    const { fid } = await processAuthData(message, signature as `0x${string}`, appDomain, nonce)

    if (!(await userExists(fid))) {
      await upsertUser({
        fid: BigInt(fid),
        username: '',
        display_name: '',
        profile_image: '',
        data: '',
        is_clickcaster: true,
      })
    } else {
      await updateUserIsClickcaster(fid, true)
    }

    res.json({ status: 'ok' })
  } catch (e) {
    next(e)
  }
}
