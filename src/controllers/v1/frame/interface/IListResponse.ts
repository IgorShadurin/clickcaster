export interface IPreparedFrame {
  id: number
  title: string
  description: string
  url: string
  created_at: string
  statistics: {
    total_actions: number
    unique_users: number
  }
}

export interface IListResponse {
  status: string
  list: IPreparedFrame[]
}
