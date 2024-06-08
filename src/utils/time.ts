/**
 * Returns the current GMT+0 date in the format YYYY-MM-DD.
 */
export function getISODate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Checks if the given ISO time is within the specified number of minutes.
 * @param isoTime The ISO time to check.
 * @param maxMinutes The maximum number of minutes.
 */
export function isWithinMaxMinutes(isoTime: string, maxMinutes: number): boolean {
  const passedTime = new Date(isoTime).getTime()
  const currentTime = new Date().getTime()
  const maxTimeDifference = maxMinutes * 60 * 1000
  const timeDifference = currentTime - passedTime

  return timeDifference >= 0 && timeDifference <= maxTimeDifference
}

/**
 * Returns the current date and time in the format Y-m-d H:i:s.
 * @returns {string} - The formatted date and time.
 */
export function getCurrentTime(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
