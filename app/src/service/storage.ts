import { AuthData } from './api'

/**
 * Save auth data to local storage
 * @param auth The auth data
 */
export function saveAuthData(auth: AuthData): void {
  localStorage.setItem('auth', JSON.stringify(auth))
}

/**
 * Get auth data from local storage
 */
export function getAuthData(): AuthData | null {
  const auth = localStorage.getItem('auth')
  if (!auth) return null

  return JSON.parse(auth)
}
