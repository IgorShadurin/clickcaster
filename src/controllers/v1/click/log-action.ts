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
    const { frameId, fid, isoTime } = await getSignedClickInfo(clickData, signature)
    await registerClick(frameId, fid, isoTime)

    res.json({ status: 'ok' })
  } catch (e) {
    console.error('click/log error', e, req.body) // eslint-disable-line no-console
    next(e)
  }
}
