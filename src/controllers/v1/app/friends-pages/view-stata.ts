import { getPage, getPublicUrl } from './utils'
import { getVisitorCount } from '../../../../db/FriendsVisitsModel'

export default async function page(pageOwnerId: number): Promise<string> {
  const previewImage = getPublicUrl(`static/friends_list.jpg?2`)
  const totalVisitors = await getVisitorCount(pageOwnerId)
  const listPage = getPublicUrl(`v1/app/friends-list?id=${pageOwnerId}`)

  const content = `
    <meta property="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${previewImage}">
    <meta name="og:image" content="${previewImage}">
    <meta name="fc:frame:button:1" content="🔄 Total: ${totalVisitors}">
    
    <meta name="fc:frame:button:2" content="Show The List">
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="${listPage}" />
    `

  return getPage(content)
}
