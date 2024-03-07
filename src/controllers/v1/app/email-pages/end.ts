import { getPage, getPublicUrl } from '../friends-pages/utils'

export default function page(): string {
  const previewImage = getPublicUrl(`static/email_end.jpg?1`)
  const message = encodeURIComponent(`🔴 20,000 OP will be distributed by us at the Hackathon this summer.
- Can you use ChatGPT? -Join!
- Can you code? -Join!
- Experienced in affiliate marketing? -Join!
@dappykit`)
  const appUrl = getPublicUrl(`v1/app/email`)
  const buttonUrl = `https://warpcast.com/~/compose?text=${message}&embeds[]=${appUrl}`

  const content = `
    <meta property="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${previewImage}">
    <meta name="og:image" content="${previewImage}">
    
    <meta name="fc:frame:button:1" content="SHARE">
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${buttonUrl}" />
    `

  return getPage(content)
}
