export class SecurityService {
  sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  validateAmount(amount: string): { valid: boolean; error?: string } {
    const num = parseFloat(amount);
    if (isNaN(num)) return { valid: false, error: 'Invalid number' };
    if (num <= 0) return { valid: false, error: 'Amount must be positive' };
    if (num > 1000000) return { valid: false, error: 'Amount too large' };
    return { valid: true };
  }

  validateAddress(address: string): { valid: boolean; error?: string } {
    if (address.length < 20) return { valid: false, error: 'Address too short' };
    if (!/^[a-z0-9-]+$/.test(address)) return { valid: false, error: 'Invalid characters' };
    return { valid: true };
  }
}
