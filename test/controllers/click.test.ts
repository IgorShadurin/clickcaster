import app from '../../src/app'
import supertest from 'supertest'
import { getExpectedClick, memcached, removeAll } from '../../src/utils/memcached/clicks'
import knex from 'knex'
import configurations from '../../knexfile'
import { db } from '../../src/db'
import { getVisitorsCount } from '../../src/db/FrameVisitorsModel'
import { getDate } from '../../src/utils/date'
import { prepareTestData } from '../utils/click'
import { getBalance } from '../../src/db/ContributionModel'
import { ClickData, extractClickData } from '../../src/utils/extract-click'
import { IRegisterRequest } from '../../src/controllers/v1/click/interface/IRegisterRequest'

const testDb = knex(configurations.development)

jest.mock('../../src/utils/extract-click', () => {
  const originalModule = jest.requireActual('../../src/utils/extract-click')

  return {
    ...originalModule,
    extractClickData: jest.fn().mockReturnValue({
      appUrl: 'https://mocked-example.com',
    }),
  }
})

const extractClickDataMock = extractClickData as jest.Mock

function mockExtractClickData(data: ClickData) {
  extractClickDataMock.mockReturnValue(data)
}

describe('Click', () => {
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

  it('should register a click in Memcached', async () => {
    const { frames, clicks, clickers } = await prepareTestData()

    expect(await getExpectedClick(frames.frameId2, clickers.clicker1.fid)).toBeUndefined()

    mockExtractClickData({
      appUrl: frames.frameData1.url,
      fid: clickers.clicker1.fid,
      timestamp: new Date(),
    })
    const supertestApp = supertest(app)
    const data = (await supertestApp.post(`/v1/click/register`).send(clicks.register.requestFrom1)).body
    expect(data).toEqual({ status: 'ok' })

    expect(await getExpectedClick(frames.frameId2, clickers.clicker1.fid)).toEqual(frames.frameId1)
  })

  describe('Click Errors', () => {
    it('should reject requests with non-numeric toFrameId', async () => {
      const { clicks } = await prepareTestData()

      const supertestApp = supertest(app)
      const request: IRegisterRequest = {
        ...clicks.register.requestFrom1,
        toFrameId: 'not-a-number' as unknown as number,
      }
      const response = await supertestApp.post(`/v1/click/register`).send(request)
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ status: 'error', message: 'Invalid frameId' })
    })
  })

  it('should count clicks', async () => {
    const supertestApp = supertest(app)

    const { frames, clicks, clickers } = await prepareTestData()
    expect(await getVisitorsCount(frames.frameId1, getDate())).toEqual({ all_visitors: 0n, unique_visitors: 0n })

    mockExtractClickData({
      appUrl: frames.frameData1.url,
      fid: clickers.clicker1.fid,
      timestamp: new Date(),
    })
    const data1 = (await supertestApp.post(`/v1/click/register`).send(clicks.register.requestFrom1)).body
    expect(data1).toEqual({ status: 'ok' })

    mockExtractClickData({
      appUrl: frames.frameData2.url,
      fid: clickers.clicker1.fid,
      timestamp: new Date(),
    })
    const data2 = (await supertestApp.post(`/v1/click/log`).send(clicks.log.requestFrom2)).body
    expect(data2).toEqual({ status: 'ok' })

    expect(await getVisitorsCount(frames.frameId2, getDate())).toEqual({ all_visitors: 1n, unique_visitors: 1n })
    expect(await getBalance(frames.frameId1)).toEqual(1n)

    for (let i = 0; i < 9; i++) {
      mockExtractClickData({
        appUrl: frames.frameData1.url,
        fid: clickers.clicker1.fid,
        timestamp: new Date(),
      })
      expect((await supertestApp.post(`/v1/click/register`).send(clicks.register.requestFrom1)).status).toBe(200)

      mockExtractClickData({
        appUrl: frames.frameData2.url,
        fid: clickers.clicker1.fid,
        timestamp: new Date(),
      })
      expect((await supertestApp.post(`/v1/click/log`).send(clicks.log.requestFrom2)).status).toBe(200)
    }

    expect(await getVisitorsCount(frames.frameId2, getDate())).toEqual({ all_visitors: 10n, unique_visitors: 1n })
    // balance of contributor should not be increased as 1 user visit is unique for 1 day
    expect(await getBalance(frames.frameId1)).toEqual(1n)
  })
})
