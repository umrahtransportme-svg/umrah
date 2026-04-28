'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  User, CalendarDays, CreditCard, LogOut, Phone, Globe, Mail,
  Save, CheckCircle, Package, Clock, XCircle, Loader2, ShieldCheck,
  FileText, BookOpen, Download, AlertCircle,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type Tab = 'profile' | 'passport' | 'bookings' | 'invoices' | 'payment'

const COUNTRIES = [
  'United Kingdom', 'United States', 'Canada', 'Australia',
  'Germany', 'France', 'Netherlands', 'Sweden', 'UAE',
  'Saudi Arabia', 'Pakistan', 'Bangladesh', 'India', 'Other',
]

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
}

interface Booking {
  id: string; reference: string; status: string; serviceType: string
  pickupLocation: string; dropoffLocation: string; travelDate: string
  passengers: number; vehicleType: string; totalAmount: number
  customerName: string; createdAt: string
}

interface Profile { name?: string; phone?: string; nationality?: string; dateOfBirth?: string }
interface Passport {
  fullName?: string; passportNumber?: string; nationality?: string
  dateOfBirth?: string; issueDate?: string; expiryDate?: string
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('profile')

  const [profile, setProfile] = useState<Profile>({})
  const [passport, setPassport] = useState<Passport>({})
  const [bookings, setBookings] = useState<Booking[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')
  const [error, setError] = useState('')
  const [loadingBookings, setLoadingBookings] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin?callbackUrl=/account')
  }, [status, router])

  useEffect(() => {
    if (!session?.user?.email) return
    fetch('/api/account/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
    fetch('/api/account/passport').then(r => r.ok ? r.json() : null).then(d => { if (d) setPassport(d) })
  }, [session])

  useEffect(() => {
    if (tab === 'bookings' || tab === 'invoices') {
      setLoadingBookings(true)
      fetch('/api/account/bookings').then(r => r.ok ? r.json() : []).then(d => { setBookings(d); setLoadingBookings(false) })
    }
  }, [tab])

  async function saveProfile() {
    setSaving(true); setError(''); setSaved('')
    const res = await fetch('/api/account/profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    setSaving(false)
    if (res.ok) { setSaved('profile'); setTimeout(() => setSaved(''), 2500) }
    else setError('Failed to save. Please try again.')
  }

  async function savePassport() {
    setSaving(true); setError(''); setSaved('')
    const res = await fetch('/api/account/passport', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passport),
    })
    setSaving(false)
    if (res.ok) { setSaved('passport'); setTimeout(() => setSaved(''), 2500) }
    else setError('Failed to save. Please try again.')
  }

  function printInvoice(b: Booking) {
    const w = window.open('', '_blank')!
    w.document.write(`
      <html><head><title>Invoice ${b.reference}</title>
      <style>body{font-family:sans-serif;max-width:700px;margin:40px auto;color:#1e293b}
      h1{color:#2563eb}table{width:100%;border-collapse:collapse;margin:20px 0}
      td,th{padding:10px 12px;border:1px solid #e2e8f0;text-align:left}
      th{background:#f8fafc;font-weight:600}.total{font-size:1.2em;font-weight:700;color:#2563eb}
      </style></head><body>
      <h1>Invoice</h1>
      <p><strong>Reference:</strong> ${b.reference}</p>
      <p><strong>Date:</strong> ${new Date(b.createdAt).toLocaleDateString('en-GB', { day:'numeric',month:'long',year:'numeric' })}</p>
      <p><strong>Customer:</strong> ${b.customerName}</p>
      <table><thead><tr><th>Service</th><th>Route</th><th>Date</th><th>Passengers</th><th>Vehicle</th><th>Amount</th></tr></thead>
      <tbody><tr>
        <td>${b.serviceType}</td>
        <td>${b.pickupLocation} → ${b.dropoffLocation}</td>
        <td>${b.travelDate}</td>
        <td>${b.passengers}</td>
        <td>${b.vehicleType}</td>
        <td>£${b.totalAmount.toFixed(2)}</td>
      </tr></tbody></table>
      <p class="total">Total: £${b.totalAmount.toFixed(2)}</p>
      <p style="color:#64748b;font-size:0.85em;margin-top:40px">Umrah Transport · info@umrahtransport.me · umrahtransport.me</p>
      <script>window.print()</script>
      </body></html>`)
    w.document.close()
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-section-alt flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  const user = session!.user!
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile',  label: 'Profile',   icon: User },
    { id: 'passport', label: 'Passport',  icon: BookOpen },
    { id: 'bookings', label: 'Bookings',  icon: CalendarDays },
    { id: 'invoices', label: 'Invoices',  icon: FileText },
    { id: 'payment',  label: 'Payment',   icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-section-alt pt-16">
      <div className="container-custom py-10 max-w-4xl">

        {/* Profile header */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 mb-6 flex items-center gap-5">
          {user.image ? (
            <Image src={user.image} alt={user.name || 'User'} width={64} height={64}
              className="rounded-full ring-2 ring-brand-100 flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl flex-shrink-0">
              {(user.name || 'U')[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 truncate">{user.name}</h1>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
            <p className="text-xs text-brand-600 mt-0.5 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Verified Google account
            </p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 flex-shrink-0">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-slate-100 shadow-card p-1.5 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 min-w-fit flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                tab === t.id ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50'}`}>
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* ── Profile tab ── */}
        {tab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Personal Information</h2>
            <p className="text-sm text-slate-500 mb-6">Pre-filled during checkout for a faster booking experience.</p>
            <div className="space-y-5">
              <Field label="Full Name (from Google)">
                <input type="text" value={user.name || ''} disabled
                  className="input-field bg-slate-50 text-slate-500 cursor-not-allowed" />
              </Field>
              <Field label="Email Address (from Google)">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={user.email || ''} disabled
                    className="input-field pl-9 bg-slate-50 text-slate-500 cursor-not-allowed" />
                </div>
              </Field>
              <Field label="WhatsApp / Phone Number">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" value={profile.phone || ''}
                    onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+44 7700 000000" className="input-field pl-9" />
                </div>
              </Field>
              <Field label="Nationality / Country">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select value={profile.nationality || ''}
                    onChange={(e) => setProfile(p => ({ ...p, nationality: e.target.value }))}
                    className="input-field pl-9">
                    <option value="">Select country...</option>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </Field>
              <Field label="Date of Birth">
                <input type="date" value={profile.dateOfBirth || ''}
                  onChange={(e) => setProfile(p => ({ ...p, dateOfBirth: e.target.value }))}
                  className="input-field" />
              </Field>
              <button onClick={saveProfile} disabled={saving} className="btn-primary py-3 px-6">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  : saved === 'profile' ? <><CheckCircle className="w-4 h-4" /> Saved!</>
                  : <><Save className="w-4 h-4" /> Save Profile</>}
              </button>
            </div>
          </div>
        )}

        {/* ── Passport tab ── */}
        {tab === 'passport' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Passport Details</h2>
            <p className="text-sm text-slate-500 mb-2">Stored securely. Used to auto-fill Umrah permit and booking forms.</p>
            <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Your passport data is encrypted and stored securely. We never share it with third parties.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name (as on passport)">
                <input type="text" value={passport.fullName || ''}
                  onChange={e => setPassport(p => ({ ...p, fullName: e.target.value }))}
                  placeholder="e.g. Mohammed Ahmed" className="input-field" />
              </Field>
              <Field label="Passport Number">
                <input type="text" value={passport.passportNumber || ''}
                  onChange={e => setPassport(p => ({ ...p, passportNumber: e.target.value }))}
                  placeholder="e.g. 123456789" className="input-field font-mono" />
              </Field>
              <Field label="Nationality">
                <select value={passport.nationality || ''}
                  onChange={e => setPassport(p => ({ ...p, nationality: e.target.value }))}
                  className="input-field">
                  <option value="">Select…</option>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Date of Birth">
                <input type="date" value={passport.dateOfBirth || ''}
                  onChange={e => setPassport(p => ({ ...p, dateOfBirth: e.target.value }))}
                  className="input-field" />
              </Field>
              <Field label="Issue Date">
                <input type="date" value={passport.issueDate || ''}
                  onChange={e => setPassport(p => ({ ...p, issueDate: e.target.value }))}
                  className="input-field" />
              </Field>
              <Field label="Expiry Date">
                <input type="date" value={passport.expiryDate || ''}
                  onChange={e => setPassport(p => ({ ...p, expiryDate: e.target.value }))}
                  className="input-field" />
              </Field>
            </div>
            <button onClick={savePassport} disabled={saving} className="btn-primary py-3 px-6 mt-6">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : saved === 'passport' ? <><CheckCircle className="w-4 h-4" /> Saved!</>
                : <><Save className="w-4 h-4" /> Save Passport Details</>}
            </button>
          </div>
        )}

        {/* ── Bookings tab ── */}
        {tab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">My Bookings</h2>
            <p className="text-sm text-slate-500 mb-6">All bookings made with this email address.</p>
            {loadingBookings ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-600 mb-1">No bookings yet</h3>
                <p className="text-sm text-slate-400 mb-5">Your bookings will appear here once confirmed.</p>
                <a href="/book" className="btn-primary text-sm">Browse Services</a>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b.id} className="border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-mono text-sm font-bold text-brand-700">{b.reference}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {new Date(b.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[b.status] ?? STATUS_STYLES.pending}`}>
                        {b.status === 'completed' ? <CheckCircle className="w-3 h-3" />
                          : b.status === 'cancelled' ? <XCircle className="w-3 h-3" />
                          : <Clock className="w-3 h-3" />}
                        {b.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-800 mb-1">{b.serviceType}</div>
                    <div className="text-xs text-slate-500 mb-2">{b.pickupLocation} → {b.dropoffLocation}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{b.travelDate} · {b.passengers} pax · {b.vehicleType}</span>
                      <span className="font-bold text-slate-900">{formatPrice(b.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Invoices tab ── */}
        {tab === 'invoices' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Invoices</h2>
            <p className="text-sm text-slate-500 mb-6">Download or print invoices for your completed bookings.</p>
            {loadingBookings ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-600 mb-1">No invoices yet</h3>
                <p className="text-sm text-slate-400">Invoices appear here after you make a booking.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <div className="font-mono text-sm font-bold text-slate-800">{b.reference}</div>
                        <div className="text-xs text-slate-400">{b.serviceType} · {new Date(b.createdAt).toLocaleDateString('en-GB')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">{formatPrice(b.totalAmount)}</span>
                      <button onClick={() => printInvoice(b)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-semibold rounded-lg transition-colors">
                        <Download className="w-3.5 h-3.5" /> Print / PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Payment tab ── */}
        {tab === 'payment' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Payment Methods</h2>
            <p className="text-sm text-slate-500 mb-6">Your card details are securely managed by Stripe.</p>
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-6 flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-800 mb-1">Secured by Stripe</p>
                <p className="text-sm text-brand-700">We never store raw card numbers. All payments are processed through Stripe — PCI-DSS Level 1 certified.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {['Visa', 'Mastercard', 'Amex', 'Discover'].map(c => (
                <div key={c} className="border border-slate-100 rounded-xl py-3 px-2 text-center text-sm font-semibold text-slate-600 bg-slate-50">{c}</div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl text-sm text-slate-600">
              <p className="font-medium text-slate-700 mb-2">How payments work</p>
              <ul className="space-y-1.5 text-slate-500">
                {['Card details entered directly on Stripe\'s secure page',
                  'Payment captured only after booking confirmation',
                  'Full refund if we can\'t fulfil your booking'].map(t => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-sm">
              <p className="font-medium text-slate-700 mb-1">Accepted currencies</p>
              <p className="text-slate-500">GBP · USD · CAD · AUD · SAR · EUR</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
