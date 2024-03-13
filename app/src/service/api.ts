export interface AuthData {
  /**
   * Farcaster auth message
   */
  message: string
  /**
   * Farcaster auth signature
   */
  signature: string
  /**
   * Farcaster auth nonce
   */
  nonce: string
  /**
   * Farcaster username
   */
  username: string
}

export interface IListResponse {
  status: string
  list: IPreparedList[]
}

export interface IPreparedList {
  eth_address: string
  active: boolean
  created_at: string
}

/**
 * Get URL
 * @param path The path
 */
export function getUrl(path: string): URL {
  const url = process.env.REACT_APP_API_URL as string
  if (!url) throw new Error('REACT_APP_API_URL is not defined')

  return new URL(path, url)
}

/**
 * Add an access key for authenticated user
 * @param key The key
 * @param auth The auth data
 */
export async function accessKeyAdd(key: string, auth: AuthData): Promise<unknown> {
  return (
    await fetch(getUrl('v1/access-key/add'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, ...auth }),
    })
  ).json()
}

/**
 * List access keys for authenticated user
 * @param auth The auth data
 */
export async function accessKeyList(auth: AuthData): Promise<IListResponse> {
  return (
    await fetch(getUrl('v1/access-key/list'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auth),
    })
  ).json()
}
