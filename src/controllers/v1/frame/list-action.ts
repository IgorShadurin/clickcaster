import { Request, Response, NextFunction } from 'express'
import { IAddRequest } from './interface/IAddRequest'
import { processAuthData } from '../../../utils/auth'
import { getConfigData } from '../../../config'
import { IListResponse, IPreparedFrame } from './interface/IListResponse'
import { getFramesByUserId, IFrame } from '../../../db/FrameModel'

/**
 * Prepare list
 * @param list The list
 */
function prepareList(list: IFrame[]): IPreparedFrame[] {
  return list.map(({ id, title, description, created_at }) => ({
    id: Number(id),
    title,
    description,
    created_at: created_at.toISOString(),
  }))
}

export default async (req: Request<IAddRequest>, res: Response<IListResponse>, next: NextFunction): Promise<void> => {
  try {
    const { message, signature, nonce } = req.body
    const { appDomain } = getConfigData()
    const { fid } = await processAuthData(message, signature as `0x${string}`, appDomain, nonce)
    const list = prepareList(await getFramesByUserId(BigInt(fid)))

    res.json({ status: 'ok', list })
  } catch (e) {
    next(e)
  }
}
