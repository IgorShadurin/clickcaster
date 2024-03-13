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

export interface IListResponse<T> {
  status: string
  list: T[]
}

export interface IKey {
  eth_address: string
  active: boolean
  created_at: string
}

export interface IFrame {
  id: number
  title: string
  description: string
  url: string
  created_at: string
}

export type IFrameCreation = Omit<IFrame, 'created_at'>

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
export async function accessKeyList(auth: AuthData): Promise<IListResponse<IKey>> {
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

/**
 * List frames
 * @param auth The auth data
 */
export async function frameList(auth: AuthData): Promise<IListResponse<IFrame>> {
  return (
    await fetch(getUrl('v1/frame/list'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auth),
    })
  ).json()
}

/**
 * Add a frame
 * @param frame Frame info
 * @param auth The auth data
 */
export async function frameAdd(frame: IFrameCreation, auth: AuthData): Promise<unknown> {
  return (
    await fetch(getUrl('v1/frame/add'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...frame, ...auth }),
    })
  ).json()
}
