export interface ClickData {
  appUrl: string
  fid: bigint
}

export function extractClickData(data: object): ClickData {
  // todo implement. extract from raw parsed data (data) the data required for the app
  return {
    appUrl: 'https://test-domain',
    fid: BigInt(111),
  }
}
