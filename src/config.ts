import 'dotenv/config'

/**
 * Config data interface
 */
export interface IConfigData {
  /**
   * Neynar API key
   */
  neynarApiKey: string

  /**
   * Public URL
   */
  publicUrl: string

  /**
   * App domain
   */
  appDomain: string
  /**
   * Trusted provider ETH address for frames adding
   */
  providerEthAddress: string
}

/**
 * Config data
 */
let configData: IConfigData = {
  neynarApiKey: '',
  publicUrl: '',
  appDomain: '',
  providerEthAddress: '',
}

/**
 * Gets config data from environment variables
 */
export function loadConfig(): void {
  if (!process.env.NEYNAR_API_KEY) {
    throw new Error('NEYNAR_API_KEY env variable not set')
  }

  if (!process.env.PUBLIC_URL) {
    throw new Error('PUBLIC_URL env variable not set')
  }

  if (!process.env.THE_APP_DOMAIN) {
    throw new Error('THE_APP_DOMAIN env variable not set')
  }

  if (!process.env.PROVIDER_ETH_ADDRESS) {
    throw new Error('PROVIDER_ETH_ADDRESS env variable not set')
  }

  configData.neynarApiKey = process.env.NEYNAR_API_KEY
  configData.publicUrl = process.env.PUBLIC_URL
  configData.appDomain = process.env.THE_APP_DOMAIN
  configData.providerEthAddress = process.env.PROVIDER_ETH_ADDRESS
}

/**
 * Gets config data
 */
export function getConfigData(): IConfigData {
  return configData
}

/**
 * Sets config data
 * @param data Config data
 */
export function setConfigData(data: IConfigData): void {
  configData = data
}
