import { Request, Response, NextFunction } from 'express'
import { IStata, IStataResponse } from './interface/IStataResponse'
import { getTotalVisitorsAndUniqueVisitors } from '../../../db/FrameVisitorsModel'
import { getFrameCount } from '../../../db/FrameModel'
import { getCountOfClickcasters } from '../../../db/UserModel'
import { getStata, setStata } from '../../../utils/memcached/clicks'

export default async (req: Request, res: Response<IStataResponse>, next: NextFunction): Promise<void> => {
  try {
    const stataRaw = await getStata()

    let stata: IStata

    if (stataRaw) {
      stata = JSON.parse(stataRaw) as IStata
    } else {
      const clicks = await getTotalVisitorsAndUniqueVisitors()
      const frames = await getFrameCount()
      const users = await getCountOfClickcasters()
      stata = {
        users: users,
        frames: Number(frames),
        all_clicks: Number(clicks.totalAllVisitors),
      }
      await setStata(JSON.stringify(stata))
    }

    res.json({
      status: 'ok',
      stata,
    })
  } catch (e) {
    next(e)
  }
}
