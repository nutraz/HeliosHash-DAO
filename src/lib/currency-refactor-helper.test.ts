import { describe, expect, it } from 'vitest';
import { CurrencyRefactorHelper } from './currency-refactor-helper';

describe('CurrencyRefactorHelper', () => {
  describe('identifyCurrencyString', () => {
    it('identifies rupee strings', () => {
      expect(CurrencyRefactorHelper.identifyCurrencyString('₹1,500')).toBe(true);
      expect(CurrencyRefactorHelper.identifyCurrencyString('1500 ₹')).toBe(true);
    });
    it('identifies OWP strings', () => {
      expect(CurrencyRefactorHelper.identifyCurrencyString('10 OWP')).toBe(true);
      expect(CurrencyRefactorHelper.identifyCurrencyString('10.5 OWP')).toBe(true);
    });
    it('identifies dollar strings', () => {
      expect(CurrencyRefactorHelper.identifyCurrencyString('$18.00')).toBe(true);
    });
    it('identifies euro strings', () => {
      expect(CurrencyRefactorHelper.identifyCurrencyString('€16.50')).toBe(true);
    });
    it('returns false for non-currency strings', () => {
      expect(CurrencyRefactorHelper.identifyCurrencyString('Hello World')).toBe(false);
    });
  });

  describe('extractValue', () => {
    it('extracts numeric value from currency string', () => {
      expect(CurrencyRefactorHelper.extractValue('₹1,500')).toBe(1500);
      expect(CurrencyRefactorHelper.extractValue('10.5 OWP')).toBe(10.5);
      expect(CurrencyRefactorHelper.extractValue('$18.00')).toBe(18);
    });
  });

  describe('determineCurrencyType', () => {
    it('correctly identifies OWP', () => {
      expect(CurrencyRefactorHelper.determineCurrencyType('10 OWP')).toBe('OWP');
    });
    it('correctly identifies INR', () => {
      expect(CurrencyRefactorHelper.determineCurrencyType('₹1,500')).toBe('INR');
    });
    it('correctly identifies USD', () => {
      expect(CurrencyRefactorHelper.determineCurrencyType('$18.00')).toBe('USD');
    });
    it('correctly identifies EUR', () => {
      expect(CurrencyRefactorHelper.determineCurrencyType('€16.50')).toBe('EUR');
    });
    it('returns unknown for unrecognized currency', () => {
      expect(CurrencyRefactorHelper.determineCurrencyType('Hello World')).toBe('unknown');
    });
  });

  describe('suggestRefactor', () => {
    it('suggests correct refactoring for OWP', () => {
      expect(CurrencyRefactorHelper.suggestRefactor('10 OWP')).toBe(
        "formatCurrency(10, 'OWP', { withFiat: true })"
      );
    });
    it('suggests correct refactoring for INR', () => {
      expect(CurrencyRefactorHelper.suggestRefactor('₹1,500')).toBe("formatCurrency(1500, 'INR')");
    });
    it('suggests correct refactoring for USD', () => {
      expect(CurrencyRefactorHelper.suggestRefactor('$18.00')).toBe("formatCurrency(18, 'USD')");
    });
    it('returns comment for unknown', () => {
      expect(CurrencyRefactorHelper.suggestRefactor('Value TBD')).toMatch(/Could not determine/);
    });
  });
});
