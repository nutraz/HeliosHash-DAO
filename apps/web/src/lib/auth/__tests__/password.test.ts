import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../password';

describe('Password Security', () => {
  it('should hash passwords', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);
    
    expect(hash).toBeTruthy();
    expect(hash).not.toBe(password);
    expect(hash.startsWith('$2a$')).toBe(true); // bcrypt hash format
  });

  it('should verify correct password', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword('WrongPassword123!', hash);
    expect(isValid).toBe(false);
  });

  it('should validate password strength', () => {
    const weak = validatePasswordStrength('weak');
    expect(weak.valid).toBe(false);
    expect(weak.errors.length).toBeGreaterThan(0);

    const strong = validatePasswordStrength('SecurePass123!');
    expect(strong.valid).toBe(true);
    expect(strong.errors.length).toBe(0);
  });
});
