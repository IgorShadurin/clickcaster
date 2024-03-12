import { processAuthData } from '../../src/utils/auth'

describe('Auth', () => {
  it('processAuthData', async () => {
    const clientData = {
      state: 'completed',
      nonce: 'zqFSIZNWpnfensOJk',
      message:
        'clickcaster.xyz wants you to sign in with your Ethereum account:\n0xDb0c6C27C2C1ea4193d808bAB25be0Fc27fa4867\n\nFarcaster Connect\n\nURI: https://clickcaster.xyz\nVersion: 1\nChain ID: 10\nNonce: zqFSIZNWpnfensOJk\nIssued At: 2024-03-12T13:55:06.284Z\nResources:\n- farcaster://fid/354669',
      signature:
        '0x9198666bc35c9e1dc29a33ac3df5a497791045a50abc5b6a0b611c11a9e0a11e518c55e0d69a995e6eb4a1bbfcfb22b6db6dbf2671da9b8dfe00dfbce7312d361b',
      fid: 354669,
      username: 'dappykit',
      displayName: '🐙 DappyKit',
      bio: '🔴 20,000 OP Hackathon this summer.\n\n⚡️Web3 SocialFi SDK.',
      pfpUrl: 'https://i.imgur.com/Ul5huYm.gif',
      custody: '0xDb0c6C27C2C1ea4193d808bAB25be0Fc27fa4867',
      verifications: ['0x980f5ac0fe183479b87f78e7892f8002fb9d5401'],
    }
    const response = await processAuthData(
      clientData.message,
      clientData.signature as `0x${string}`,
      'clickcaster.xyz',
      clientData.nonce,
    )
    expect(response).toBeDefined()
  })
})
