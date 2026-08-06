import { getUrlParam } from './url-params';

/**
 * Supported languages - single source of truth
 */
export const SUPPORTED_LANGUAGES = ['en', 'de', 'es', 'fr', 'it', 'tr', 'ar'] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];
export const DEFAULT_LANGUAGE: Language = 'en';
export type TextDirection = 'ltr' | 'rtl';

/**
 * Translation dictionary type - key-first structure
 * All translations for a key are grouped together
 */
export type TranslationDict<Keys extends string> = {
  [K in Keys]: {
    [L in Language]?: string;
  };
};

/**
 * Get current language from URL parameter
 * Reads ?lang=de from URL (follows debug.ts pattern)
 *
 * @returns Language code or default ('en')
 *
 * @example
 * // URL: http://localhost:8080/?lang=de
 * getCurrentLanguage(); // Returns 'de'
 *
 * // URL: http://localhost:8080/
 * getCurrentLanguage(); // Returns 'en'
 */
export function getCurrentLanguage(): Language {
  const lang = getUrlParam('lang')
    ?.trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0];

  if (lang && isSupportedLanguage(lang)) return lang;
  return DEFAULT_LANGUAGE;
}

export function getLanguageDirection(language: Language = getCurrentLanguage()): TextDirection {
  return language === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Create a type-safe translation function with template support
 *
 * This is the main API that games use. It:
 * 1. Detects current language from URL
 * 2. Returns translation function with full type safety
 * 3. Automatically falls back to English if translation missing
 * 4. Supports template variables for dynamic strings
 *
 * @param translations - Dictionary of translations (key-first structure)
 * @returns Translation function t(key) or t(key, vars)
 *
 * @example
 * const translations = {
 *   hint: { en: "Tap to start", de: "Tippen zum Starten" },
 *   level: { en: "Level {n}", de: "Level {n}" }
 * };
 * const t = createTranslator(translations);
 * t('hint');              // Returns "Tap to start" or "Tippen zum Starten"
 * t('level', { n: 5 });   // Returns "Level 5"
 */
export function createTranslator<Keys extends string>(
  translations: TranslationDict<Keys>
): {
  (key: Keys): string;
  (key: Keys, vars: Record<string, string | number>): string;
} {
  const currentLang = getCurrentLanguage();

  return ((key: Keys, vars?: Record<string, string | number>): string => {
    const keyTranslations = translations[key];

    // Three-level fallback: current language → English → key itself
    let text = keyTranslations?.[currentLang]
            || keyTranslations?.en
            || String(key);

    // Template replacement: {varName} → value
    if (vars) {
      Object.entries(vars).forEach(([varName, value]) => {
        text = text.replace(new RegExp(`\\{${varName}\\}`, 'g'), String(value));
      });
    }

    return text;
  }) as any;
}

function isSupportedLanguage(value: string): value is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}
