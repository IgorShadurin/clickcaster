import { Request, Response, NextFunction } from 'express'
import { IPublicFramesStata, IPublicStataResponse } from './interface/IStataResponse'
import { getImportedFrames, IImportedFrames } from '../../../db/FrameModel'
import { getCumulativeStats } from '../../../db/FrameVisitorsModel'
import { getPublicFramesStata, setPublicFramesStata } from '../../../utils/memcached/clicks'

function extractUniqueIds(data: IImportedFrames): bigint[] {
  const allIds: bigint[] = []

  for (const key in data) {
    const items = data[key]
    items.forEach(item => allIds.push(item.id))
  }

  return [...new Set(allIds)]
}

export default async (req: Request, res: Response<IPublicStataResponse>, next: NextFunction): Promise<void> => {
  try {
    const cachedStata = await getPublicFramesStata()
    let stata: IPublicFramesStata = {}
    let sortedOwnerIds

    if (cachedStata) {
      ;({ stata, sortedOwnerIds } = JSON.parse(cachedStata))
    } else {
      const importedFrames = await getImportedFrames()
      const frameIds = extractUniqueIds(importedFrames)
      const stats = await getCumulativeStats(frameIds, '2024-05-23', '2024-07-31')

      const ownerStats: { ownerId: number; maxUniqueVisitors: number }[] = []

      for (const ownerId in importedFrames) {
        const frames = importedFrames[ownerId]
        stata[ownerId] = {}

        let maxUniqueVisitors = 0

        frames.forEach(frame => {
          const frameId = Number(frame.id)
          const frameStats = stats[frame.id.toString()]

          const uniqueVisitors = Number(frameStats.totalUniqueVisitors)
          const allVisitors = Number(frameStats.totalAllVisitors)

          stata[ownerId][frameId] = {
            unique: uniqueVisitors,
            all: allVisitors,
          }

          if (uniqueVisitors > maxUniqueVisitors) {
            maxUniqueVisitors = uniqueVisitors
          }
        })

        ownerStats.push({ ownerId: Number(ownerId), maxUniqueVisitors })
      }

      ownerStats.sort((a, b) => b.maxUniqueVisitors - a.maxUniqueVisitors)
      sortedOwnerIds = ownerStats.map(stat => stat.ownerId)
      await setPublicFramesStata(JSON.stringify({ stata, sortedOwnerIds }))
    }

    res.json({
      status: 'ok',
      stata,
      sortedOwnerIds,
    })
  } catch (e) {
    next(e)
  }
}
