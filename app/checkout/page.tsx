'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft, Lock, ShoppingCart,
  User, Phone, Mail, Globe, MessageCircle, AlertCircle, Loader2, FileText,
} from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useCurrency } from '@/lib/currency-context'
import { BUSINESS } from '@/lib/config'

const COUNTRIES = ['United Kingdom','United States','Canada','Australia','Germany','France','Netherlands','Sweden','UAE','Saudi Arabia','Other']

const schema = z.object({
  fullName:      z.string().min(2, 'Full name required'),
  email:         z.string().email('Valid email required'),
  whatsApp:      z.string().min(8, 'WhatsApp number required'),
  country:       z.string().min(1, 'Country required'),
  specialRequests: z.string().optional(),
})
type FormData = z.infer<typeof schema>

function CheckoutInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled')
  const { items, total, count, clearCart } = useCart()
  const { format } = useCurrency()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (count === 0) router.replace('/book')
  }, [count, router])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerName: data.fullName,
          customerEmail: data.email,
          customerWhatsApp: data.whatsApp,
          customerCountry: data.country,
          specialRequests: data.specialRequests,
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Payment setup failed')
      if (body.url) {
        clearCart()
        window.location.href = body.url
      }
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  if (count === 0) return null

  return (
    <div className="pt-16 min-h-screen bg-section-alt">
      <div className="container-custom py-10">
        <Link href="/book" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to booking
        </Link>

        {cancelled && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            Payment was cancelled. Your cart is still saved — try again when ready.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Form — left */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
              <h1 className="text-xl font-bold text-slate-900 mb-1">Your details</h1>
              <p className="text-sm text-slate-500 mb-6">We'll send your booking confirmation here and contact you on WhatsApp.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="label-field"><User className="w-3.5 h-3.5 inline mr-1" />Full Name</label>
                  <input type="text" {...register('fullName')} placeholder="Your full name" className="input-field" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field"><Mail className="w-3.5 h-3.5 inline mr-1" />Email Address</label>
                    <input type="email" {...register('email')} placeholder="your@email.com" className="input-field" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label-field"><Phone className="w-3.5 h-3.5 inline mr-1" />WhatsApp Number</label>
                    <input type="tel" {...register('whatsApp')} placeholder="+44 7700 000000" className="input-field" />
                    {errors.whatsApp && <p className="text-red-500 text-xs mt-1">{errors.whatsApp.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="label-field"><Globe className="w-3.5 h-3.5 inline mr-1" />Country</label>
                  <select {...register('country')} className="input-field">
                    <option value="">Select country...</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                </div>

                <div>
                  <label className="label-field"><FileText className="w-3.5 h-3.5 inline mr-1" />Special Requests <span className="text-slate-400 font-normal">(optional)</span></label>
                  <textarea {...register('specialRequests')} rows={2} placeholder="E.g. wheelchair, dietary needs, hotel name..." className="input-field resize-none" />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Stripe CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-base font-semibold justify-center mt-2"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting to secure payment…</>
                  ) : (
                    <><Lock className="w-5 h-5" /> Pay {format(total)} securely</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6 opacity-70" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-70" />
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Lock className="w-3 h-3" /> Powered by Stripe
                  </div>
                </div>

                <div className="text-center pt-1">
                  <p className="text-xs text-slate-400">
                    Questions?{' '}
                    <a
                      href={`https://wa.me/${BUSINESS.whatsappNumber}?text=Hi%2C%20I%20need%20help%20with%20checkout`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" /> Chat on WhatsApp
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Order summary — right */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-4 h-4 text-brand-600" />
                <h2 className="font-bold text-slate-900">Order Summary</h2>
                <span className="ml-auto text-xs text-slate-500">{count} item{count > 1 ? 's' : ''}</span>
              </div>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.cartId} className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 text-sm">{item.serviceLabel}</div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">{item.pickupLocation}{item.serviceType !== 'elderly-assistance' && item.serviceType !== 'umrah-with-qari' ? ` → ${item.dropoffLocation}` : ''}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {item.serviceType === 'elderly-assistance'
                            ? `${item.travelDate} · ${item.travelTime} · ${(item.hours ?? 4) >= 10 ? 'Full Day (10 hrs)' : `${item.hours ?? 4} hours`}`
                            : item.serviceType === 'umrah-with-qari'
                            ? `${item.travelDate} · ${item.travelTime} · ${item.passengers} pax`
                            : `${item.travelDate} · ${item.travelTime} · ${item.passengers} pax · ${item.luggage ?? 0} bags · ${item.vehicleType.replace(/-/g, ' ')}`}
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-sm flex-shrink-0">{format(item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>{format(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Processing fee</span>
                  <span className="text-green-600">Included</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base pt-1">
                  <span>Total</span>
                  <span>{format(total)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-brand-50 border border-brand-100 rounded-xl text-xs text-brand-700">
                <strong>After payment:</strong> You'll receive a booking confirmation email and our team will contact you on WhatsApp within minutes to confirm all details.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  )
}
