import { Request, Response, NextFunction } from 'express'
import { IAddFrameResponse } from './interface/IAddFrameResponse'
import { IAddFrameRequest } from './interface/IAddFrameRequest'
import { insertFrame } from '../../../db/FrameModel'
import { keyExists, keyInsert } from '../../../db/AccessKeyModel'
import { extractLogProvider } from '../../../utils/crypto'
import { getCurrentTime } from '../../../utils/time'
import { getConfigData } from '../../../config'
import { prepareEthAddress } from '../../../utils/eth'
import { upsertUser, userExists } from '../../../db/UserModel'
import { PROVIDER_FRAME_DESCRIPTION } from '../../../utils/other'

/**
 * Validate input
 * @param fid User ID
 * @param frameUrl Frame URL
 * @param signerAddress Signer address
 * @param signature Signature
 */
async function validateInput(fid: number, frameUrl: string, signerAddress: string, signature: string): Promise<void> {
  let { providerEthAddress } = getConfigData()
  providerEthAddress = prepareEthAddress(providerEthAddress)

  if (!fid) {
    throw new Error('Invalid "fid"')
  }

  if (!frameUrl) {
    throw new Error('Invalid "frameUrl"')
  }

  if (!signerAddress) {
    throw new Error('Invalid "signerAddress"')
  }

  if (signerAddress.length !== 40) {
    throw new Error('Invalid "signerAddress" length')
  }

  if (!signature) {
    throw new Error('Invalid "signature"')
  }

  const dataString = `${fid.toString()}${frameUrl}${prepareEthAddress(signerAddress)}`
  const recoveredAddress = prepareEthAddress(extractLogProvider(dataString, signature))

  if (recoveredAddress !== prepareEthAddress(providerEthAddress)) {
    throw new Error(
      `Signature is not valid. Recovered address: ${recoveredAddress} is not equal to ${providerEthAddress}`,
    )
  }
}

/**
 * Add frame by provider action
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export default async (
  req: Request<IAddFrameRequest>,
  res: Response<IAddFrameResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { fid, frameUrl, signerAddress, signature } = req.body
    await validateInput(fid, frameUrl, signerAddress, signature)

    if (!(await userExists(fid))) {
      await upsertUser({
        fid: BigInt(fid),
        username: '',
        display_name: '',
        profile_image: '',
        data: 'from-dappykit-auth',
        is_clickcaster: true,
      })
    }

    if (!(await keyExists(signerAddress))) {
      await keyInsert(BigInt(fid), signerAddress, true)
    }

    try {
      await insertFrame({
        frame_owner_id: BigInt(fid),
        title: `[Imported from DK] ${getCurrentTime()}`,
        description: PROVIDER_FRAME_DESCRIPTION,
        url: frameUrl,
        data: '',
        verify_tag: '',
        promo_data: '',
        promo_approved: false,
      })
    } catch (e) {
      throw new Error('Frame cannot be added. It is already exists or some other error occurred.')
    }
    res.json({ status: 'ok' })
  } catch (e) {
    next(e)
  }
}
