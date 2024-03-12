import knex from 'knex'
import configurations from '../../knexfile'
import supertest from 'supertest'
import app from '../../src/app'
import { IAddRequest } from '../../src/controllers/v1/access-key/interface/IAddRequest'
import { keyExists } from '../../src/db/AccessKeyModel'
import { db } from '../../src/db'
import { setConfigData } from '../../src/config'

const testDb = knex(configurations.development)

describe('Access Key', () => {
  setConfigData({ klaviyoApiKey: '', klaviyoListId: '', neynarApiKey: '', publicUrl: '', appDomain: 'clickcaster.xyz' })
  const correctData: IAddRequest = {
    key: 'A5e09251e03b6956dAD68D3532842723457Bd886',
    message:
      'clickcaster.xyz wants you to sign in with your Ethereum account:\n0xDb0c6C27C2C1ea4193d808bAB25be0Fc27fa4867\n\nFarcaster Connect\n\nURI: https://clickcaster.xyz\nVersion: 1\nChain ID: 10\nNonce: zqFSIZNWpnfensOJk\nIssued At: 2024-03-12T13:55:06.284Z\nResources:\n- farcaster://fid/354669',
    signature:
      '0x9198666bc35c9e1dc29a33ac3df5a497791045a50abc5b6a0b611c11a9e0a11e518c55e0d69a995e6eb4a1bbfcfb22b6db6dbf2671da9b8dfe00dfbce7312d361b',
    nonce: 'zqFSIZNWpnfensOJk',
  }

  beforeEach(async () => {
    // Rollback the migration (if any)
    await testDb.migrate.rollback()
    // Run the migration
    await testDb.migrate.latest()
  })

  afterEach(async () => {
    // After each test, we can rollback the migration
    await testDb.migrate.rollback()
  })

  afterAll(async () => {
    // to prevent tests freezing after execution
    await testDb.destroy()
    await db.destroy()
  })

  it('should add a key', async () => {
    expect(await keyExists(correctData.key)).toBe(false)

    const supertestApp = supertest(app)
    const data = (await supertestApp.post(`/v1/access-key/add`).send(correctData)).body
    expect(data).toEqual({ status: 'ok' })

    expect(await keyExists(correctData.key)).toBe(true)
  })

  it('should throw on duplicate key', async () => {
    expect(await keyExists(correctData.key)).toBe(false)

    const supertestApp = supertest(app)
    const data = (await supertestApp.post(`/v1/access-key/add`).send(correctData)).body
    expect(data).toEqual({ status: 'ok' })

    const data1 = (await supertestApp.post(`/v1/access-key/add`).send(correctData)).body
    expect(data1).toEqual({ status: 'error', message: 'Key already exists' })
  })
})
