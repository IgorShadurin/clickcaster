import { Request, Response, NextFunction } from 'express'
import { IAddRequest } from './interface/IAddRequest'
import { processAuthData } from '../../../utils/auth'
import { getConfigData } from '../../../config'
import { IListResponse, IPreparedFrame } from './interface/IListResponse'
import { getFramesByUserId, IFrame } from '../../../db/FrameModel'
import { getVisitorsStatsByFrames, IFramesStatistics } from '../../../db/FrameVisitorsModel'

/**
 * Prepare list
 * @param list The list
 * @param statistics The statistics
 */
function prepareList(list: IFrame[], statistics: IFramesStatistics): IPreparedFrame[] {
  return list.map(({ id, title, description, url, created_at }) => {
    const result: IPreparedFrame = {
      id: Number(id),
      title,
      description,
      url,
      statistics: {
        total_actions: Number(statistics[id.toString()].totalAllVisitors),
        unique_users: Number(statistics[id.toString()].totalUniqueVisitors),
      },
      created_at: created_at.toISOString(),
    }

    return result
  })
}

export default async (req: Request<IAddRequest>, res: Response<IListResponse>, next: NextFunction): Promise<void> => {
  try {
    const { message, signature, nonce } = req.body
    const { appDomain } = getConfigData()
    const { fid } = await processAuthData(message, signature as `0x${string}`, appDomain, nonce)
    const frames = await getFramesByUserId(BigInt(fid))
    // todo cache the list for N minutes
    const list = prepareList(frames, await getVisitorsStatsByFrames(frames.map(({ id }) => id)))

    res.json({ status: 'ok', list })
  } catch (e) {
    next(e)
  }
}
