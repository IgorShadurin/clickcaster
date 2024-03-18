import knex from 'knex'
import configurations from '../../knexfile'
import supertest from 'supertest'
import app from '../../src/app'
import { db } from '../../src/db'
import { processAuthData } from '../../src/utils/auth'
import { frameExists, getFrameById } from '../../src/db/FrameModel'
import { IAddRequest } from '../../src/controllers/v1/frame/interface/IAddRequest'
import { upsertUser } from '../../src/db/UserModel'

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
jest.mock('../../src/utils/frame', () => {
  const originalModule = jest.requireActual('../../src/utils/frame')

  return {
    ...originalModule,
    validateFrameUrl: jest.fn().mockResolvedValue(void 0),
  }
})

const processAuthDataMock = processAuthData as jest.Mock

function mockProcessAuthData(fid: number) {
  processAuthDataMock.mockReturnValue({ fid })
}

describe('Frame', () => {
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

  it('should add a key', async () => {
    const frameId = BigInt(1)

    await upsertUser({
      fid: BigInt(userId),
      username: 'user',
      display_name: '',
      profile_image: '',
      data: '',
    })
    mockProcessAuthData(userId)
    expect(await frameExists(frameId)).toBe(false)

    const requestData: IAddRequest = {
      title: 'title',
      description: 'description',
      url: 'https://example.com/2',
      message: '',
      signature: '',
      nonce: '',
    }
    const supertestApp = supertest(app)
    const response = (await supertestApp.post(`/v1/frame/add`).send(requestData)).body
    expect(response).toEqual({ status: 'ok' })
    expect(await frameExists(frameId)).toBe(true)
    const frameInfoDb = await getFrameById(frameId)
    expect(frameInfoDb.title).toEqual(requestData.title)
    expect(frameInfoDb.description).toEqual(requestData.description)
    expect(frameInfoDb.frame_owner_id).toEqual(BigInt(userId))

    const response1 = (await supertestApp.post(`/v1/frame/list`).send(requestData)).body
    expect(response1.status).toEqual('ok')
    expect(response1.list).toBeDefined()
    expect(response1.list).toHaveLength(1)
    expect(response1.list[0].title).toEqual(requestData.title)
    expect(response1.list[0].description).toEqual(requestData.description)
  })

  it('should throw on duplicate', async () => {
    await upsertUser({
      fid: BigInt(userId),
      username: 'user',
      display_name: '',
      profile_image: '',
      data: '',
    })
    mockProcessAuthData(userId)
    const requestData: IAddRequest = {
      title: 'title',
      description: 'description',
      url: 'https://exmaple.com/1',
      message: '',
      signature: '',
      nonce: '',
    }
    const supertestApp = supertest(app)
    const response = (await supertestApp.post(`/v1/frame/add`).send(requestData)).body
    expect(response).toEqual({ status: 'ok' })

    const response1 = (await supertestApp.post(`/v1/frame/add`).send(requestData)).body
    expect(response1).toEqual({
      status: 'error',
      message: 'Frame cannot be added. It is already exists or some other error occurred.',
    })
  })
})
