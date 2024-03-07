import { getPage, getPublicUrl } from '../friends-pages/utils'

export default function page(): string {
  const previewImage = getPublicUrl(`static/email_1.jpg?1`)
  const content = `
    <meta property="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${previewImage}">
    <meta name="og:image" content="${previewImage}">
    <meta name="fc:frame:input:text" content="Enter your Email">
    
    <meta name="fc:frame:button:1" content="✅ Subscribe">
    `

  return getPage(content)
}
