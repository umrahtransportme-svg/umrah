export type CurrencyCode = 'GBP' | 'USD' | 'EUR' | 'SAR' | 'AED' | 'PKR' | 'CAD' | 'AUD' | 'MYR' | 'IDR' | 'TRY' | 'BDT'

export interface Currency {
  code: CurrencyCode
  symbol: string
  name: string
  flag: string
  rate: number    // 1 GBP = rate units of this currency
  decimals: number
}

// Rates are approximate mid-2025 values — update periodically or swap for a live API
export const CURRENCIES: Currency[] = [
  { code: 'GBP', symbol: '£',    name: 'British Pound',      flag: '🇬🇧', rate: 1,      decimals: 2 },
  { code: 'USD', symbol: '$',    name: 'US Dollar',          flag: '🇺🇸', rate: 1.27,   decimals: 2 },
  { code: 'EUR', symbol: '€',    name: 'Euro',               flag: '🇪🇺', rate: 1.18,   decimals: 2 },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal',        flag: '🇸🇦', rate: 4.76,   decimals: 0 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham',         flag: '🇦🇪', rate: 4.66,   decimals: 0 },
  { code: 'PKR', symbol: '₨',   name: 'Pakistani Rupee',    flag: '🇵🇰', rate: 353,    decimals: 0 },
  { code: 'CAD', symbol: 'C$',   name: 'Canadian Dollar',   flag: '🇨🇦', rate: 1.73,   decimals: 2 },
  { code: 'AUD', symbol: 'A$',   name: 'Australian Dollar', flag: '🇦🇺', rate: 1.97,   decimals: 2 },
  { code: 'MYR', symbol: 'RM',   name: 'Malaysian Ringgit', flag: '🇲🇾', rate: 5.89,   decimals: 2 },
  { code: 'IDR', symbol: 'Rp',   name: 'Indonesian Rupiah', flag: '🇮🇩', rate: 20300,  decimals: 0 },
  { code: 'TRY', symbol: '₺',   name: 'Turkish Lira',       flag: '🇹🇷', rate: 43.2,   decimals: 0 },
  { code: 'BDT', symbol: '৳',   name: 'Bangladeshi Taka',   flag: '🇧🇩', rate: 139,    decimals: 0 },
]

export const DEFAULT_CURRENCY = CURRENCIES[0] // GBP

export function getCurrency(code: CurrencyCode): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? DEFAULT_CURRENCY
}

export function convertPrice(gbpAmount: number, currency: Currency): number {
  return gbpAmount * currency.rate
}

export function formatCurrency(gbpAmount: number, currency: Currency): string {
  const converted = convertPrice(gbpAmount, currency)
  const formatted = converted.toLocaleString('en-GB', {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  })
  // RTL-friendly: put symbol before for most, handle SAR/AED specially
  if (currency.code === 'SAR' || currency.code === 'AED') {
    return `${formatted} ${currency.symbol}`
  }
  return `${currency.symbol}${formatted}`
}
