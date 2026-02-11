import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore
} from 'react'
import i18n from './i18n'
import { useTranslation, I18nextProvider } from 'react-i18next'

type Language = 'fr' | 'ar'
type Direction = 'ltr' | 'rtl'

interface I18nContextType {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  isReady: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const emptySubscribe = () => () => {}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Explicitly pass i18n to useTranslation to avoid NO_I18NEXT_INSTANCE on mount
  const { i18n: i18nHookInstance } = useTranslation(undefined, { i18n })

  // Hydration-safe detection of client-side readiness
  const isReady = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  // Derive language directly from i18next instance
  const i18nLang = i18nHookInstance.language
    ? i18nHookInstance.language.split('-')[0]
    : 'fr'
  const language = (
    i18nLang === 'ar' || i18nLang === 'fr' ? i18nLang : 'fr'
  ) as Language

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr'

  // Sync HTML attributes
  useEffect(() => {
    if (!isReady) return
    document.documentElement.dir = direction
    document.documentElement.lang = language
  }, [language, direction, isReady])

  const setLanguage = (lang: Language) => {
    i18nHookInstance.changeLanguage(lang)
  }

  const toggleLanguage = () => {
    const nextLang = language === 'fr' ? 'ar' : 'fr'
    setLanguage(nextLang)
  }

  return (
    <I18nextProvider i18n={i18n}>
      <I18nContext.Provider
        value={{ language, direction, setLanguage, toggleLanguage, isReady }}
      >
        <div className={!isReady ? 'invisible' : ''}>{children}</div>
      </I18nContext.Provider>
    </I18nextProvider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
