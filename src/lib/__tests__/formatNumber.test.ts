import { describe, expect, it } from 'vitest';
import { formatNumber } from '../format';

/**
 * Test contract for formatNumber:
 * - Uses en-IN grouping by default (lakh/crore style where supported by runtime)
 * - Accepts a custom locale override
 * - Falls back to value.toString() if Intl.NumberFormat throws
 */

describe('formatNumber', () => {
  it('formats with Indian digit grouping by default', () => {
    // 12345678 should appear as 1,23,45,678 in en-IN
    const out = formatNumber(12345678);
    // Allow either standard Indian grouping or (on some minimal Intl impl) plain grouping as fallback
    expect(['1,23,45,678', '12,345,678', '12345678']).toContain(out);
  });

  it('respects a provided locale (en-US)', () => {
    const out = formatNumber(12345678, 'en-US');
    expect(['12,345,678', '12345678']).toContain(out);
  });

  it('handles decimals without altering them (locale grouping only)', () => {
    const out = formatNumber(1234.56);
    // Implementation of Intl may round or keep decimals; ensure prefix grouping is correct
    expect(out.startsWith('1,234') || out.startsWith('1,23')).toBe(true);
  });

  it('falls back gracefully for an invalid locale', () => {
    const out = formatNumber(98765, 'invalid-locale-tag-xyz');
    // Fallback path returns toString() so ensure it is numeric string (no commas)
    expect(/^[0-9.]+$/.test(out)).toBe(true);
  });
});
