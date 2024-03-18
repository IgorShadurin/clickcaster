/**
 * Validate frame URL by checking the frame owner tag
 * @param url URL
 * @param fid Frame owner ID
 */
export async function validateFrameUrl(url: string, fid: number): Promise<void> {
  const expectedTag = `<meta property="frame:owner" content="${fid}"/>`
  const pageText = await (await fetch(url)).text()

  if (!pageText.includes(expectedTag)) {
    throw new Error('Cannot find the frame owner tag on the page. Please add the tag to the page.')
  }
}
