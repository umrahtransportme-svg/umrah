'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plane, Car, MapPin, Star, Heart,
  ShoppingCart, MessageCircle, Shield, Clock, CreditCard, CheckCircle,
  Plus, Trash2,
} from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import ServiceConfigModal from './ServiceConfigModal'
import CartDrawer from './CartDrawer'
import { PRICING } from '@/lib/config'
import { useCurrency } from '@/lib/currency-context'
import type { ServiceType } from '@/types'

const SERVICES: {
  id: ServiceType
  icon: React.ElementType
  label: string
  desc: string
  longDesc: string
  from: number
  color: string
  iconBg: string
  features: string[]
}[] = [
  {
    id: 'airport-transfer',
    icon: Plane,
    label: 'Airport Transfer',
    desc: 'Jeddah & Madinah airports',
    longDesc: 'Private door-to-door transfer with meet & greet, flight tracking and luggage assistance.',
    from: PRICING.airportTransfer.sedan,
    color: 'border-blue-200 hover:border-blue-400',
    iconBg: 'bg-blue-50 text-blue-600',
    features: ['Meet & greet with name board', 'Flight tracking — no extra wait charge', 'All airports · 24/7'],
  },
  {
    id: 'intercity-transfer',
    icon: Car,
    label: 'Intercity Transfer',
    desc: 'Makkah · Madinah · Jeddah',
    longDesc: 'Fully private intercity transfers — you won\'t share with strangers. Comfort stops available.',
    from: PRICING.intercityTransfer.sedan,
    color: 'border-violet-200 hover:border-violet-400',
    iconBg: 'bg-violet-50 text-violet-600',
    features: ['100% private — no shared taxis', 'Prayer & comfort stops on request', 'All city-to-city routes'],
  },
  {
    id: 'ziyarat-tour',
    icon: MapPin,
    label: 'Ziyarat Tour',
    desc: 'Islamic historical sites',
    longDesc: 'Private guided tours of the key Islamic sites in Makkah and Madinah with a knowledgeable guide.',
    from: PRICING.ziyaratTour.halfDay,
    color: 'border-emerald-200 hover:border-emerald-400',
    iconBg: 'bg-emerald-50 text-emerald-600',
    features: ['English · Urdu · Arabic guides', 'Half-day & full-day options', 'Makkah & Madinah tours'],
  },
  {
    id: 'umrah-with-qari',
    icon: Star,
    label: 'Umrah with Qari',
    desc: 'Guided Umrah performance',
    longDesc: 'A certified Qari guides you through every step of Umrah — from niyyah and ihram through tawaf and sa\'i.',
    from: PRICING.umrahWithQari,
    color: 'border-amber-200 hover:border-amber-400',
    iconBg: 'bg-amber-50 text-amber-600',
    features: ['Certified Islamic scholar', 'Correct duas & recitations', 'Ideal for first-time pilgrims'],
  },
  {
    id: 'elderly-assistance',
    icon: Heart,
    label: 'Elderly Assistance',
    desc: 'Personal care & support',
    longDesc: 'A dedicated personal helper — wheelchair support, Haram access assistance and transportation.',
    from: PRICING.elderlyAssistance.hourlyRate * PRICING.elderlyAssistance.minHours,
    color: 'border-rose-200 hover:border-rose-400',
    iconBg: 'bg-rose-50 text-rose-600',
    features: ['Dedicated personal helper', 'Wheelchair & Haram support', 'Female helpers available'],
  },
]

export default function BookPage() {
  const { items, total, count, removeItem } = useCart()
  const [configuring, setConfiguring] = useState<{ id: ServiceType; label: string } | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const { addItem } = useCart()
  const { format } = useCurrency()

  return (
    <div className="pt-16 min-h-screen bg-section-alt">
      {/* Hero */}
      <div className="bg-white border-b border-slate-100">
        <div className="container-custom py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="section-tag mb-3">Online Booking</span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Build Your <span className="text-gradient">Umrah Package</span>
              </h1>
              <p className="text-slate-500 max-w-lg">
                Add one or more services to your cart, then pay securely in one checkout. Instant WhatsApp confirmation after payment.
              </p>
              <div className="flex flex-wrap gap-4 mt-5">
                {[
                  { icon: CreditCard, text: 'Visa & Mastercard' },
                  { icon: Shield,     text: 'Secure Stripe payment' },
                  { icon: Clock,      text: 'Instant confirmation' },
                  { icon: MessageCircle, text: '24/7 WhatsApp support' },
                ].map((g) => (
                  <div key={g.text} className="flex items-center gap-1.5 text-sm text-slate-600">
                    <g.icon className="w-4 h-4 text-brand-600" />
                    {g.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Cart summary pill */}
            {count > 0 && (
              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-3 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl transition-colors shadow-brand flex-shrink-0"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-brand-700 rounded-full text-xs font-bold flex items-center justify-center">
                    {count}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-xs opacity-80">{count} service{count > 1 ? 's' : ''}</div>
                  <div className="font-bold text-sm">{format(total)}</div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
          {SERVICES.map((svc) => {
            const inCart = items.filter((i) => i.serviceType === svc.id).length
            return (
              <div
                key={svc.id}
                className={`bg-white rounded-3xl border-2 p-6 flex flex-col transition-all duration-200 shadow-card hover:shadow-card-hover ${svc.color}`}
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${svc.iconBg}`}>
                    <svc.icon className="w-6 h-6" />
                  </div>
                  {inCart > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 px-2 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        {inCart} in cart
                      </span>
                      <button
                        onClick={() => {
                          const last = [...items].reverse().find((i) => i.serviceType === svc.id)
                          if (last) removeItem(last.cartId)
                        }}
                        className="p-1 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Remove one from cart"
                        title="Remove one"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="font-bold text-slate-900 text-lg mb-1">{svc.label}</h3>
                <p className="text-xs text-slate-500 mb-2">{svc.desc}</p>
                <p className="text-sm text-slate-600 mb-4 flex-1">{svc.longDesc}</p>

                <ul className="space-y-1.5 mb-5">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-xs text-slate-400">From</div>
                    <div className="text-xl font-bold text-slate-900">{format(svc.from)}</div>
                  </div>
                  <button
                    onClick={() => setConfiguring({ id: svc.id, label: svc.label })}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Checkout strip */}
        {count > 0 ? (
          <div className="sticky bottom-6 bg-white border border-slate-200 rounded-2xl shadow-card-hover px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900">{count} service{count > 1 ? 's' : ''} added</div>
                <div className="text-sm text-slate-500">Total estimate: <span className="font-semibold text-slate-800">{format(total)}</span></div>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={() => setCartOpen(true)} className="btn-secondary text-sm flex-1 sm:flex-none">
                View Cart
              </button>
              <Link href="/checkout" className="btn-primary text-sm flex-1 sm:flex-none justify-center">
                <CreditCard className="w-4 h-4" />
                Checkout
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-t border-slate-100">
            <p className="text-slate-500 text-sm mb-3">Need help choosing? Our team is available 24/7.</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '447700000000'}?text=Hi%2C%20I%27d%20like%20help%20planning%20my%20Umrah%20transport`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex text-sm"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              Chat with us on WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* Service config modal */}
      {configuring && (
        <ServiceConfigModal
          serviceType={configuring.id}
          serviceLabel={configuring.label}
          onAdd={(data) => addItem({ ...data, serviceType: configuring.id, serviceLabel: configuring.label })}
          onClose={() => setConfiguring(null)}
        />
      )}

      {/* Cart drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenService={(id, label) => {
          setCartOpen(false)
          setConfiguring({ id, label })
        }}
      />
    </div>
  )
}
