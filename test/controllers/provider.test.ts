import knex from 'knex'
import configurations from '../../knexfile'
import supertest from 'supertest'
import app from '../../src/app'
import { db } from '../../src/db'
import { processAuthData } from '../../src/utils/auth'
import { frameExists, getFrameById } from '../../src/db/FrameModel'
import { upsertUser } from '../../src/db/UserModel'
import { IAddFrameRequest } from '../../src/controllers/v1/provider/interface/IAddFrameRequest'
import { Wallet } from 'ethers'
import { setConfigData } from '../../src/config'
import { prepareEthAddress } from '../../src/utils/eth'
import { PROVIDER_FRAME_DESCRIPTION } from '../../src/utils/other'

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

describe('Provider Actions', () => {
  const userId = 333333
  const trustedProviderWallet = Wallet.createRandom()

  beforeEach(async () => {
    setConfigData({
      neynarApiKey: '',
      publicUrl: '',
      appDomain: 'clickcaster.xyz',
      providerEthAddress: trustedProviderWallet.address,
    })
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

  it('should add a frame via provider', async () => {
    const frameId = BigInt(1)

    const userData = {
      fid: BigInt(userId),
      username: 'user',
      display_name: '',
      profile_image: '',
      data: '',
    }
    await upsertUser(userData)
    mockProcessAuthData(userId)
    expect(await frameExists(frameId)).toBe(false)

    const requestData: IAddFrameRequest = {
      fid: Number(userData.fid),
      frameUrl: 'https://example.com/frame1',
      signerAddress: '34fA2bBF2DB60650D0300a59A89be94Ca830d9dB',
      signature: '',
    }
    requestData.signature = await trustedProviderWallet.signMessage(
      `${requestData.fid.toString()}${requestData.frameUrl}${prepareEthAddress(requestData.signerAddress)}`,
    )
    const supertestApp = supertest(app)
    const response = (await supertestApp.post(`/v1/provider/add-frame`).send(requestData)).body
    expect(response).toEqual({ status: 'ok' })
    expect(await frameExists(frameId)).toBe(true)
    const frameInfoDb = await getFrameById(frameId)
    expect(frameInfoDb.title).toContain('[Imported from DK]')
    expect(frameInfoDb.description).toEqual(PROVIDER_FRAME_DESCRIPTION)
    expect(frameInfoDb.frame_owner_id).toEqual(BigInt(userId))

    const response1 = (await supertestApp.post(`/v1/frame/list`).send(requestData)).body
    expect(response1.status).toEqual('ok')
    expect(response1.list).toBeDefined()
    expect(response1.list).toHaveLength(1)
    expect(response1.list[0].title).toEqual(frameInfoDb.title)
    expect(response1.list[0].description).toEqual(frameInfoDb.description)
  })

  it('should not add a frame with invalid signature', async () => {
    const requestData: IAddFrameRequest = {
      fid: userId,
      frameUrl: 'https://example.com/frame1',
      signerAddress: '34fA2bBF2DB60650D0300a59A89be94Ca830d9dB',
      signature: 'invalid-signature',
    }
    const supertestApp = supertest(app)
    const response = (await supertestApp.post(`/v1/provider/add-frame`).send(requestData)).body
    expect(response.status).toEqual('error')
    expect(response.message).toContain('invalid BytesLike value')
  })

  it('should not add a frame with incorrect signature', async () => {
    const requestData: IAddFrameRequest = {
      fid: userId,
      frameUrl: 'https://example.com/frame1',
      signerAddress: '34fA2bBF2DB60650D0300a59A89be94Ca830d9dB',
      signature: await Wallet.createRandom().signMessage('test'),
    }
    const supertestApp = supertest(app)
    const response = (await supertestApp.post(`/v1/provider/add-frame`).send(requestData)).body
    expect(response.status).toEqual('error')
    expect(response.message).toContain('Signature is not valid')
  })

  it('should add a frame with nonexistent user (frame should be added anyway)', async () => {
    const frameId = BigInt(1)

    const requestData: IAddFrameRequest = {
      fid: 999999,
      frameUrl: 'https://example.com/frame1',
      signerAddress: '34fA2bBF2DB60650D0300a59A89be94Ca830d9dB',
      signature: '',
    }
    requestData.signature = await trustedProviderWallet.signMessage(
      `${requestData.fid.toString()}${requestData.frameUrl}${prepareEthAddress(requestData.signerAddress)}`,
    )
    const supertestApp = supertest(app)
    const response = (await supertestApp.post(`/v1/provider/add-frame`).send(requestData)).body
    expect(response).toEqual({ status: 'ok' })
    expect(await frameExists(frameId)).toBe(true)
  })

  it('should not add duplicate frame', async () => {
    const frameId = BigInt(1)

    const userData = {
      fid: BigInt(userId),
      username: 'user',
      display_name: '',
      profile_image: '',
      data: '',
    }
    mockProcessAuthData(userId)

    const requestData: IAddFrameRequest = {
      fid: Number(userData.fid),
      frameUrl: 'https://example.com/frame1',
      signerAddress: '34fA2bBF2DB60650D0300a59A89be94Ca830d9dB',
      signature: '',
    }
    requestData.signature = await trustedProviderWallet.signMessage(
      `${requestData.fid.toString()}${requestData.frameUrl}${prepareEthAddress(requestData.signerAddress)}`,
    )

    const supertestApp = supertest(app)

    // First request to add frame
    const response1 = (await supertestApp.post(`/v1/provider/add-frame`).send(requestData)).body
    expect(response1).toEqual({ status: 'ok' })
    expect(await frameExists(frameId)).toBe(true)

    // Second request to add the same frame
    const response2 = (await supertestApp.post(`/v1/provider/add-frame`).send(requestData)).body
    expect(response2.status).toEqual('error')
    expect(response2.message).toContain('Frame cannot be added. It is already exists or some other error occurred.')
  })
})
