import { getPage, getPublicUrl } from './utils'

/**
 * Page with explanation of reposting the app
 * @param userId User ID for which the target URL will be generated
 */
export default function page(userId: string | number): string {
  const previewImage = getPublicUrl(`static/friends_install.jpg?1`)
  const appUrl = getPublicUrl(`v1/app/friends?id=${userId}`)
  const message = encodeURIComponent(`🚀 Wow! Now I can find out who visited my page! @dappykit`)
  const buttonUrl = `https://warpcast.com/~/compose?text=${message}&embeds[]=${appUrl}`

  const content = `
    <meta property="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${previewImage}">
    <meta name="og:image" content="${previewImage}">
    <meta name="fc:frame:button:1" content="Publish">
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${buttonUrl}" />
    `

  return getPage(content)
}
