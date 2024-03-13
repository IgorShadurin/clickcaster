import { Request, Response, NextFunction } from 'express'
import { IAddRequest } from './interface/IAddRequest'
import { IAccessKey, listKeys } from '../../../db/AccessKeyModel'
import { processAuthData } from '../../../utils/auth'
import { getConfigData } from '../../../config'
import { IListResponse, IPreparedList } from './interface/IListResponse'

/**
 * Prepare list
 * @param list The list
 */
function prepareList(list: IAccessKey[]): IPreparedList[] {
  return list.map(({ eth_address, active, created_at }) => ({
    eth_address,
    active,
    created_at,
  }))
}

export default async (req: Request<IAddRequest>, res: Response<IListResponse>, next: NextFunction): Promise<void> => {
  try {
    const { message, signature, nonce } = req.body
    const { appDomain } = getConfigData()
    const { fid } = await processAuthData(message, signature as `0x${string}`, appDomain, nonce)
    const list = prepareList(await listKeys(BigInt(fid)))

    res.json({ status: 'ok', list })
  } catch (e) {
    next(e)
  }
}
