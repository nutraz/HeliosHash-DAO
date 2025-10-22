// === HHDAO Internationalization System ===
// Comprehensive multi-language support for diverse communities

'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { GovernanceTranslations, LanguageCode, SUPPORTED_LANGUAGES } from './types';

// Import translation files
import { englishTranslations } from './translations/en';
import { gujaratiTranslations } from './translations/gu';
import { hindiTranslations } from './translations/hi';
import { indonesianTranslations } from './translations/id';
import nepaliTranslations from './translations/ne';

// Translation registry
const TRANSLATIONS: Record<LanguageCode, GovernanceTranslations> = {
  en: englishTranslations,
  hi: hindiTranslations,
  gu: gujaratiTranslations,
  id: indonesianTranslations,

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
  ne: nepaliTranslations, // Nepali
  kok: englishTranslations, // Konkani
  mni: englishTranslations, // Manipuri
  brx: englishTranslations, // Bodo
  doi: englishTranslations, // Dogri
  ks: englishTranslations, // Kashmiri
  sat: englishTranslations, // Santali
  sd: englishTranslations, // Sindhi
  ps: englishTranslations, // Pashto
  tl: englishTranslations, // Tagalog
  th: englishTranslations, // Thai
};

// === Language Context ===
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: GovernanceTranslations;
  isRTL: boolean;
  languageInfo: (typeof SUPPORTED_LANGUAGES)[LanguageCode];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// === Language Provider ===
interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: LanguageCode;
}

export const LanguageProvider = ({ children, defaultLanguage = 'en' }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage);

  // Load saved language preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('hhdao-language') as LanguageCode;
      if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
        setLanguageState(savedLanguage);
      } else {
        // Try to detect browser language
        const browserLang = detectBrowserLanguage();
        if (browserLang) {
          setLanguageState(browserLang);
        }
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hhdao-language', lang);

      // Set document direction for RTL languages
      document.documentElement.dir = SUPPORTED_LANGUAGES[lang].rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t: TRANSLATIONS[language],
    isRTL: SUPPORTED_LANGUAGES[language].rtl,
    languageInfo: SUPPORTED_LANGUAGES[language],
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

// === Language Hook ===
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// === Language Detection ===
const detectBrowserLanguage = (): LanguageCode | null => {
  if (typeof window === 'undefined') return null;

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

  return null;
};

// === Language Selector Component ===
export const LanguageSelector = () => {
  const { language, setLanguage, languageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const groupedLanguages = {
    'Indian Languages': Object.entries(SUPPORTED_LANGUAGES).filter(
      ([_, info]) => info.region === 'India'
    ),
    'Regional Languages': Object.entries(SUPPORTED_LANGUAGES).filter(
      ([_, info]) => info.region !== 'India' && info.region !== 'Global'
    ),
    Global: Object.entries(SUPPORTED_LANGUAGES).filter(([_, info]) => info.region === 'Global'),
  };

  return (
    <div className='language-selector relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
      >
        <span className='text-sm font-medium'>{languageInfo.name}</span>
        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[250px] max-h-96 overflow-y-auto'>
          {Object.entries(groupedLanguages).map(([groupName, languages]) => (
            <div key={groupName} className='border-b border-gray-100 last:border-b-0'>
              <div className='px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50'>
                {groupName}
              </div>
              {languages.map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code as LanguageCode);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                    language === code ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{info.name}</span>
                    <span className='text-sm text-gray-500'>{info.englishName}</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
export { SUPPORTED_LANGUAGES, type GovernanceTranslations, type LanguageCode };
