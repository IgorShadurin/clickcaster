import { AuthData } from './api'

export const AUTH_KEY = 'auth'

/**
 * Save auth data to local storage
 * @param auth The auth data
 */
export function saveAuthData(auth?: AuthData): void {
  if (auth) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}

/**
 * Get auth data from local storage
 */
export function getAuthData(): AuthData | undefined {
  const auth = localStorage.getItem(AUTH_KEY)
  if (!auth) return undefined

  return JSON.parse(auth)
}
