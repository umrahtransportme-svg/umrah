'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import {
  User, CalendarDays, CreditCard, LogOut, Phone, Globe, Mail,
  Save, CheckCircle, Package, Clock, XCircle, Loader2, ShieldCheck,
  FileText, BookOpen, Download, AlertCircle, Camera, Copy, Share2,
  Gift, MessageSquare, Plus, Trash2, Star, CheckCircle2,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { COUNTRIES } from '@/lib/countries'

type Tab = 'profile' | 'passport' | 'bookings' | 'invoices' | 'cards' | 'referrals' | 'complaints'

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
}

const COMPLAINT_STATUS: Record<string, string> = {
  open:        'bg-amber-50 text-amber-700',
  in_progress: 'bg-blue-50 text-blue-700',
  resolved:    'bg-green-50 text-green-700',
  closed:      'bg-slate-100 text-slate-600',
}

interface Booking { id: string; reference: string; status: string; serviceType: string; pickupLocation: string; dropoffLocation: string; travelDate: string; passengers: number; vehicleType: string; totalAmount: number; customerName: string; createdAt: string }
interface Profile { name?: string; phone?: string; nationality?: string; city?: string; dateOfBirth?: string; profilePicture?: string }
interface Passport { fullName?: string; passportNumber?: string; nationality?: string; dateOfBirth?: string; issueDate?: string; expiryDate?: string }
interface SavedCard { id: string; last4: string; brand: string; expMonth: number; expYear: number; cardholderName: string | null; isDefault: boolean }
interface Referral { id: string; referredEmail: string | null; status: string; commission: number; createdAt: string }
interface ReferralData { code: string; shareUrl: string; totalEarned: number; pending: number; count: number; referrals: Referral[] }
interface Complaint { id: string; category: string; subject: string; message: string; status: string; priority: string; bookingRef: string | null; response: string | null; createdAt: string }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>{children}</div>
}

const CARD_BRANDS = ['Visa', 'Mastercard', 'Amex', 'Discover']
const COMPLAINT_CATEGORIES = ['Service Quality', 'Driver Behaviour', 'Payment Issue', 'Booking Issue', 'Vehicle Condition', 'Refund Request', 'Other']

function CardIcon({ brand }: { brand: string }) {
  const colors: Record<string, string> = { Visa: 'bg-blue-700', Mastercard: 'bg-red-600', Amex: 'bg-green-700', Discover: 'bg-orange-500' }
  return <span className={cn('inline-flex items-center justify-center px-2 py-0.5 rounded text-white text-xs font-bold', colors[brand] || 'bg-slate-600')}>{brand}</span>
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('profile')
  const picRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<Profile>({})
  const [passport, setPassport] = useState<Passport>({})
  const [bookings, setBookings] = useState<Booking[]>([])
  const [cards, setCards] = useState<SavedCard[]>([])
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')
  const [error, setError] = useState('')
  const [loadingBookings, setLoadingBookings] = useState(false)

  // New card form
  const [addingCard, setAddingCard] = useState(false)
  const [cardForm, setCardForm] = useState({ last4: '', brand: 'Visa', expMonth: '', expYear: '', cardholderName: '', isDefault: false })
  const [cardError, setCardError] = useState('')

  // New complaint form
  const [addingComplaint, setAddingComplaint] = useState(false)
  const [complaintForm, setComplaintForm] = useState({ bookingRef: '', category: 'Service Quality', subject: '', message: '', priority: 'normal' })
  const [complaintError, setComplaintError] = useState('')

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/auth/signin?callbackUrl=/account')
  }, [status, router])

  useEffect(() => {
    if (!session?.user?.email) return
    fetch('/api/account/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
    fetch('/api/account/passport').then(r => r.ok ? r.json() : null).then(d => { if (d) setPassport(d) })
  }, [session])

  useEffect(() => {
    if (!session?.user?.email) return
    if (tab === 'bookings' || tab === 'invoices') {
      setLoadingBookings(true)
      fetch('/api/account/bookings').then(r => r.ok ? r.json() : []).then(d => { setBookings(d); setLoadingBookings(false) })
    }
    if (tab === 'cards') fetch('/api/account/cards').then(r => r.ok ? r.json() : []).then(setCards)
    if (tab === 'referrals') fetch('/api/account/referral').then(r => r.ok ? r.json() : null).then(setReferralData)
    if (tab === 'complaints') fetch('/api/account/complaints').then(r => r.ok ? r.json() : []).then(setComplaints)
  }, [tab, session])

  async function saveProfile() {
    setSaving(true); setError(''); setSaved('')
    const res = await fetch('/api/account/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
    setSaving(false)
    if (res.ok) { setSaved('profile'); setTimeout(() => setSaved(''), 2500) }
    else setError('Failed to save. Please try again.')
  }

  async function savePassport() {
    setSaving(true); setError(''); setSaved('')
    const res = await fetch('/api/account/passport', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(passport) })
    setSaving(false)
    if (res.ok) { setSaved('passport'); setTimeout(() => setSaved(''), 2500) }
    else setError('Failed to save. Please try again.')
  }

  function handlePicFile(file: File) {
    if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2MB'); return }
    const reader = new FileReader()
    reader.onload = async (e) => {
      const pic = e.target?.result as string
      setProfile(p => ({ ...p, profilePicture: pic }))
      await fetch('/api/account/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...profile, profilePicture: pic }) })
    }
    reader.readAsDataURL(file)
  }

  async function addCard() {
    setCardError('')
    if (!cardForm.last4 || cardForm.last4.length !== 4 || !/^\d{4}$/.test(cardForm.last4)) { setCardError('Enter 4-digit card ending'); return }
    if (!cardForm.expMonth || !cardForm.expYear) { setCardError('Enter expiry date'); return }
    const res = await fetch('/api/account/cards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...cardForm, expMonth: Number(cardForm.expMonth), expYear: Number(cardForm.expYear) }) })
    if (!res.ok) { const d = await res.json(); setCardError(d.error || 'Failed'); return }
    const updated = await fetch('/api/account/cards').then(r => r.json())
    setCards(updated); setAddingCard(false); setCardForm({ last4: '', brand: 'Visa', expMonth: '', expYear: '', cardholderName: '', isDefault: false })
  }

  async function removeCard(id: string) {
    const remaining = cards.filter(c => c.id !== id)
    const wasDefault = cards.find(c => c.id === id)?.isDefault
    await fetch('/api/account/cards', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, makeDefaultId: wasDefault && remaining[0]?.id }) })
    setCards(remaining)
    if (wasDefault && remaining[0]) setCards(c => c.map(x => ({ ...x, isDefault: x.id === remaining[0].id })))
  }

  async function setDefault(id: string) {
    await fetch('/api/account/cards', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setCards(c => c.map(x => ({ ...x, isDefault: x.id === id })))
  }

  function copyCode() {
    if (referralData?.code) { navigator.clipboard.writeText(referralData.code); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  async function submitComplaint() {
    setComplaintError('')
    if (!complaintForm.subject.trim() || !complaintForm.message.trim()) { setComplaintError('Subject and message are required'); return }
    const res = await fetch('/api/account/complaints', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(complaintForm) })
    if (!res.ok) { const d = await res.json(); setComplaintError(d.error || 'Failed'); return }
    const updated = await fetch('/api/account/complaints').then(r => r.json())
    setComplaints(updated); setAddingComplaint(false); setComplaintForm({ bookingRef: '', category: 'Service Quality', subject: '', message: '', priority: 'normal' })
  }

  function printInvoice(b: Booking) {
    const w = window.open('', '_blank')!
    w.document.write(`<html><head><title>Invoice ${b.reference}</title><style>body{font-family:sans-serif;max-width:700px;margin:40px auto;color:#1e293b}h1{color:#2563eb}table{width:100%;border-collapse:collapse;margin:20px 0}td,th{padding:10px 12px;border:1px solid #e2e8f0;text-align:left}th{background:#f8fafc;font-weight:600}.total{font-size:1.2em;font-weight:700;color:#2563eb}</style></head><body><h1>Invoice</h1><p><strong>Reference:</strong> ${b.reference}</p><p><strong>Date:</strong> ${new Date(b.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p><p><strong>Customer:</strong> ${b.customerName}</p><table><thead><tr><th>Service</th><th>Route</th><th>Date</th><th>Pax</th><th>Vehicle</th><th>Amount</th></tr></thead><tbody><tr><td>${b.serviceType}</td><td>${b.pickupLocation} → ${b.dropoffLocation}</td><td>${b.travelDate}</td><td>${b.passengers}</td><td>${b.vehicleType}</td><td>£${b.totalAmount.toFixed(2)}</td></tr></tbody></table><p class="total">Total: £${b.totalAmount.toFixed(2)}</p><p style="color:#64748b;font-size:0.85em;margin-top:40px">Umrah Transport · umrahtransport.me</p><script>window.print()</script></body></html>`)
    w.document.close()
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="min-h-screen bg-section-alt flex items-center justify-center pt-16"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>
  }

  const user = session!.user!
  const displayPic = profile.profilePicture || user.image

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile',    label: 'Profile',    icon: User },
    { id: 'passport',   label: 'Passport',   icon: BookOpen },
    { id: 'bookings',   label: 'Bookings',   icon: CalendarDays },
    { id: 'invoices',   label: 'Invoices',   icon: FileText },
    { id: 'cards',      label: 'Cards',      icon: CreditCard },
    { id: 'referrals',  label: 'Referrals',  icon: Gift },
    { id: 'complaints', label: 'Support',    icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-section-alt pt-16">
      <div className="container-custom py-10 max-w-4xl">

        {/* Profile header */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 mb-6 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {displayPic ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayPic} alt={user.name || 'User'} className="w-16 h-16 rounded-full ring-2 ring-brand-100 object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl">
                {(user.name || 'U')[0]}
              </div>
            )}
            <button onClick={() => picRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center text-white hover:bg-brand-700 transition-colors shadow-sm">
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input ref={picRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handlePicFile(f); e.target.value = '' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 truncate">{user.name}</h1>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
            <p className="text-xs text-brand-600 mt-0.5 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified Google account</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 flex-shrink-0">
            <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-slate-100 shadow-card p-1.5 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn('flex-1 min-w-fit flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap',
                tab === t.id ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50')}>
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

        {/* ── Profile ── */}
        {tab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Personal Information</h2>
            <p className="text-sm text-slate-500 mb-6">Pre-filled during checkout for a faster booking experience.</p>
            <div className="space-y-5">
              <Field label="Full Name (from Google)"><input type="text" value={user.name || ''} disabled className="input-field bg-slate-50 text-slate-500 cursor-not-allowed" /></Field>
              <Field label="Email Address (from Google)">
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="email" value={user.email || ''} disabled className="input-field pl-9 bg-slate-50 text-slate-500 cursor-not-allowed" /></div>
              </Field>
              <Field label="WhatsApp / Phone Number">
                <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="tel" value={profile.phone || ''} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+44 7456 938750" className="input-field pl-9" /></div>
              </Field>
              <Field label="Nationality / Country">
                <div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><select value={profile.nationality || ''} onChange={e => setProfile(p => ({ ...p, nationality: e.target.value }))} className="input-field pl-9"><option value="">Select country...</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select></div>
              </Field>
              <Field label="City"><input type="text" value={profile.city || ''} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="e.g. London" className="input-field" /></Field>
              <Field label="Date of Birth"><input type="date" value={profile.dateOfBirth || ''} onChange={e => setProfile(p => ({ ...p, dateOfBirth: e.target.value }))} className="input-field" /></Field>
              <button onClick={saveProfile} disabled={saving} className="btn-primary py-3 px-6">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : saved === 'profile' ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
              </button>
            </div>
          </div>
        )}

        {/* ── Passport ── */}
        {tab === 'passport' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Passport Details</h2>
            <p className="text-sm text-slate-500 mb-2">Stored securely. Used to auto-fill Umrah permit and booking forms.</p>
            <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 flex items-start gap-2"><ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" /> Your passport data is encrypted and never shared with third parties.</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name (as on passport)"><input type="text" value={passport.fullName || ''} onChange={e => setPassport(p => ({ ...p, fullName: e.target.value }))} placeholder="Mohammed Ahmed" className="input-field" /></Field>
              <Field label="Passport Number"><input type="text" value={passport.passportNumber || ''} onChange={e => setPassport(p => ({ ...p, passportNumber: e.target.value }))} placeholder="123456789" className="input-field font-mono" /></Field>
              <Field label="Nationality"><select value={passport.nationality || ''} onChange={e => setPassport(p => ({ ...p, nationality: e.target.value }))} className="input-field"><option value="">Select…</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Date of Birth"><input type="date" value={passport.dateOfBirth || ''} onChange={e => setPassport(p => ({ ...p, dateOfBirth: e.target.value }))} className="input-field" /></Field>
              <Field label="Issue Date"><input type="date" value={passport.issueDate || ''} onChange={e => setPassport(p => ({ ...p, issueDate: e.target.value }))} className="input-field" /></Field>
              <Field label="Expiry Date"><input type="date" value={passport.expiryDate || ''} onChange={e => setPassport(p => ({ ...p, expiryDate: e.target.value }))} className="input-field" /></Field>
            </div>
            <button onClick={savePassport} disabled={saving} className="btn-primary py-3 px-6 mt-6">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : saved === 'passport' ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Passport Details</>}
            </button>
          </div>
        )}

        {/* ── Bookings ── */}
        {tab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">My Bookings</h2>
            <p className="text-sm text-slate-500 mb-6">All bookings made with this account.</p>
            {loadingBookings ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>
              : bookings.length === 0 ? (
                <div className="text-center py-16"><Package className="w-12 h-12 text-slate-200 mx-auto mb-4" /><h3 className="font-semibold text-slate-600 mb-1">No bookings yet</h3><a href="/book" className="btn-primary text-sm mt-4 inline-block">Browse Services</a></div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(b => (
                    <div key={b.id} className="border border-slate-100 rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div><div className="font-mono text-sm font-bold text-brand-700">{b.reference}</div><div className="text-xs text-slate-400 mt-0.5">{new Date(b.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div></div>
                        <span className={cn('flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize', STATUS_STYLES[b.status] ?? STATUS_STYLES.pending)}>
                          {b.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : b.status === 'cancelled' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{b.status}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-slate-800 mb-1">{b.serviceType}</div>
                      <div className="text-xs text-slate-500 mb-2">{b.pickupLocation} → {b.dropoffLocation}</div>
                      <div className="flex items-center justify-between"><span className="text-xs text-slate-400">{b.travelDate} · {b.passengers} pax · {b.vehicleType}</span><span className="font-bold text-slate-900">{formatPrice(b.totalAmount)}</span></div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* ── Invoices ── */}
        {tab === 'invoices' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Invoices</h2>
            <p className="text-sm text-slate-500 mb-6">Download or print invoices for your bookings.</p>
            {loadingBookings ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>
              : bookings.length === 0 ? (
                <div className="text-center py-16"><FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" /><h3 className="font-semibold text-slate-600">No invoices yet</h3></div>
              ) : (
                <div className="space-y-3">
                  {bookings.map(b => (
                    <div key={b.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3"><div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-brand-600" /></div><div><div className="font-mono text-sm font-bold text-slate-800">{b.reference}</div><div className="text-xs text-slate-400">{b.serviceType} · {new Date(b.createdAt).toLocaleDateString('en-GB')}</div></div></div>
                      <div className="flex items-center gap-3"><span className="font-bold text-slate-900">{formatPrice(b.totalAmount)}</span><button onClick={() => printInvoice(b)} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-semibold rounded-lg"><Download className="w-3.5 h-3.5" /> PDF</button></div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* ── Saved Cards ── */}
        {tab === 'cards' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Saved Payment Cards</h2>
              <p className="text-sm text-slate-500">Save card details for fast checkout. Card data is handled securely via Stripe.</p>
            </div>

            <div className="p-4 bg-brand-50 border border-brand-100 rounded-2xl flex items-start gap-3 text-sm">
              <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <p className="text-brand-700">We store only the last 4 digits and expiry for display. Full card processing is handled by Stripe (PCI-DSS Level 1).</p>
            </div>

            {cards.length > 0 && (
              <div className="space-y-3">
                {cards.map(card => (
                  <div key={card.id} className={cn('flex items-center gap-4 p-4 rounded-2xl border transition-colors', card.isDefault ? 'border-brand-200 bg-brand-50' : 'border-slate-100 bg-slate-50')}>
                    <CardIcon brand={card.brand} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">•••• •••• •••• {card.last4}</p>
                      <p className="text-xs text-slate-500">{card.cardholderName || 'Cardholder'} · Exp {String(card.expMonth).padStart(2, '0')}/{card.expYear}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {card.isDefault ? (
                        <span className="flex items-center gap-1 text-xs text-brand-700 font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Default</span>
                      ) : (
                        <button onClick={() => setDefault(card.id)} className="text-xs text-slate-500 hover:text-brand-600 transition-colors">Set default</button>
                      )}
                      <button onClick={() => removeCard(card.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {addingCard ? (
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm">Add New Card</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Card Brand">
                    <div className="flex gap-2 flex-wrap">
                      {CARD_BRANDS.map(b => (
                        <button key={b} type="button" onClick={() => setCardForm(f => ({ ...f, brand: b }))}
                          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors', cardForm.brand === b ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300')}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Last 4 Digits *"><input type="text" maxLength={4} value={cardForm.last4} onChange={e => setCardForm(f => ({ ...f, last4: e.target.value.replace(/\D/g, '') }))} placeholder="1234" className="input-field font-mono" /></Field>
                  <Field label="Expiry Month"><input type="number" min={1} max={12} value={cardForm.expMonth} onChange={e => setCardForm(f => ({ ...f, expMonth: e.target.value }))} placeholder="MM" className="input-field" /></Field>
                  <Field label="Expiry Year"><input type="number" min={new Date().getFullYear()} max={2040} value={cardForm.expYear} onChange={e => setCardForm(f => ({ ...f, expYear: e.target.value }))} placeholder="YYYY" className="input-field" /></Field>
                  <div className="col-span-2"><Field label="Cardholder Name"><input type="text" value={cardForm.cardholderName} onChange={e => setCardForm(f => ({ ...f, cardholderName: e.target.value }))} placeholder="John Smith" className="input-field" /></Field></div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="default" checked={cardForm.isDefault} onChange={e => setCardForm(f => ({ ...f, isDefault: e.target.checked }))} className="rounded" />
                    <label htmlFor="default" className="text-sm text-slate-700">Set as default card</label>
                  </div>
                </div>
                {cardError && <p className="text-xs text-red-600">{cardError}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setAddingCard(false)} className="px-4 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
                  <button onClick={addCard} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-xl"><Save className="w-3.5 h-3.5" /> Save Card</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingCard(true)} className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-200 rounded-2xl text-sm text-slate-500 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-colors w-full justify-center">
                <Plus className="w-4 h-4" /> Add New Card
              </button>
            )}
          </div>
        )}

        {/* ── Referrals ── */}
        {tab === 'referrals' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Referral Programme</h2>
              <p className="text-sm text-slate-500">Share your code and earn £10 commission for every successful booking made through your link.</p>
            </div>

            {referralData ? (
              <>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total Referrals', value: referralData.count },
                    { label: 'Pending (£)', value: `£${referralData.pending.toFixed(2)}`, sub: 'awaiting confirmation' },
                    { label: 'Total Earned (£)', value: `£${referralData.totalEarned.toFixed(2)}`, highlight: true },
                  ].map(s => (
                    <div key={s.label} className={cn('rounded-2xl p-4 text-center', s.highlight ? 'bg-brand-600 text-white' : 'bg-slate-50')}>
                      <div className={cn('text-2xl font-bold', s.highlight ? 'text-white' : 'text-slate-900')}>{s.value}</div>
                      <div className={cn('text-xs mt-0.5', s.highlight ? 'text-brand-200' : 'text-slate-500')}>{s.label}</div>
                      {s.sub && <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>}
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100 rounded-2xl">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Your Referral Code</p>
                  <div className="flex items-center gap-3">
                    <span className="flex-1 text-2xl font-bold text-brand-700 font-mono tracking-widest">{referralData.code}</span>
                    <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-xl transition-colors">
                      {copied ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Share Link</p>
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-xs text-slate-500 font-mono truncate">{referralData.shareUrl}</span>
                    <button onClick={() => { navigator.clipboard.writeText(referralData.shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-brand-50 transition-colors"><Copy className="w-3.5 h-3.5 text-slate-500" /></button>
                    {typeof navigator.share !== 'undefined' && (
                      <button onClick={() => navigator.share({ title: 'Book Umrah Transport', url: referralData.shareUrl })} className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-brand-50 transition-colors"><Share2 className="w-3.5 h-3.5 text-slate-500" /></button>
                    )}
                  </div>
                </div>

                {referralData.referrals.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Recent Referrals</h3>
                    <div className="space-y-2">
                      {referralData.referrals.map(r => (
                        <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div><p className="text-sm font-medium text-slate-800">{r.referredEmail || 'Anonymous'}</p><p className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-GB')}</p></div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">£{r.commission.toFixed(2)}</p>
                            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', r.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700')}>{r.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className="text-sm font-semibold text-slate-900">How it works</span></div>
                  <ul className="space-y-1.5 text-xs text-slate-500">
                    {['Share your unique code or link with friends and family', 'They book using your referral link or enter your code at checkout', 'Once their booking is confirmed, you earn £10 commission', 'Commissions are paid out monthly to your registered bank account'].map(t => (
                      <li key={t} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" />{t}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>}
          </div>
        )}

        {/* ── Complaints / Support ── */}
        {tab === 'complaints' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-lg font-bold text-slate-900 mb-1">Support & Complaints</h2><p className="text-sm text-slate-500">Submit a complaint or support request. We aim to respond within 24 hours.</p></div>
              <button onClick={() => setAddingComplaint(a => !a)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-xl transition-colors">
                <Plus className="w-3.5 h-3.5" /> New Complaint
              </button>
            </div>

            {addingComplaint && (
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm">Submit Complaint / Request</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Category">
                    <select value={complaintForm.category} onChange={e => setComplaintForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                      {COMPLAINT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Priority">
                    <select value={complaintForm.priority} onChange={e => setComplaintForm(f => ({ ...f, priority: e.target.value }))} className="input-field">
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </Field>
                  <Field label="Booking Reference (optional)"><input type="text" value={complaintForm.bookingRef} onChange={e => setComplaintForm(f => ({ ...f, bookingRef: e.target.value }))} placeholder="UMR-2026-XXXX" className="input-field font-mono" /></Field>
                  <div className="col-span-2"><Field label="Subject *"><input type="text" value={complaintForm.subject} onChange={e => setComplaintForm(f => ({ ...f, subject: e.target.value }))} placeholder="Brief description of the issue" className="input-field" /></Field></div>
                  <div className="col-span-2"><Field label="Message *"><textarea value={complaintForm.message} onChange={e => setComplaintForm(f => ({ ...f, message: e.target.value }))} rows={4} placeholder="Please provide as much detail as possible..." className="input-field" /></Field></div>
                </div>
                {complaintError && <p className="text-xs text-red-600">{complaintError}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setAddingComplaint(false)} className="px-4 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
                  <button onClick={submitComplaint} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-xl"><Save className="w-3.5 h-3.5" /> Submit</button>
                </div>
              </div>
            )}

            {complaints.length === 0 && !addingComplaint ? (
              <div className="text-center py-16"><MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" /><h3 className="font-semibold text-slate-600 mb-1">No complaints or requests</h3><p className="text-xs text-slate-400">Use the button above to submit a support request.</p></div>
            ) : (
              <div className="space-y-3">
                {complaints.map(c => (
                  <div key={c.id} className="border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{c.subject}</h4>
                        <p className="text-xs text-slate-400">{c.category}{c.bookingRef ? ` · ${c.bookingRef}` : ''} · {new Date(c.createdAt).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {c.priority === 'urgent' && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">Urgent</span>}
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', COMPLAINT_STATUS[c.status] || COMPLAINT_STATUS.open)}>{c.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{c.message}</p>
                    {c.response && (
                      <div className="mt-3 p-3 bg-brand-50 border border-brand-100 rounded-xl">
                        <p className="text-xs font-semibold text-brand-700 mb-1">Response from Support</p>
                        <p className="text-xs text-brand-800">{c.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
