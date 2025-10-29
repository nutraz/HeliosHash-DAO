"use client";

// === HHDAO Internationalization Hook System ===
// Simple translation system for 26 languages

import { GovernanceTranslations, LanguageCode, SUPPORTED_LANGUAGES } from './types';

// Import translation files
import { englishTranslations } from './translations/en';
import { gujaratiTranslations } from './translations/gu';
import { hindiTranslations } from './translations/hi';
import { indonesianTranslations } from './translations/id';
import { thaiTranslations } from './translations/th';
import { tagalogTranslations } from './translations/tl';

// Translation registry
const TRANSLATIONS: Record<LanguageCode, GovernanceTranslations> = {
  en: englishTranslations,
  hi: hindiTranslations,
  gu: gujaratiTranslations,
  id: indonesianTranslations,
  th: thaiTranslations,
  tl: tagalogTranslations,

  // Fallback to English for other languages (to be implemented)
  bn: englishTranslations, // Bengali
  te: englishTranslations, // Telugu
  mr: englishTranslations, // Marathi
  ta: englishTranslations, // Tamil
  ur: englishTranslations, // Urdu
  kn: englishTranslations, // Kannada
  or: englishTranslations, // Odia
  pa: englishTranslations, // Punjabi
  ml: englishTranslations, // Malayalam
  as: englishTranslations, // Assamese
  mai: englishTranslations, // Maithili
  sa: englishTranslations, // Sanskrit
  ne: englishTranslations, // Nepali
  kok: englishTranslations, // Konkani
  mni: englishTranslations, // Manipuri
  brx: englishTranslations, // Bodo
  doi: englishTranslations, // Dogri
  ks: englishTranslations, // Kashmiri
  sat: englishTranslations, // Santali
  sd: englishTranslations, // Sindhi
  ps: englishTranslations, // Pashto
};


import { useEffect, useState } from 'react';

// === Simple Translation Function ===
export const getTranslations = (language: LanguageCode): GovernanceTranslations => {
  return TRANSLATIONS[language] || TRANSLATIONS['en'];
};

// === React Hook: useTranslation ===
export function useTranslation() {
  const [language, setLanguage] = useState<LanguageCode>(() => getLanguagePreference());
  const [translations, setTranslations] = useState<GovernanceTranslations>(() => getTranslations(language));

  useEffect(() => {
    const lang = getLanguagePreference();
    setLanguage(lang);
    setTranslations(getTranslations(lang));
  }, []);

  // Simple t function: t(key, vars)
  function t(key: string, vars?: Record<string, any>): string {
    // Only supports flat keys, e.g. 'rewards.claimAmount'
    const value = key.split('.').reduce<any>((obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined), translations);
    if (typeof value === 'string') {
      let str = value;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`{${k}}`, 'g'), String(v));
        }
      }
      return str;
    }
    return key;
  }

  return { t, language };
}

// === Language Detection ===
export const detectBrowserLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') return 'en';

  const browserLanguages = navigator.languages || [navigator.language];

  for (const browserLang of browserLanguages) {
    // Try exact match
    const exactMatch = browserLang as LanguageCode;
    if (SUPPORTED_LANGUAGES[exactMatch]) {
      return exactMatch;
    }

    // Try language code without region (e.g., 'hi' from 'hi-IN')
    const langCode = browserLang.split('-')[0] as LanguageCode;
    if (SUPPORTED_LANGUAGES[langCode]) {
      return langCode;
    }
  }

  return 'en';
};

// === Language Storage ===
export const saveLanguagePreference = (language: LanguageCode): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hhdao-language', language);

    // Set document direction for RTL languages
    document.documentElement.dir = SUPPORTED_LANGUAGES[language].rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }
};

export const getLanguagePreference = (): LanguageCode => {
  if (typeof window === 'undefined') return 'en';

  const saved = localStorage.getItem('hhdao-language') as LanguageCode;
  if (saved && SUPPORTED_LANGUAGES[saved]) {
    return saved;
  }

  return detectBrowserLanguage();
};

// === Helper Functions ===

/**
 * Format numbers according to locale
 */
export const formatNumber = (num: number, language: LanguageCode): string => {
  const locale = getLocaleForLanguage(language);
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Format dates according to locale
 */
export const formatDate = (date: Date, language: LanguageCode): string => {
  const locale = getLocaleForLanguage(language);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Get appropriate locale for language code
 */
const getLocaleForLanguage = (language: LanguageCode): string => {
  const localeMap: Record<LanguageCode, string> = {
    hi: 'hi-IN',
    bn: 'bn-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    gu: 'gu-IN',
    ur: 'ur-IN',
    kn: 'kn-IN',
    or: 'or-IN',
    pa: 'pa-IN',
    ml: 'ml-IN',
    as: 'as-IN',
    mai: 'hi-IN', // Fallback
    sa: 'hi-IN', // Fallback
    ne: 'ne-NP',
    kok: 'hi-IN', // Fallback
    mni: 'hi-IN', // Fallback
    brx: 'hi-IN', // Fallback
    doi: 'hi-IN', // Fallback
    ks: 'hi-IN', // Fallback
    sat: 'hi-IN', // Fallback
    sd: 'hi-IN', // Fallback
    ps: 'ps-AF',
    id: 'id-ID',
    tl: 'tl-PH',
    th: 'th-TH',
    en: 'en-US',
  };

  return localeMap[language] || 'en-US';
};

// === Export everything ===
export { SUPPORTED_LANGUAGES, TRANSLATIONS, type GovernanceTranslations, type LanguageCode };
