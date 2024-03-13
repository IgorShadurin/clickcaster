/**
 * Interface for the add key action request
 */
export interface IAddRequest {
  title: string
  description: string
  url: string

  // todo move auth fields to a separate interface
  /**
   * The message to sign
   */
  message: string
  /**
   * The signature of the message
   */
  signature: string
  /**
   * The nonce of the message
   */
  nonce: string
}
