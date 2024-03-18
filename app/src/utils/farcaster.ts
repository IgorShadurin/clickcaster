import { StatusAPIResponse } from '@farcaster/auth-kit'
import { saveAuthData } from '../service/storage'
import { userUpsert } from '../service/api'
import { setAuthData } from '../redux/reducers/authSlice'

/**
 * Extracts the FID from a message.
 * @param message The message to extract the FID from.
 */
export function extractFidFromMessage(message: string): number {
  if (!message && !message.includes('/')) {
    throw new Error('Invalid message for FID extraction.')
  }

  const items = message.split('/')

  return Number(items[items.length - 1])
}

/**
 * Handles the login event.
 * @param dispatch The dispatch function.
 * @param res The response from the login event.
 */
export async function onLogin(dispatch: unknown, res: StatusAPIResponse): Promise<void> {
  const { message, signature, nonce, username } = res
  if (!message || !signature || !nonce || !username) {
    console.log('sign in info', res)
    alert('Incorrect auth information. Cannot sign in.')
    return
  }

  saveAuthData({
    message,
    signature,
    nonce,
    username,
  })
  await userUpsert({
    message,
    signature,
    nonce,
    username,
  })
  // @ts-ignore
  dispatch(
    setAuthData({
      isAuthenticated: true,
      message,
      signature,
      nonce,
      username,
      fid: extractFidFromMessage(message)
    }),
  )
}
