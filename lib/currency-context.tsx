'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { CURRENCIES, DEFAULT_CURRENCY, getCurrency, formatCurrency, type Currency, type CurrencyCode } from './currency'

interface CurrencyContextValue {
  currency: Currency
  setCurrency: (code: CurrencyCode) => void
  format: (gbpAmount: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  format: (n) => `£${n.toFixed(2)}`,
})

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY)

  useEffect(() => {
    const saved = localStorage.getItem('ut_currency') as CurrencyCode | null
    if (saved && CURRENCIES.find((c) => c.code === saved)) {
      setCurrencyState(getCurrency(saved))
    }
  }, [])

  function setCurrency(code: CurrencyCode) {
    const c = getCurrency(code)
    setCurrencyState(c)
    localStorage.setItem('ut_currency', code)
  }

  function format(gbpAmount: number): string {
    return formatCurrency(gbpAmount, currency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
