'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  X, Trash2, ShoppingCart, ArrowRight, MessageCircle,
  Plane, MapPin, Star, Heart, Plus, Car, Sparkles,
} from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/lib/currency-context'
import type { CartItem, ServiceType } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  onOpenService?: (id: ServiceType, label: string) => void
}

// ─── Smart suggestion engine ─────────────────────────────────────────────────

interface Suggestion {
  id: ServiceType
  label: string
  reason: string
  icon: React.ElementType
  color: string
}

function getSuggestions(items: CartItem[]): Suggestion[] {
  const suggestions: Suggestion[] = []
  const types = new Set(items.map((i) => i.serviceType))

  const hasArrival = items.some(
    (i) => i.serviceType === 'airport-transfer' &&
      (i.pickupLocation.includes('Airport') || i.pickupLocation.includes('JED') || i.pickupLocation.includes('MED'))
  )
  const hasDeparture = items.some(
    (i) => i.serviceType === 'airport-transfer' &&
      (i.dropoffLocation.includes('Airport') || i.dropoffLocation.includes('JED') || i.dropoffLocation.includes('MED'))
  )
  if (hasArrival && !hasDeparture) {
    suggestions.push({
      id: 'airport-transfer',
      label: 'Departure Transfer',
      reason: "Don't forget your return trip to the airport",
      icon: Plane,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
    })
  }

  const hasMakkah = items.some(
    (i) => i.pickupLocation.toLowerCase().includes('makkah') || i.dropoffLocation.toLowerCase().includes('makkah')
  )
  const hasMadinah = items.some(
    (i) => i.pickupLocation.toLowerCase().includes('madinah') || i.dropoffLocation.toLowerCase().includes('madinah')
  )
  const hasMakkahZiyarat  = items.some((i) => i.serviceType === 'ziyarat-tour' && i.pickupLocation.includes('Makkah'))
  const hasMadinahZiyarat = items.some((i) => i.serviceType === 'ziyarat-tour' && i.pickupLocation.includes('Madinah'))
  const hasBadr           = items.some((i) => i.serviceType === 'ziyarat-tour' && i.pickupLocation.includes('Bader'))

  if (hasMakkah && !hasMakkahZiyarat) {
    suggestions.push({
      id: 'ziyarat-tour',
      label: 'Makkah Ziyarat Tour',
      reason: 'Visit sacred historical sites in Makkah',
      icon: MapPin,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    })
  }
  if (hasMadinah && !hasMadinahZiyarat) {
    suggestions.push({
      id: 'ziyarat-tour',
      label: 'Madinah Ziyarat Tour',
      reason: 'Visit Masjid Nabawi & historic Madinah sites',
      icon: MapPin,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    })
  }
  if ((hasMakkahZiyarat || hasMadinahZiyarat) && !hasBadr) {
    suggestions.push({
      id: 'ziyarat-tour',
      label: 'Badr Ziyarat',
      reason: 'Visit the historic Battle of Badr site',
      icon: MapPin,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    })
  }
  if (!types.has('umrah-with-qari')) {
    suggestions.push({
      id: 'umrah-with-qari',
      label: 'Guided Umrah with Qari',
      reason: 'Perform Umrah step-by-step with a certified scholar',
      icon: Star,
      color: 'bg-amber-50 border-amber-200 text-amber-800',
    })
  }
  if (!types.has('elderly-assistance')) {
    suggestions.push({
      id: 'elderly-assistance',
      label: 'Elderly Assistance',
      reason: 'Hire a dedicated helper — from £80 / 4 hrs',
      icon: Heart,
      color: 'bg-rose-50 border-rose-200 text-rose-800',
    })
  }

  return suggestions.slice(0, 3)
}

// ─── Item detail line ─────────────────────────────────────────────────────────

function itemDetail(item: CartItem) {
  if (item.serviceType === 'elderly-assistance') {
    const hrs = item.hours ?? 4
    return `${item.travelDate} · ${item.travelTime} · ${hrs >= 10 ? 'Full Day (10 hrs)' : `${hrs} hours`}`
  }
  if (item.serviceType === 'umrah-with-qari') {
    return `${item.travelDate} · ${item.travelTime} · ${item.passengers} pax`
  }
  return `${item.travelDate} · ${item.travelTime} · ${item.passengers} pax · ${item.luggage ?? 0} bags · ${item.vehicleType.replace(/-/g, ' ')}`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CartDrawer({ open, onClose, onOpenService }: Props) {
  const { items, removeItem, total, count } = useCart()
  const { format } = useCurrency()
  const suggestions = getSuggestions(items)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn('fixed inset-0 bg-slate-900/50 z-40 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        'fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-600" />
            <h2 className="font-bold text-slate-900">Your Booking Cart</h2>
            {count > 0 && (
              <span className="w-5 h-5 bg-brand-600 text-white rounded-full text-xs flex items-center justify-center font-bold">{count}</span>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-4 px-6 space-y-3">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingCart className="w-12 h-12 text-slate-200 mb-4" />
              <h3 className="font-semibold text-slate-600 mb-1">Your cart is empty</h3>
              <p className="text-sm text-slate-400">Add services from the booking page</p>
              <button onClick={onClose} className="btn-secondary mt-5 text-sm">Browse Services</button>
            </div>
          ) : (
            <>
              {/* Cart items */}
              {items.map((item) => (
                <div key={item.cartId} className="bg-slate-50 rounded-2xl p-4 relative group">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-slate-900 text-sm">{item.serviceLabel}</h4>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex gap-1">
                      <span className="text-slate-400">From:</span>
                      <span className="text-slate-700 font-medium">{item.pickupLocation}</span>
                    </div>
                    {item.serviceType !== 'elderly-assistance' && item.serviceType !== 'umrah-with-qari' && (
                      <div className="flex gap-1">
                        <span className="text-slate-400">To:</span>
                        <span className="text-slate-700 font-medium">{item.dropoffLocation}</span>
                      </div>
                    )}
                    <div className="text-slate-400">{itemDetail(item)}</div>
                    {item.specialRequests && <div className="text-slate-400 italic">{item.specialRequests}</div>}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-medium">
                      {item.serviceType === 'elderly-assistance' ? 'Helper hire' : 'Estimated'}
                    </span>
                    <span className="font-bold text-slate-900">{format(item.price)}</span>
                  </div>
                </div>
              ))}

              {/* Smart suggestions */}
              {suggestions.length > 0 && onOpenService && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    Suggested add-ons for your trip
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onClose()
                          onOpenService(s.id, s.label)
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all hover:shadow-sm',
                          s.color
                        )}
                      >
                        <div className="w-7 h-7 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0">
                          <s.icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold">{s.label}</div>
                          <div className="text-[11px] opacity-75 truncate">{s.reason}</div>
                        </div>
                        <Plus className="w-4 h-4 opacity-60 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <div className="border-t border-slate-100 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">{count} service{count > 1 ? 's' : ''} · Total estimate</div>
                <div className="text-2xl font-bold text-slate-900">{format(total)}</div>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>Secure card payment</div>
                <div>Visa · Mastercard</div>
              </div>
            </div>

            {/* Dual CTA */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onClose}
                className="btn-secondary justify-center py-2.5 text-sm font-semibold"
              >
                <Car className="w-4 h-4" />
                Add More
              </button>
              <Link
                href="/checkout"
                onClick={onClose}
                className="btn-primary justify-center py-2.5 text-sm font-semibold"
              >
                Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '447456938750'}?text=Hi%2C%20I%20need%20help%20with%20my%20booking`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full justify-center py-2.5 text-sm"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              Need help? Chat on WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  )
}
