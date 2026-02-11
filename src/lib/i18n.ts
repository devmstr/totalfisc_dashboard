import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import fr from '../../public/locales/fr/translation.json'
import ar from '../../public/locales/ar/translation.json'

const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  i18n.use(LanguageDetector).use(Backend)
}

i18n.use(initReactI18next).init({
  supportedLngs: ['fr', 'ar'],
  fallbackLng: 'fr',
  debug: false,
  resources: {
    fr: { translation: fr },
    ar: { translation: ar }
  },
  interpolation: {
    escapeValue: false
  },
  backend: isBrowser
    ? {
        loadPath: '/locales/{{lng}}/translation.json'
      }
    : undefined,
  detection: {
    order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
    caches: ['localStorage']
  }
})

export default i18n
