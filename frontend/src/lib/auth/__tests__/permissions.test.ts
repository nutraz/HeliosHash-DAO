import { describe, it, expect } from 'vitest'
import { PermissionsManager, UserTier } from '@/lib/services/multiAuthService'

describe('PermissionsManager', () => {
  it('returns correct permissions for UNVERIFIED', () => {
    const perms = PermissionsManager.getTierPermissions(UserTier.UNVERIFIED)
    expect(perms.canVote).toBe(false)
    expect(perms.canTransferTokens).toBe(false)
    expect(perms.canReceiveRewards).toBe(true)
  })

  it('returns correct permissions for KYC_ADVANCED', () => {
    const perms = PermissionsManager.getTierPermissions(UserTier.KYC_ADVANCED)
    expect(perms.canVote).toBe(true)
    expect(perms.maxTransferAmount).toBe(Infinity)
  })
})
