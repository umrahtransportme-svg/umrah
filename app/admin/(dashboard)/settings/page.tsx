'use client'

import { useState, useEffect } from 'react'
import { Save, Globe, Phone, Mail, Bell, Shield, Palette, Key, CheckCircle2, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { useAdminStore } from '@/lib/admin/store'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'general',       label: 'General',       icon: Globe },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'security',      label: 'Security',       icon: Shield },
  { id: 'branding',      label: 'Branding',       icon: Palette },
  { id: 'stripe',        label: 'Stripe',         icon: Key },
  { id: 'whatsapp',      label: 'WhatsApp API',   icon: Phone },
]

// Keys that are public and stored in the database
const PUBLIC_KEYS = ['businessName', 'legalName', 'domain', 'founded', 'whatsappNumber', 'email', 'address', 'primaryColor', 'googleAnalyticsId']

function SaveBanner({ show, error }: { show: boolean; error: string }) {
  if (error) {
    return (
      <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl shadow-lg max-w-sm">
        ✕ {error}
      </div>
    )
  }
  return (
    <div className={cn(
      'fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl shadow-lg transition-all duration-300',
      show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none',
    )}>
      <CheckCircle2 className="w-4 h-4" /> Settings saved to database
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="label">{label}</label>{children}</div>
}

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminStore()
  const [tab, setTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [showWebhook, setShowWebhook] = useState(false)
  const [showWaToken, setShowWaToken] = useState(false)
  const [form, setForm] = useState(settings)

  // Load public settings from DB on mount
  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.ok ? r.json() : null)
      .then((dbSettings) => {
        if (dbSettings) {
          setForm((f) => ({ ...f, ...dbSettings }))
          updateSettings(dbSettings)
        }
      })
      .catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function switchTab(id: string) { setForm(settings); setTab(id) }

  function set(key: keyof typeof form, value: string | boolean | Record<string, boolean>) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function save() {
    setSaveError('')
    updateSettings(form)

    const publicSettings: Record<string, string> = {}
    for (const key of PUBLIC_KEYS) {
      const val = (form as unknown as Record<string, unknown>)[key]
      if (val !== undefined) publicSettings[key] = String(val)
    }

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publicSettings),
      })
      if (!res.ok) {
        const text = await res.text()
        setSaveError(`Save failed (${res.status}): ${text}`)
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setSaveError(`Network error: ${e instanceof Error ? e.message : 'unknown'}`)
    }
  }

  const SaveBtn = ({ label = 'Save Changes' }: { label?: string }) => (
    <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors">
      <Save className="w-4 h-4" />{saved ? 'Saved!' : label}
    </button>
  )

  const MaskedInput = ({ value, onChange, show, onToggle, placeholder }: {
    value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder?: string
  }) => (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '••••••••••••••••••••••••'} className="input text-sm pr-10 font-mono" />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )

  return (
    <div className="max-w-3xl space-y-4">
      <SaveBanner show={saved} error={saveError} />

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit flex-wrap">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => switchTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-900">Business Information</h2>
          <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl text-xs text-brand-700">
            Changes here are saved to the database and instantly reflected on the public website.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Business Name">
              <input type="text" value={form.businessName} onChange={(e) => set('businessName', e.target.value)} className="input text-sm" />
            </Field>
            <Field label="Legal Name">
              <input type="text" value={form.legalName} onChange={(e) => set('legalName', e.target.value)} className="input text-sm" />
            </Field>
            <Field label="Domain">
              <input type="text" value={form.domain} onChange={(e) => set('domain', e.target.value)} className="input text-sm" />
            </Field>
            <Field label="Founded">
              <input type="text" value={form.founded} onChange={(e) => set('founded', e.target.value)} className="input text-sm" />
            </Field>
          </div>
          <div className="border-t border-slate-100 pt-5">
            <h3 className="font-semibold text-slate-900 mb-4">Contact Details</h3>
            <div className="space-y-3">
              <Field label="WhatsApp Display Number">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} className="input pl-9 text-sm" placeholder="+44 7456 938750" />
                </div>
              </Field>
              <Field label="Email Address">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input pl-9 text-sm" />
                </div>
              </Field>
              <Field label="Business Address">
                <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} className="input text-sm" />
              </Field>
              <Field label="Google Analytics ID (G-XXXXXXXXXX)">
                <input type="text" value={form.googleAnalyticsId} onChange={(e) => set('googleAnalyticsId', e.target.value)} className="input text-sm font-mono" placeholder="G-XXXXXXXXXX" />
              </Field>
            </div>
          </div>
          <SaveBtn />
        </div>
      )}

      {tab === 'notifications' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-900">Notification Preferences</h2>
          <div className="space-y-3">
            {[
              { key: 'new_booking',       label: 'New booking received', sub: 'Email + WhatsApp notification' },
              { key: 'booking_cancelled', label: 'Booking cancelled',    sub: 'Email notification' },
              { key: 'payment_received',  label: 'Payment received',     sub: 'Email notification' },
              { key: 'new_review',        label: 'New review posted',    sub: 'Email notification' },
              { key: 'driver_unassigned', label: 'Driver unassigned',    sub: 'WhatsApp alert' },
              { key: 'weekly_reports',    label: 'Weekly reports',       sub: 'Every Monday morning' },
            ].map((n) => (
              <label key={n.key} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-slate-900">{n.label}</div>
                  <div className="text-xs text-slate-500">{n.sub}</div>
                </div>
                <input type="checkbox" checked={!!form.notifications?.[n.key]} onChange={(e) => set('notifications', { ...form.notifications, [n.key]: e.target.checked })} className="w-4 h-4 accent-brand-600" />
              </label>
            ))}
          </div>
          <SaveBtn label="Save Preferences" />
        </div>
      )}

      {tab === 'security' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-900">Security Settings</h2>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
            Admin credentials are configured via environment variables (<code className="font-mono text-xs">ADMIN_EMAIL</code> and <code className="font-mono text-xs">ADMIN_PASSWORD</code>) in your Vercel dashboard or <code className="font-mono text-xs">.env.local</code> file.
          </div>
          <div className="space-y-4">
            <Field label="Admin Email">
              <input type="email" defaultValue={settings.email} readOnly className="input text-sm bg-slate-50 cursor-not-allowed" />
            </Field>
            <div className="text-sm text-slate-500">To change the admin password, update the <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">ADMIN_PASSWORD</code> environment variable and redeploy.</div>
          </div>
          <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            <ExternalLink className="w-4 h-4" /> Open Vercel Dashboard
          </a>
        </div>
      )}

      {tab === 'branding' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-900">Branding</h2>
          <div className="space-y-4">
            <Field label="Primary Color">
              <div className="flex items-center gap-3">
                <input type="color" value={form.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                <input type="text" value={form.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} className="input text-sm font-mono w-32" />
              </div>
            </Field>
            <Field label="Logo Upload">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-brand-400 transition-colors cursor-pointer">
                <div className="text-slate-400 text-sm">Click to upload or drag and drop</div>
                <div className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max 2 MB)</div>
              </div>
            </Field>
          </div>
          <SaveBtn />
        </div>
      )}

      {tab === 'stripe' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-900">Stripe Payment Configuration</h2>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
            Keys are stored in your browser&apos;s secure local storage. For server-side operations also set <code className="font-mono text-xs">STRIPE_SECRET_KEY</code> in your Vercel environment variables.
          </div>
          <div className="space-y-4">
            <Field label="Mode">
              <div className="flex gap-2">
                {(['test', 'live'] as const).map((m) => (
                  <button key={m} onClick={() => set('stripeMode', m)}
                    className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors border', form.stripeMode === m ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50')}>
                    {m}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={`Publishable Key (pk_${form.stripeMode}_…)`}>
              <input type="text" value={form.stripePublishableKey} onChange={(e) => set('stripePublishableKey', e.target.value)} className="input text-sm font-mono" placeholder={`pk_${form.stripeMode}_...`} />
            </Field>
            <Field label="Secret Key (sk_…)">
              <MaskedInput value={form.stripeSecretKey} onChange={(v) => set('stripeSecretKey', v)} show={showSecret} onToggle={() => setShowSecret(!showSecret)} placeholder={`sk_${form.stripeMode}_...`} />
            </Field>
            <Field label="Webhook Signing Secret (whsec_…)">
              <MaskedInput value={form.stripeWebhookSecret} onChange={(v) => set('stripeWebhookSecret', v)} show={showWebhook} onToggle={() => setShowWebhook(!showWebhook)} placeholder="whsec_..." />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <SaveBtn label="Save Stripe Keys" />
            <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Stripe Dashboard
            </a>
          </div>
        </div>
      )}

      {tab === 'whatsapp' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-900">WhatsApp Business API</h2>
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-800">
            Connect the WhatsApp Business API to automatically send booking confirmations, driver updates, and reminders.
          </div>
          <div className="space-y-4">
            <Field label="Phone Number ID">
              <input type="text" value={form.whatsappPhoneNumberId} onChange={(e) => set('whatsappPhoneNumberId', e.target.value)} className="input text-sm font-mono" placeholder="1234567890123456" />
            </Field>
            <Field label="WhatsApp Business Account ID">
              <input type="text" value={form.whatsappAccountId} onChange={(e) => set('whatsappAccountId', e.target.value)} className="input text-sm font-mono" placeholder="1234567890123456" />
            </Field>
            <Field label="Access Token">
              <MaskedInput value={form.whatsappApiToken} onChange={(v) => set('whatsappApiToken', v)} show={showWaToken} onToggle={() => setShowWaToken(!showWaToken)} placeholder="EAAxxxxxxxxxx..." />
            </Field>
            <Field label="Display Phone Number (shown to customers)">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} className="input pl-9 text-sm" placeholder="+44 7456 938750" />
              </div>
            </Field>
          </div>
          <SaveBtn label="Save WhatsApp Config" />
        </div>
      )}
    </div>
  )
}
