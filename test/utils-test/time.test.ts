import { isWithinMaxMinutes } from '../../src/utils/time'

describe('Time', () => {
  it('isWithinMaxMinutes', async () => {
    const gmt0Time = new Date().toISOString()
    const maxMinutes = 5
    expect(isWithinMaxMinutes(gmt0Time, maxMinutes)).toBe(true)

    const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60000).toISOString()
    expect(isWithinMaxMinutes(fiveMinutesAgo, maxMinutes)).toBe(true)

    const fivePlusMinutesAgo = new Date(new Date().getTime() - 5.01 * 60000).toISOString()
    expect(isWithinMaxMinutes(fivePlusMinutesAgo, maxMinutes)).toBe(false)

    const plusCurrentTime = new Date(new Date().getTime() + 1).toISOString()
    expect(isWithinMaxMinutes(plusCurrentTime, maxMinutes)).toBe(false)
  })
})
