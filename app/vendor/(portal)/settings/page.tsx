'use client'

import { useEffect, useState } from 'react'
import { Save, Building2, CreditCard } from 'lucide-react'

type Vendor = { companyName: string; contactName: string; email: string; phone: string; city: string; country: string; payoutMethod: string; payoutDetails: Record<string, string> }

const PAYOUT_FIELDS: Record<string, { key: string; label: string; placeholder: string }[]> = {
  bank:     [{ key: 'bankName', label: 'Bank Name', placeholder: 'HSBC' }, { key: 'accountName', label: 'Account Name', placeholder: 'Your Name' }, { key: 'accountNumber', label: 'Account Number', placeholder: '12345678' }, { key: 'sortCode', label: 'Sort Code / IBAN', placeholder: '00-00-00' }],
  paypal:   [{ key: 'paypalEmail', label: 'PayPal Email', placeholder: 'you@paypal.com' }],
  wise:     [{ key: 'wiseEmail', label: 'Wise Email', placeholder: 'you@wise.com' }, { key: 'wiseAccountId', label: 'Wise Account ID', placeholder: 'optional' }],
  payoneer: [{ key: 'payoneerEmail', label: 'Payoneer Email', placeholder: 'you@email.com' }],
}

export default function VendorSettingsPage() {
  const [form, setForm] = useState<Vendor | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/vendor/me').then((r) => r.json()).then((v) => setForm({ ...v, payoutDetails: v.payoutDetails || {} }))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    await fetch('/api/vendor/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!form) return <div className="text-sm text-slate-500">Loading...</div>

  const payoutFields = PAYOUT_FIELDS[form.payoutMethod] || PAYOUT_FIELDS.bank

  function F({ label, children }: { label: string; children: React.ReactNode }) {
    return <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>{children}</div>
  }

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent'

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900 text-sm">Company Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <F label="Company Name"><input type="text" value={form.companyName} onChange={(e) => setForm((f) => f && ({ ...f, companyName: e.target.value }))} className={inputCls} /></F>
            <F label="Contact Name"><input type="text" value={form.contactName} onChange={(e) => setForm((f) => f && ({ ...f, contactName: e.target.value }))} className={inputCls} /></F>
            <F label="Phone"><input type="tel" value={form.phone || ''} onChange={(e) => setForm((f) => f && ({ ...f, phone: e.target.value }))} className={inputCls} placeholder="+966 50 000 0000" /></F>
            <F label="City"><input type="text" value={form.city || ''} onChange={(e) => setForm((f) => f && ({ ...f, city: e.target.value }))} className={inputCls} /></F>
            <F label="Country"><input type="text" value={form.country || ''} onChange={(e) => setForm((f) => f && ({ ...f, country: e.target.value }))} className={inputCls} /></F>
            <F label="Email (read-only)"><input type="email" value={form.email} readOnly className={inputCls + ' bg-slate-50 text-slate-400'} /></F>
          </div>
        </div>

        {/* Payout method */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900 text-sm">Payout Details</h2>
          </div>
          <F label="Payout Method">
            <select value={form.payoutMethod} onChange={(e) => setForm((f) => f && ({ ...f, payoutMethod: e.target.value, payoutDetails: {} }))} className={inputCls}>
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
              <option value="wise">Wise</option>
              <option value="payoneer">Payoneer</option>
            </select>
          </F>
          {payoutFields.map((field) => (
            <F key={field.key} label={field.label}>
              <input type="text" value={form.payoutDetails?.[field.key] || ''} placeholder={field.placeholder}
                onChange={(e) => setForm((f) => f && ({ ...f, payoutDetails: { ...f.payoutDetails, [field.key]: e.target.value } }))}
                className={inputCls} />
            </F>
          ))}
        </div>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-60">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
