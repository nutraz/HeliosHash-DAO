import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatEUR,
  formatINR,
  formatOWP,
  formatUSD,
  parseCurrency,
} from './format';

describe('format utilities', () => {
  describe('formatINR', () => {
    it('formats INR with default options', () => {
      expect(formatINR(1500)).toBe('₹1,500.00');
    });
    it('respects decimals option', () => {
      expect(formatINR(1500, { decimals: 0 })).toBe('₹1,500');
    });
    it('can omit symbol', () => {
      expect(formatINR(1500, { symbol: false })).toBe('1,500.00');
    });
  });

  describe('formatOWP', () => {
    it('formats OWP base', () => {
      expect(formatOWP(12.5)).toBe('12.50 OWP');
    });
    it('includes fiat equivalent', () => {
      expect(formatOWP(10, { withFiat: true })).toBe('10.00 OWP (≈ ₹1,500.00)');
    });
    it('supports USD fiat', () => {
      expect(formatOWP(10, { withFiat: true, fiatCurrency: 'USD' })).toBe('10.00 OWP (≈ $18.00)');
    });
    it('supports EUR fiat', () => {
      expect(formatOWP(10, { withFiat: true, fiatCurrency: 'EUR' })).toBe('10.00 OWP (≈ 16,50 €)');
    });
  });

  describe('formatCurrency', () => {
    it('formats OWP', () => {
      expect(formatCurrency(10, 'OWP')).toBe('10.00 OWP');
    });
    it('formats INR', () => {
      expect(formatCurrency(1500, 'INR')).toBe('₹1,500.00');
    });
    it('formats USD', () => {
      expect(formatCurrency(1500, 'USD')).toBe('$1,500.00');
    });
    it('formats EUR', () => {
      // Locale formatting may produce different grouping for EUR depending on environment; allow either style.
      const eur = formatCurrency(1500, 'EUR');
      expect(eur === '1.500,00 €' || eur === '1.500,00 €').toBe(true);
    });
  });

  describe('formatUSD/EUR direct', () => {
    it('formatUSD works', () => {
      expect(formatUSD(2500)).toBe('$2,500.00');
    });
    it('formatEUR works', () => {
      const eur = formatEUR(2500);
      expect(eur === '2.500,00 €' || eur === '2.500,00 €').toBe(true);
    });
  });

  describe('parseCurrency', () => {
    it('parses INR', () => {
      expect(parseCurrency('₹1,500.00')).toBe(1500);
    });
    it('parses OWP', () => {
      expect(parseCurrency('10.50 OWP')).toBe(10.5);
    });
    it('handles invalid', () => {
      expect(parseCurrency('invalid')).toBe(0);
    });
  });
});
