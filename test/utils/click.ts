import { HDNodeWallet, Wallet } from 'ethers'
import { generateRandomString } from './data'
import { IFrameData, insertFrame } from '../../src/db/FrameModel'
import { keyInsert } from '../../src/db/AccessKeyModel'
import { upsertUser } from '../../src/db/UserModel'
import { IRegisterRequest } from '../../src/controllers/v1/click/interface/IRegisterRequest'
import { ILogRequest } from '../../src/controllers/v1/click/interface/ILogRequest'

export interface PreparedTestData {
  frames: {
    frameData1: IFrameData
    frameData2: IFrameData
    frameId1: bigint
    frameId2: bigint
  }
  clicks: {
    register: {
      requestFrom1: IRegisterRequest
      requestFrom2: IRegisterRequest
    }
    log: {
      requestFrom1: ILogRequest
      requestFrom2: ILogRequest
    }
  }
  keys: {
    key1: {
      fid: bigint
      signer: HDNodeWallet
      key: string
    }
    key2: {
      fid: bigint
      signer: HDNodeWallet
      key: string
    }
  }
  clickers: {
    clicker1: {
      fid: bigint
    }
  }
}

/**
 * Insert test frames
 */
export async function prepareTestData(): Promise<PreparedTestData> {
  const owner1 = {
    fid: BigInt(111111),
    username: 'owner1',
    display_name: 'Owner 1',
    profile_image: 'no',
    data: '',
  }
  const owner2 = {
    fid: BigInt(222222),
    username: 'owner2',
    display_name: 'Owner 2',
    profile_image: 'no',
    data: '',
  }
  const clicker1 = {
    fid: BigInt(1234567890),
    username: 'clicker1',
    display_name: 'Clicker 1',
    profile_image: 'no',
    data: '',
  }

  for (const user of [owner1, owner2, clicker1]) {
    await upsertUser(user)
  }

  const frameData1: IFrameData = {
    title: 'Frame 1',
    description: 'Frame 1. Hello world',
    url: 'https://example1111.com',
    data: 'test data',
    promo_data: 'promo data',
    promo_approved: false,
    frame_owner_id: BigInt(owner1.fid),
  }
  const frameData2: IFrameData = {
    title: 'Frame 2',
    description: 'Frame 2. Hello world',
    url: 'https://example2222.com',
    data: 'test data',
    promo_data: 'promo data',
    promo_approved: false,
    frame_owner_id: BigInt(owner2.fid),
  }
  const frameId1 = await insertFrame(frameData1)
  const frameId2 = await insertFrame(frameData2)

  const providerSigner1 = Wallet.createRandom()
  const providerSigner2 = Wallet.createRandom()
  const key1 = providerSigner1.address.replace('0x', '').toLowerCase()
  const key2 = providerSigner2.address.replace('0x', '').toLowerCase()
  await keyInsert(BigInt(owner1.fid), key1, true)
  await keyInsert(BigInt(owner2.fid), key2, true)

  const toFrame1ClickData = JSON.stringify({ hello: generateRandomString(1024) })
  const toFrame2ClickData = JSON.stringify({ hello: generateRandomString(1024) })

  return {
    frames: { frameData1, frameData2, frameId1, frameId2 },
    clicks: {
      // register potential clicks
      register: {
        // register click from Frame 1 to Frame 2
        requestFrom1: {
          // specify target frame id: 2
          toFrameId: Number(frameId2),
          // signature from Frame 1 provider
          signature: await providerSigner1.signMessage(toFrame1ClickData),
          // click data that received by Frame 1
          clickData: toFrame1ClickData,
        },
        // register click from Frame 2 to Frame 1
        requestFrom2: {
          // specify target frame id: 1
          toFrameId: Number(frameId1),
          // signature from Frame 2 provider
          signature: await providerSigner2.signMessage(toFrame2ClickData),
          // click data that received by Frame 2
          clickData: toFrame2ClickData,
        },
      },
      // log any click received by a Frame
      log: {
        // request received by Frame 1
        requestFrom1: {
          // click data received by Frame 1
          clickData: toFrame1ClickData,
          // signature from the provider who owns the Frame 1
          signature: await providerSigner1.signMessage(toFrame1ClickData),
        },
        // request received by Frame 2
        requestFrom2: {
          // click data received by Frame 2
          clickData: toFrame2ClickData,
          // signature from the provider who owns the Frame 2
          signature: await providerSigner2.signMessage(toFrame2ClickData),
        },
      },
    },
    keys: {
      key1: {
        fid: BigInt(owner1.fid),
        signer: providerSigner1,
        key: key1,
      },
      key2: {
        fid: BigInt(owner2.fid),
        signer: providerSigner2,
        key: key2,
      },
    },
    clickers: {
      clicker1: {
        fid: BigInt(clicker1.fid),
      },
    },
  }
}
