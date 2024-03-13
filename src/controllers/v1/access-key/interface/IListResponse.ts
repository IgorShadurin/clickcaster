export interface IPreparedList {
  eth_address: string
  active: boolean
  created_at: string
}

export interface IListResponse {
  status: string
  list: IPreparedList[]
}
