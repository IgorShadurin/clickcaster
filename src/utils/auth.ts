import { createAppClient, VerifySignInMessageResponse, viemConnector } from '@farcaster/auth-client'

/**
 * Process auth data
 * @param message Farcaster message to sign
 * @param signature Farcaster signature
 * @param domain Domain of the service app
 * @param nonce Nonce of the message
 */
export async function processAuthData(
  message: string,
  signature: `0x${string}`,
  domain: string,
  nonce: string,
): Promise<VerifySignInMessageResponse> {
  if (!message) {
    throw new Error('Invalid "message"')
  }

  if (!signature) {
    throw new Error('Invalid "signature"')
  }

  if (!domain) {
    throw new Error('Invalid "domain"')
  }

  if (!nonce) {
    throw new Error('Invalid "nonce"')
  }

  const appClient = createAppClient({
    ethereum: viemConnector(),
  })

  // todo do not use signatures older than N days
  return appClient.verifySignInMessage({
    message,
    signature,
    domain,
    nonce,
  })
}
