import { getPage, getPublicUrl } from './utils'

export default function page(): string {
  const previewImage = getPublicUrl(`static/friends_1.jpg?1`)
  const content = `
    <meta property="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${previewImage}">
    <meta name="og:image" content="${previewImage}">
    <meta name="fc:frame:button:1" content="Who Visited My Page ❓❓❓">
    `

  return getPage(content)
}
