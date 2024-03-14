import app from '../../src/app'
import supertest from 'supertest'
import { memcached, removeAll } from '../../src/utils/memcached/clicks'
import { db } from '../../src/db'
import knex from 'knex'
import configurations from '../../knexfile'

const testDb = knex(configurations.development)

describe('App', () => {
  beforeEach(async () => {
    await removeAll()
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
    memcached.end()
    await testDb.destroy()
    await db.destroy()
  })

  it('test', async () => {
    const supertestApp = supertest(app)
    const data = (await supertestApp.get(`/v1/app/test`)).body
    expect(data).toEqual({ status: 'ok', value: 'hello world' })
  })

  it('should return stat', async () => {
    const supertestApp = supertest(app)
    const data = (await supertestApp.get(`/v1/app/stata`)).body
    expect(data).toEqual({
      status: 'ok',
      stata: {
        all_clicks: 0,
        frames: 0,
        users: 0,
      },
    })
  })
})
