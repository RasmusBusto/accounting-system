import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationsNO from './locales/no.json';
import translationsEN from './locales/en.json';

// Translation resources
const resources = {
  no: {
    translation: translationsNO,
  },
  en: {
    translation: translationsEN,
  },
};

// Initialize i18next synchronously
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'no', // Norwegian as default fallback
    lng: 'no', // Default language is Norwegian
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense since we're loading synchronously
    },
    load: 'languageOnly', // Load only language code (no, en) not region codes (no-NO, en-US)
    debug: false,
  });

// Force Norwegian if no language is detected
if (!i18n.language || !['no', 'en'].includes(i18n.language)) {
  i18n.changeLanguage('no');
}

export default i18n;
