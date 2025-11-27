import { describe, it, expect } from 'vitest'
import { MultiAuthService, AuthMethod } from '@/lib/services/multiAuthService'

describe('MultiAuthService (mock)', () => {
  it('authenticates via Internet Identity', async () => {
    const svc = new MultiAuthService()
    const profile = await svc.authenticateInternetIdentity()
    expect(profile.tier).toBeDefined()
    expect(profile.authMethod).toBe(AuthMethod.INTERNET_IDENTITY)
  })

  it('fails mobile aadhaar with wrong OTP', async () => {
    const svc = new MultiAuthService()
    await expect(svc.authenticateMobileAadhaar('+91-0000', '000000')).rejects.toThrow('Invalid OTP')
  })
})
