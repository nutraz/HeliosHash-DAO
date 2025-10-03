import { formatINR, formatOWP, SupportedFiat } from '@/lib/format';
import { useEffect, useState } from 'react';

interface CurrencyDisplayOptions {
  showFiatEquivalent: boolean;
  fiatCurrency: SupportedFiat; // currently INR | USD | EUR
  decimals: number;
}

const defaultOptions: CurrencyDisplayOptions = {
  showFiatEquivalent: true,
  fiatCurrency: 'INR',
  decimals: 2,
};

export function useCurrencyDisplay(userOptions: Partial<CurrencyDisplayOptions> = {}) {
  const [options, setOptions] = useState<CurrencyDisplayOptions>({
    ...defaultOptions,
    ...userOptions,
  });

  // hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('currencyDisplayPrefs');
      if (stored) {
        const parsed = JSON.parse(stored);
        setOptions((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // swallow
      console.warn('Failed to load currency display prefs', e);
    }
  }, []);

  // persist changes
  useEffect(() => {
    try {
      localStorage.setItem('currencyDisplayPrefs', JSON.stringify(options));
    } catch (e) {
      console.warn('Failed to persist currency display prefs', e);
    }
  }, [options]);

  const updateOptions = (next: Partial<CurrencyDisplayOptions>) => {
    setOptions((prev) => ({ ...prev, ...next }));
  };

  const displayOWP = (amount: number) =>
    formatOWP(amount, {
      decimals: options.decimals,
      withFiat: options.showFiatEquivalent,
      fiatCurrency: options.fiatCurrency,
    });

  const displayINR = (amount: number) => formatINR(amount, { decimals: options.decimals });

  return { options, updateOptions, displayOWP, displayINR };
}
