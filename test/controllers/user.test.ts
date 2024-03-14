import knex from 'knex'
import configurations from '../../knexfile'
import supertest from 'supertest'
import app from '../../src/app'
import { db } from '../../src/db'
import { processAuthData } from '../../src/utils/auth'
import { IUpsertRequest } from '../../src/controllers/v1/user/interface/IUpsertRequest'
import { getUserByFid, upsertUser, userExists } from '../../src/db/UserModel'

const testDb = knex(configurations.development)

jest.mock('../../src/utils/auth', () => {
  const originalModule = jest.requireActual('../../src/utils/extract-click')

  return {
    ...originalModule,
    processAuthData: jest.fn().mockResolvedValue({
      fid: 77777777,
    }),
  }
})

const processAuthDataMock = processAuthData as jest.Mock

function mockProcessAuthData(fid: number) {
  processAuthDataMock.mockReturnValue({ fid })
}

describe('User', () => {
  const userId = 333333

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

  it('should upsert new user', async () => {
    mockProcessAuthData(userId)
    const requestData: IUpsertRequest = {
      message: '',
      signature: '',
      nonce: '',
    }

    expect(await userExists(userId)).toBeFalsy()
    const supertestApp = supertest(app)
    const response = (await supertestApp.post(`/v1/user/upsert`).send(requestData)).body
    expect(response).toEqual({ status: 'ok' })
    expect(await userExists(userId)).toBeTruthy()
  })

  it('should upsert old user', async () => {
    mockProcessAuthData(userId)

    await upsertUser({
      fid: BigInt(userId),
      username: 'user',
      display_name: '',
      profile_image: '',
      data: '',
      is_clickcaster: false,
    })
    const requestData: IUpsertRequest = {
      message: '',
      signature: '',
      nonce: '',
    }

    expect((await getUserByFid(userId)).is_clickcaster).toBeFalsy()
    const supertestApp = supertest(app)
    const response = (await supertestApp.post(`/v1/user/upsert`).send(requestData)).body
    expect(response).toEqual({ status: 'ok' })
    expect((await getUserByFid(userId)).is_clickcaster).toBeTruthy()
  })
})
