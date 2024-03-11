import {
  getExpectedClick,
  memcached,
  setExpectedClick,
  removeAll,
  removeExpectedClick,
} from '../../src/utils/memcached/clicks'

describe('Clicks', () => {
  const fromAppId = BigInt(1)
  const toAppId = BigInt(2)
  const fid = BigInt(777)

  beforeEach(async () => {
    await removeAll()
  })

  afterAll(async () => {
    memcached.end()
  })

  it('should register a click', async () => {
    expect(await getExpectedClick(toAppId, fid)).toBeUndefined()
    await setExpectedClick(fromAppId, toAppId, fid)
    expect(await getExpectedClick(toAppId, fid)).toEqual(fromAppId)
  })

  it('should remove registered click', async () => {
    await setExpectedClick(fromAppId, toAppId, fid)
    expect(await getExpectedClick(toAppId, fid)).toEqual(fromAppId)
    await removeExpectedClick(toAppId, fid)
    expect(await getExpectedClick(toAppId, fid)).toBeUndefined()
  })
})
