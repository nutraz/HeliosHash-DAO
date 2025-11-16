import { describe, it, expect } from 'vitest'
import { SecurityService } from '@/lib/services/securityService'

describe('SecurityService', () => {
  it('sanitizes input properly', () => {
    const s = new SecurityService()
    const dirty = '<script>alert(1)</script>'
    const cleaned = s.sanitizeInput(dirty)
    expect(cleaned).not.toContain('<')
    expect(cleaned).toContain('&lt;')
  })

  it('validates amount', () => {
    const s = new SecurityService()
    expect(s.validateAmount('abc').valid).toBe(false)
    expect(s.validateAmount('-1').valid).toBe(false)
    expect(s.validateAmount('100').valid).toBe(true)
  })

  it('validates address', () => {
    const s = new SecurityService()
    expect(s.validateAddress('short').valid).toBe(false)
    expect(s.validateAddress('valid-address-1234567890-abc').valid).toBe(true)
  })
})
