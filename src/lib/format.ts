/**
 * Currency formatting utilities for HeliosHash DAO
 *
 * Provides consistent formatting for OWP tokens and INR values throughout the application.
 * Supports token-first and fiat-first displays with optional conversion.
 */

/**
 * TODO: Dynamic Exchange Rate Fetching
 * The current OWP_TO_INR_RATE is hardcoded. In production this should be fetched from
 * a reliable price oracle or external API and cached with TTL.
 * Plan:
 * 1. Implement price service with multi-source fetch + fallback
 * 2. Cache rate (e.g., in-memory w/ timestamp) with 5m TTL
 * 3. Provide graceful fallback to last known or default constant
 * 4. Allow user preference for fiat currency (future multi-currency)
 * Target: v2.2.0
 */
export const OWP_TO_INR_RATE = 150; // 1 OWP = 150 INR (placeholder)
export const EXCHANGE_RATES = {
  OWP: {
    INR: 150,
    USD: 1.8,
    EUR: 1.65,
  },
} as const;

export type SupportedFiat = keyof typeof EXCHANGE_RATES.OWP;

interface FormatINROptions {
  decimals?: number;
  symbol?: boolean;
  compact?: boolean;
}

export function formatINR(amount: number, options: FormatINROptions = {}): string {
  const { decimals = 2, symbol = true, compact = false } = options;

  if (compact) {
    // Compact without symbol (we append manually if required)
    const compactVal = new Intl.NumberFormat('en-IN', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: decimals,
    }).format(amount);
    // Heuristic: Convert millions/billions to Indian style (approx) if needed
    return compactVal; // e.g., 15L, 5Cr (Node should produce these for en-IN)
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: decimals,
  }).format(amount);

  return symbol ? formatted : formatted.replace('₹', '').trim();
}

interface FormatOWPOptions {
  decimals?: number;
  withFiat?: boolean;
  fiatCurrency?: SupportedFiat;
  fiatDecimals?: number;
}

export function formatUSD(
  amount: number,
  options: { decimals?: number; symbol?: boolean; compact?: boolean } = {}
): string {
  const { decimals = 2, symbol = true, compact = false } = options;
  if (compact) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: decimals,
    }).format(amount);
  }
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals,
  }).format(amount);
  return symbol ? formatted : formatted.replace('$', '').trim();
}

export function formatEUR(
  amount: number,
  options: { decimals?: number; symbol?: boolean; compact?: boolean } = {}
): string {
  const { decimals = 2, symbol = true, compact = false } = options;
  if (compact) {
    return new Intl.NumberFormat('de-DE', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: decimals,
    }).format(amount);
  }
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: decimals,
  }).format(amount);
  return symbol ? formatted : formatted.replace('€', '').trim();
}

export function formatOWP(amount: number, options: FormatOWPOptions = {}): string {
  const { decimals = 2, withFiat = false, fiatCurrency = 'INR', fiatDecimals = 2 } = options;
  const owpFormatted = `${amount.toFixed(decimals)} OWP`;
  if (!withFiat) return owpFormatted;
  const rate = EXCHANGE_RATES.OWP[fiatCurrency];
  const fiatAmount = amount * rate;
  let fiatFormatted: string;
  switch (fiatCurrency) {
    case 'USD':
      fiatFormatted = formatUSD(fiatAmount, { decimals: fiatDecimals });
      break;
    case 'EUR':
      fiatFormatted = formatEUR(fiatAmount, { decimals: fiatDecimals });
      break;
    case 'INR':
    default:
      fiatFormatted = formatINR(fiatAmount, { decimals: fiatDecimals });
  }
  return `${owpFormatted} (≈ ${fiatFormatted})`;
}

interface FormatCurrencyOptions extends FormatOWPOptions {
  // re-use OWP options
}

export function formatCurrency(
  amount: number,
  currency: 'OWP' | 'INR' | 'USD' | 'EUR',
  options: FormatCurrencyOptions = {}
): string {
  if (currency === 'OWP') return formatOWP(amount, options);
  if (currency === 'INR') return formatINR(amount, { decimals: options.decimals });
  if (currency === 'USD') return formatUSD(amount, { decimals: options.decimals });
  if (currency === 'EUR') return formatEUR(amount, { decimals: options.decimals });
  return amount.toFixed(options.decimals ?? 2);
}

export function parseCurrency(value: string): number {
  const numericString = value.replace(/[₹,OWP\s]/g, '').trim();
  const parsed = parseFloat(numericString);
  return Number.isFinite(parsed) ? parsed : 0;
}

// Generic number formatter (e.g., for counts, non-currency metrics)
// Uses Indian grouping by default; configurable locale override possible later.
export function formatNumber(value: number, locale: string = 'en-IN'): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return value.toString();
  }
}
