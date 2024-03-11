/**
 * Request to register a potential click to a target Frame
 */
export interface IRegisterRequest {
  /**
   * Expected click on target Frame ID from Frame provider
   */
  // todo try to convert to bigint?
  toFrameId: number
  /**
   * Signature of clickData provider
   */
  signature: string
  /**
   * Information about the user's click that led to the registration of a potential click to the target Frame
   */
  clickData: string
}
