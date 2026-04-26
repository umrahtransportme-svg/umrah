'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { LANGUAGES, TRANSLATIONS, type LangCode, type TKey } from './i18n'

interface LanguageContextValue {
  lang: LangCode
  setLang: (code: LangCode) => void
  t: (key: TKey) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  dir: 'ltr',
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en')

  useEffect(() => {
    const saved = localStorage.getItem('ut_lang') as LangCode | null
    if (saved && LANGUAGES.find((l) => l.code === saved)) setLangState(saved)
  }, [])

  useEffect(() => {
    const langDef = LANGUAGES.find((l) => l.code === lang)
    const dir = langDef?.dir ?? 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = lang
  }, [lang])

  function setLang(code: LangCode) {
    setLangState(code)
    localStorage.setItem('ut_lang', code)
  }

  function t(key: TKey): string {
    return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key
  }

  const dir = LANGUAGES.find((l) => l.code === lang)?.dir ?? 'ltr'

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
