export interface IPreparedFrame {
  id: number
  title: string
  description: string
  created_at: string
}

export interface IListResponse {
  status: string
  list: IPreparedFrame[]
}
