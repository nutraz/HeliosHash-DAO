import { formatCurrency } from './format';

/**
 * Utility to assist in identifying legacy currency strings and suggesting
 * refactors to standardized formatting helpers.
 */
export class CurrencyRefactorHelper {
  /** Recognize raw currency patterns needing refactor */
  static identifyCurrencyString(str: string): boolean {
    const patterns = [/₹\s*\d+/, /\d+\s*OWP/, /\d+\s*₹/, /\$\s*\d+/, /€\s*\d+/];
    return patterns.some((p) => p.test(str));
  }

  /** Extract first numeric value in string */
  static extractValue(str: string): number {
    const match = str.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  }

  /** Heuristically determine currency type */
  static determineCurrencyType(str: string): 'OWP' | 'INR' | 'USD' | 'EUR' | 'unknown' {
    if (/OWP/i.test(str)) return 'OWP';
    if (str.includes('₹')) return 'INR';
    if (str.includes('$')) return 'USD';
    if (str.includes('€')) return 'EUR';
    return 'unknown';
  }

  /** Suggest a refactor snippet using formatCurrency */
  static suggestRefactor(str: string): string {
    const value = this.extractValue(str);
    const currencyType = this.determineCurrencyType(str);
    if (currencyType === 'unknown') {
      return `// Could not determine currency type for: ${str}`;
    }
    const withFiatOpt = currencyType === 'OWP' ? ', { withFiat: true }' : '';
    return `formatCurrency(${value}, '${currencyType}'${withFiatOpt})`;
  }

  /** Attempt an inline transformation (best-effort) */
  static transformInline(str: string): string {
    if (!this.identifyCurrencyString(str)) return str;
    return this.suggestRefactor(str);
  }

  /** Example usage showing how to refactor a literal value */
  static exampleRefactor(original: string): string {
    return `${original} -> ${this.transformInline(original)}`;
  }
}

// Re-export formatCurrency for convenience in refactor contexts
export { formatCurrency };
