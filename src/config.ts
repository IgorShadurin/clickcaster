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
   * Klaviyo API key
   */
  klaviyoApiKey: string

  /**
   * Klaviyo list ID
   */
  klaviyoListId: string
}

/**
 * Config data
 */
let configData: IConfigData = {
  neynarApiKey: '',
  publicUrl: '',
  klaviyoApiKey: '',
  klaviyoListId: '',
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

  if (!process.env.KLAVIYO_API_KEY) {
    throw new Error('KLAVIYO_API_KEY env variable not set')
  }

  if (!process.env.KLAVIYO_LIST_ID) {
    throw new Error('KLAVIYO_LIST_ID env variable not set')
  }

  configData.neynarApiKey = process.env.NEYNAR_API_KEY
  configData.publicUrl = process.env.PUBLIC_URL
  configData.klaviyoApiKey = process.env.KLAVIYO_API_KEY
  configData.klaviyoListId = process.env.KLAVIYO_LIST_ID
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
