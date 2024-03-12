/**
 * Interface for the add key action request
 */
export interface IAddRequest {
  /**
   * The key to add
   */
  key: string
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
