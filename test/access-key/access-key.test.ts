import knex from 'knex'
import configurations from '../../knexfile'
import supertest from 'supertest'
import app from '../../src/app'
import { IAddRequest } from '../../src/controllers/v1/access-key/interface/IAddRequest'
import { keyExists } from '../../src/db/AccessKeyModel'
import { db } from '../../src/db'

const testDb = knex(configurations.development)

jest.mock('../../src/utils/auth', () => ({
  processAuthData: jest.fn().mockResolvedValue(BigInt(354669)),
}))

describe('Access Key', () => {
  const correctData: IAddRequest = {
    key: 'A5e09251e03b6956dAD68D3532842723457Bd886',
    auth: 'auth',
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
