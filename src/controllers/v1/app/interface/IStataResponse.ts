export interface IStata {
  users: number
  frames: number
  all_clicks: number
}

export interface IStataResponse {
  status: string
  stata: IStata
}

export interface IPublicFramesStata {
  /**
   * User FID
   */
  [key: number]: {
    /**
     * Frame ID
     */
    [key: number]: { unique: number; all: number }
  }
}

export interface IPublicStataResponse {
  status: string
  stata: IPublicFramesStata
  sortedOwnerIds: number[]
}
