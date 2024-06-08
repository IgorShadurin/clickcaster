export interface IStata {
  users: number
  frames: number
  all_clicks: number
}

export interface IStataResponse {
  status: string
  stata: IStata
}
