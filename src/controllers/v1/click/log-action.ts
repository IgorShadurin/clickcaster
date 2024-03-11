import { Request, Response, NextFunction } from 'express'
import { IRegisterResponse } from './interface/IRegisterResponse'
import { ILogRequest } from './interface/ILogRequest'
import { getSignedClickInfo, registerClick } from '../../../utils/click'

export default async (
  req: Request<ILogRequest>,
  res: Response<IRegisterResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { clickData, signature } = req.body
    const { frameId, fid } = await getSignedClickInfo(clickData, signature)
    await registerClick(frameId, fid)

    res.json({ status: 'ok' })
  } catch (e) {
    next(e)
  }
}
