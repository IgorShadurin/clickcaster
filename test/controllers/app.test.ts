import knex from 'knex'
import configurations from '../../knexfile'
import supertest from 'supertest'
import app from '../../src/app'
import { db } from '../../src/db'
import { processAuthData } from '../../src/utils/auth'
import { IFrameData, insertFrame } from '../../src/db/FrameModel'
import { upsertUser } from '../../src/db/UserModel'
import { IPublicStataResponse } from '../../src/controllers/v1/app/interface/IStataResponse'
import { incrementVisitors } from '../../src/db/FrameVisitorsModel'
import { getPublicFramesStata, memcached } from '../../src/utils/memcached/clicks'

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

describe('App', () => {
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
    memcached.end()
  })

  it('should show correct top stata', async () => {
    const topFrames: { frame: IFrameData; stata: { id: number; all: number; unique: number } }[] = [
      {
        frame: {
          title: '[Imported from DK] 1',
          description: 'description1',
          url: 'https://example.com/1',
          data: '',
          promo_data: '',
          promo_approved: true,
          frame_owner_id: BigInt(1),
        },
        stata: { id: 1, all: 10, unique: 3 },
      },
      {
        frame: {
          title: '[Imported from DK] 2',
          description: 'description2',
          url: 'https://example.com/2',
          data: '',
          promo_data: '',
          promo_approved: true,
          frame_owner_id: BigInt(2),
        },
        stata: { id: 2, all: 20, unique: 4 },
      },
      {
        frame: {
          title: '[Imported from DK] 3',
          description: 'description3',
          url: 'https://example.com/3',
          data: '',
          promo_data: '',
          promo_approved: true,
          frame_owner_id: BigInt(3),
        },
        stata: { id: 3, all: 30, unique: 5 },
      },
      // the app for this user should be ignored
      {
        frame: {
          title: '[Imported from DK] 4',
          description: 'description4',
          url: 'https://example.com/4',
          data: '',
          promo_data: '',
          promo_approved: true,
          frame_owner_id: BigInt(354669),
        },
        stata: { id: 4, all: 30, unique: 5 },
      },
    ]
    for (const { frame, stata } of topFrames) {
      await upsertUser({
        fid: frame.frame_owner_id,
        username: 'user',
        display_name: '',
        profile_image: '',
        data: '',
      })
      await insertFrame(frame)
      await incrementVisitors(BigInt(stata.id), stata.all, stata.unique, '2024-05-23')
      // should not affect the stats as it is out of the hackathon range
      await incrementVisitors(BigInt(stata.id), 1000, 1000, '2024-05-22')
      await incrementVisitors(BigInt(stata.id), 1000, 1000, '2024-08-01')
    }

    mockProcessAuthData(userId)

    const supertestApp = supertest(app)
    const response = (await supertestApp.get(`/v1/app/top-stata`).send()).body as IPublicStataResponse
    expect(response.status).toEqual('ok')
    expect(response.sortedOwnerIds).toEqual([3, 2, 1])
    expect(response.stata).toEqual({
      1: { [topFrames[0].stata.id]: { unique: topFrames[0].stata.unique, all: topFrames[0].stata.all } },
      2: { [topFrames[1].stata.id]: { unique: topFrames[1].stata.unique, all: topFrames[1].stata.all } },
      3: { [topFrames[2].stata.id]: { unique: topFrames[2].stata.unique, all: topFrames[2].stata.all } },
    })
    expect(await getPublicFramesStata()).toEqual(
      JSON.stringify({ stata: response.stata, sortedOwnerIds: response.sortedOwnerIds }),
    )
  })
})
