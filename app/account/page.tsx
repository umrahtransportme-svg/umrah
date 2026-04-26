'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  User, CalendarDays, CreditCard, LogOut,
  Phone, Globe, Mail, Save, CheckCircle,
  Package, Clock, XCircle, Loader2,
  ShieldCheck,
} from 'lucide-react'
import { getProfile, saveProfile, getBookings } from '@/lib/user-storage'
import { formatPrice } from '@/lib/utils'
import type { UserProfile, SavedBooking } from '@/types'

type Tab = 'profile' | 'bookings' | 'payment'

const COUNTRIES = [
  'United Kingdom', 'United States', 'Canada', 'Australia',
  'Germany', 'France', 'Netherlands', 'Sweden',
  'UAE', 'Saudi Arabia', 'Pakistan', 'Bangladesh', 'Other',
]

const STATUS_STYLES: Record<SavedBooking['status'], string> = {
  pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
}

const STATUS_ICONS: Record<SavedBooking['status'], React.ElementType> = {
  pending:   Clock,
  confirmed: CheckCircle,
  completed: CheckCircle,
  cancelled: XCircle,
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('profile')

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Bookings state
  const [bookings, setBookings] = useState<SavedBooking[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/account')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) {
      setProfile(getProfile(session.user.email))
      setBookings(getBookings(session.user.email))
    }
  }, [session])

  function handleSave() {
    if (!session?.user?.email) return
    setSaving(true)
    saveProfile(session.user.email, profile)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }, 600)
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-section-alt flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  const user = session!.user!

  return (
    <div className="min-h-screen bg-section-alt pt-16">
      <div className="container-custom py-10 max-w-4xl">

        {/* Profile header */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 mb-6 flex items-center gap-5">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={64}
              height={64}
              className="rounded-full ring-2 ring-brand-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl">
              {(user.name || 'U')[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 truncate">{user.name}</h1>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-slate-100 shadow-card p-1.5 mb-6">
          {([
            { id: 'profile',  label: 'Profile',          icon: User },
            { id: 'bookings', label: 'My Bookings',       icon: CalendarDays },
            { id: 'payment',  label: 'Payment Methods',   icon: CreditCard },
          ] as { id: Tab; label: string; icon: React.ElementType }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Personal Information</h2>
            <p className="text-sm text-slate-500 mb-6">
              This information is pre-filled during checkout for a faster booking experience.
            </p>

            <div className="space-y-5">
              {/* Name — read only from Google */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  type="text"
                  value={user.name || ''}
                  disabled
                  className="input-field bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Synced from your Google account</p>
              </div>

              {/* Email — read only */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="input-field bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                  <Phone className="w-3.5 h-3.5" /> WhatsApp / Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+44 7700 000000"
                  className="input-field"
                />
              </div>

              {/* Country */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                  <Globe className="w-3.5 h-3.5" /> Country
                </label>
                <select
                  value={profile.country || ''}
                  onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary py-3 px-6"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                ) : saved ? (
                  <><CheckCircle className="w-4 h-4" /> Saved!</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Bookings tab */}
        {tab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">My Bookings</h2>
            <p className="text-sm text-slate-500 mb-6">
              All bookings made while signed in to this account.
            </p>

            {bookings.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-600 mb-1">No bookings yet</h3>
                <p className="text-sm text-slate-400 mb-5">
                  Your bookings will appear here after you complete a checkout.
                </p>
                <a href="/book" className="btn-primary text-sm">Browse Services</a>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => {
                  const Icon = STATUS_ICONS[b.status]
                  return (
                    <div key={b.bookingRef} className="border border-slate-100 rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="font-mono text-sm font-bold text-brand-700">{b.bookingRef}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{b.bookedAt}</div>
                        </div>
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[b.status]}`}>
                          <Icon className="w-3 h-3" />
                          {b.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        {b.services.join(' · ')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{b.itemCount} service{b.itemCount > 1 ? 's' : ''}</span>
                        <span className="font-bold text-slate-900">{formatPrice(b.total)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Payment tab */}
        {tab === 'payment' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Payment Methods</h2>
            <p className="text-sm text-slate-500 mb-6">
              Your card details are securely managed by Stripe.
            </p>

            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-6 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-800 mb-1">Secured by Stripe</p>
                <p className="text-sm text-brand-700">
                  We never store your card details on our servers. All payments are processed
                  securely through Stripe, which is PCI-DSS Level 1 compliant — the highest level
                  of payment security available.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {['Visa', 'Mastercard', 'American Express', 'Discover'].map((card) => (
                <div key={card} className="border border-slate-100 rounded-xl py-3 px-2 text-center text-xs font-medium text-slate-500">
                  {card}
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-600">
              <p className="font-medium text-slate-700 mb-1">How payments work</p>
              <ul className="space-y-1.5 text-slate-500">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-brand-500" /> You enter card details directly on Stripe's secure page</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-brand-500" /> Payment is captured only after booking confirmation</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-brand-500" /> Full refund available if we can't fulfil your booking</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
