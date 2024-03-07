import path from 'path'
import fs from 'fs'
import { getConfigData } from '../../../../config'

/**
 * Get the page with the content
 * @param content The content to insert into the page
 */
export function getPage(content: string): string {
  const htmlPath = path.join(__dirname, '../templates/index.html')
  const html = fs.readFileSync(htmlPath, 'utf8')

  return html.replace('<!-- content -->', content)
}

/**
 * Get the friends page with the content
 * @param content The content to insert into the page
 * @param totalVisitors
 */
export function getFriendsPage(content: string, totalVisitors: number): string {
  const htmlPath = path.join(__dirname, '../templates/friends-list.html')
  const html = fs.readFileSync(htmlPath, 'utf8')

  return html.replace('<!-- content -->', content).replace('<!-- total -->', totalVisitors.toString())
}

/**
 * Gets the public URL.
 * @param url URL
 */
export function getPublicUrl(url: string): string {
  const { publicUrl } = getConfigData()

  return new URL(url, publicUrl).toString()
}
