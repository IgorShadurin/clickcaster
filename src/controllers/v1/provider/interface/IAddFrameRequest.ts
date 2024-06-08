/**
 * Interface for the adding frame by provider
 */
export interface IAddFrameRequest {
  /**
   * Owner Farcaster ID
   */
  fid: number
  /**
   * Frame URL
   */
  frameUrl: string
  /**
   * Frame's signer address
   */
  signerAddress: string
  /**
   * The signature of the message
   */
  signature: string
}
