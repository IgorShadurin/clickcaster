import { Request, Response, NextFunction } from 'express'
import { getVisitorCount, listVisitsWithUserInfo } from '../../../db/FriendsVisitsModel'
import { getFriendsPage } from './friends-pages/utils'
import { getTotalUsersCount, IUser } from '../../../db/UserModel'

export default async (req: Request, res: Response<string>, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.query.id)
    let page = getFriendsPage('Info not found', 0)

    if (isNaN(id)) {
      const totalUsers = await getTotalUsersCount()
      page = getFriendsPage('Info not found', totalUsers)
    } else {
      const items = await listVisitsWithUserInfo(id)

      if (items && items.length) {
        const totalVisitors = await getVisitorCount(id)
        const maxSize = 70
        page = getFriendsPage(
          items
            .map((item: unknown) => {
              const data = item as IUser

              return `<p><img class="rounded-circle" src="${data.profile_image}" style="height: ${maxSize}px; width: ${maxSize}px; object-fit: cover;"/>  <a target="_blank" href="https://warpcast.com/${data.username}">@${data.username}</a> (fid: ${data.fid})</p>`
            })
            .join(''),
          totalVisitors,
        )
      }
    }
    res.send(page)
  } catch (e) {
    next(e)
  }
}
