'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Edit2, Trash2, Building2, Save, CheckCircle2, XCircle, Clock, CreditCard, RefreshCw, ExternalLink, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdminModal from '@/components/admin/ui/Modal'

type VendorAccount = {
  id: string; companyName: string; contactName: string; email: string; phone: string | null;
  city: string | null; country: string; commissionRate: number; status: string;
  payoutMethod: string; payoutSchedule: string; payoutDay: number; createdAt: string;
}

type Payout = {
  id: string; vendorId: string; amount: number; currency: string; status: string;
  method: string; period: string | null; reference: string | null; notes: string | null;
  paidAt: string | null; createdAt: string;
  vendor: { companyName: string; email: string };
}

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  pending:   { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  verified:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  suspended: { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
}

const PAYOUT_STATUS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  paid: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-700',
}

const BLANK = { companyName: '', contactName: '', email: '', phone: '', city: '', country: 'Saudi Arabia', commissionRate: 15, payoutSchedule: 'monthly', payoutDay: 1, status: 'pending', password: '' }

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="label">{label}</label>{children}</div>
}

export default function AdminVendorsPage() {
  const [tab, setTab] = useState<'vendors' | 'payouts'>('vendors')
  const [vendors, setVendors] = useState<VendorAccount[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | 'payout' | null>(null)
  const [selected, setSelected] = useState<VendorAccount | null>(null)
  const [form, setForm] = useState(BLANK)
  const [payoutForm, setPayoutForm] = useState({ vendorId: '', amount: '', currency: 'GBP', method: 'bank', period: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)

  const loadVendors = useCallback(async () => {
    const r = await fetch('/api/admin/vendors')
    if (r.ok) setVendors(await r.json())
  }, [])
  const loadPayouts = useCallback(async () => {
    const r = await fetch('/api/admin/payouts')
    if (r.ok) setPayouts(await r.json())
  }, [])

  useEffect(() => { loadVendors(); loadPayouts() }, [loadVendors, loadPayouts])

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase()
    return !search || v.companyName.toLowerCase().includes(q) || v.contactName.toLowerCase().includes(q) || v.email.toLowerCase().includes(q)
  })

  async function save() {
    setSaving(true)
    setError(null)
    let res: Response
    if (modal === 'add') {
      res = await fetch('/api/admin/vendors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      res = await fetch(`/api/admin/vendors/${selected!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || `Server error ${res.status}`)
      setSaving(false)
      return
    }
    await loadVendors()
    setSaving(false)
    setModal(null)
  }

  async function deleteVendor() {
    if (!selected) return
    await fetch(`/api/admin/vendors/${selected.id}`, { method: 'DELETE' })
    await loadVendors()
    setModal(null)
  }

  async function updatePayoutStatus(id: string, status: string, reference?: string) {
    await fetch(`/api/admin/payouts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, reference }) })
    await loadPayouts()
  }

  async function createPayout() {
    setSaving(true)
    await fetch('/api/admin/payouts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payoutForm, amount: parseFloat(payoutForm.amount) }) })
    await loadPayouts()
    setSaving(false)
    setModal(null)
  }

  async function verify(vendor: VendorAccount, status: string) {
    await fetch(`/api/admin/vendors/${vendor.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    await loadVendors()
  }

  async function syncDb() {
    setSyncing(true)
    setSyncMsg(null)
    const r = await fetch('/api/admin/db-sync', { method: 'POST' })
    const data = await r.json()
    setSyncMsg(data.results?.join(' · ') || data.error || 'Done')
    setSyncing(false)
    await loadVendors()
    await loadPayouts()
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 pb-0">
        {(['vendors', 'payouts'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 text-xs font-semibold capitalize rounded-t-lg transition-colors', tab === t ? 'bg-white border border-b-white border-slate-200 text-brand-700 -mb-px' : 'text-slate-500 hover:text-slate-700')}>
            {t === 'payouts' ? `Payouts (${payouts.filter((p) => p.status === 'pending').length} pending)` : `Vendors (${vendors.length})`}
          </button>
        ))}
      </div>

      {/* ── Vendors tab ── */}
      {tab === 'vendors' && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="search" placeholder="Search vendor..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 text-sm" />
            </div>
            <button onClick={syncDb} disabled={syncing} title="Create DB tables if missing" className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-60">
              <Database className="w-3.5 h-3.5" /> {syncing ? 'Syncing…' : 'Sync DB'}
            </button>
            <button onClick={() => { setForm(BLANK); setModal('add') }} className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Vendor
            </button>
          </div>
          {syncMsg && <p className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">{syncMsg}</p>}

          {filtered.length === 0 ? (
            <div className="card p-12 text-center"><Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm text-slate-500">No vendors found</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((v) => {
                const s = STATUS_STYLE[v.status] || STATUS_STYLE.pending
                return (
                  <div key={v.id} className="card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-600" />
                      </div>
                      <span className={cn('badge text-xs flex items-center gap-1', s.bg, s.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />{v.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900">{v.companyName}</h3>
                    <p className="text-xs text-slate-500 mb-1">{v.contactName} · {v.email}</p>
                    <p className="text-xs text-slate-400 mb-3">{v.city}, {v.country}</p>
                    <div className="flex gap-2 text-xs text-slate-500 mb-3">
                      <span className="bg-slate-50 px-2 py-0.5 rounded-md">Commission {v.commissionRate}%</span>
                      <span className="bg-slate-50 px-2 py-0.5 rounded-md capitalize">{v.payoutSchedule}</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {v.status === 'pending' && (
                        <button onClick={() => verify(v, 'verified')} className="flex items-center gap-1 px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition-colors">
                          <CheckCircle2 className="w-3 h-3" /> Verify
                        </button>
                      )}
                      {v.status === 'verified' && (
                        <button onClick={() => verify(v, 'suspended')} className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors">
                          <XCircle className="w-3 h-3" /> Suspend
                        </button>
                      )}
                      {v.status === 'suspended' && (
                        <button onClick={() => verify(v, 'verified')} className="flex items-center gap-1 px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition-colors">
                          <CheckCircle2 className="w-3 h-3" /> Re-verify
                        </button>
                      )}
                      <button onClick={() => { setForm({ companyName: v.companyName, contactName: v.contactName, email: v.email, phone: v.phone ?? '', city: v.city ?? '', country: v.country, commissionRate: v.commissionRate, payoutSchedule: v.payoutSchedule, payoutDay: v.payoutDay, status: v.status, password: '' }); setSelected(v); setModal('edit') }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <a href="/vendor/login" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-medium rounded-lg transition-colors">
                        <ExternalLink className="w-3 h-3" /> Portal
                      </a>
                      <button onClick={() => { setSelected(v); setModal('delete') }}
                        className="flex items-center justify-center w-7 h-7 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ── Payouts tab ── */}
      {tab === 'payouts' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">{payouts.length} total payouts · £{payouts.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0).toFixed(2)} paid</p>
            <button onClick={() => { setPayoutForm({ vendorId: vendors[0]?.id || '', amount: '', currency: 'GBP', method: 'bank', period: '', notes: '' }); setModal('payout') }}
              className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
              <Plus className="w-3.5 h-3.5" /> New Payout
            </button>
          </div>

          <div className="card overflow-hidden">
            {payouts.length === 0 ? (
              <div className="py-14 text-center"><CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-sm text-slate-500">No payouts yet</p></div>
            ) : (
              <div className="divide-y divide-slate-50">
                {payouts.map((p) => (
                  <div key={p.id} className="px-5 py-3.5 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{p.vendor.companyName}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', PAYOUT_STATUS[p.status])}>{p.status}</span>
                        <span className="text-xs text-slate-400 capitalize">{p.method}</span>
                      </div>
                      <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}{p.period ? ` · ${p.period}` : ''}{p.reference ? ` · Ref: ${p.reference}` : ''}</p>
                      {p.notes && <p className="text-xs text-slate-400 italic">{p.notes}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-slate-900">£{p.amount.toFixed(2)}</div>
                      <div className="flex gap-1 mt-1 justify-end">
                        {p.status === 'pending' && (
                          <button onClick={() => updatePayoutStatus(p.id, 'paid')}
                            className="flex items-center gap-1 px-2 py-0.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs rounded-md transition-colors">
                            <CheckCircle2 className="w-3 h-3" /> Mark Paid
                          </button>
                        )}
                        {p.status === 'pending' && (
                          <button onClick={() => updatePayoutStatus(p.id, 'processing')}
                            className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-md transition-colors">
                            <Clock className="w-3 h-3" /> Processing
                          </button>
                        )}
                        {p.status === 'paid' && (
                          <button onClick={() => updatePayoutStatus(p.id, 'pending')}
                            className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs rounded-md transition-colors">
                            <RefreshCw className="w-3 h-3" /> Revert
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {(modal === 'add' || modal === 'edit') && (
        <AdminModal open onClose={() => { setModal(null); setError(null) }} title={modal === 'add' ? 'Add Vendor' : `Edit — ${selected?.companyName}`} size="lg"
          footer={<>
            {error && <span className="text-xs text-red-600 flex-1">{error}</span>}
            <button onClick={() => { setModal(null); setError(null) }} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg disabled:opacity-60"><Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}</button>
          </>}>
          <div className="grid grid-cols-2 gap-4">
            <F label="Company Name"><input type="text" value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} className="input text-sm" /></F>
            <F label="Contact Name"><input type="text" value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} className="input text-sm" /></F>
            <F label="Email"><input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input text-sm" /></F>
            <F label="Phone"><input type="text" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input text-sm" /></F>
            <F label="City"><input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="input text-sm" /></F>
            <F label="Country"><input type="text" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="input text-sm" /></F>
            <F label="Commission Rate (%)"><input type="number" value={form.commissionRate} onChange={(e) => setForm((f) => ({ ...f, commissionRate: Number(e.target.value) }))} className="input text-sm" min={0} max={100} /></F>
            <F label="Status">
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="input text-sm">
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="suspended">Suspended</option>
              </select>
            </F>
            <F label="Payout Schedule">
              <select value={form.payoutSchedule} onChange={(e) => setForm((f) => ({ ...f, payoutSchedule: e.target.value }))} className="input text-sm">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </F>
            <F label={form.payoutSchedule === 'weekly' ? 'Day of Week (1=Mon)' : 'Day of Month'}>
              <input type="number" value={form.payoutDay} onChange={(e) => setForm((f) => ({ ...f, payoutDay: Number(e.target.value) }))} className="input text-sm" min={1} max={form.payoutSchedule === 'weekly' ? 7 : 31} />
            </F>
            <div className="col-span-2">
              <F label={modal === 'edit' ? 'New Password (leave blank to keep)' : 'Portal Password'}>
                <input type="text" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="input text-sm font-mono" placeholder={modal === 'edit' ? 'Leave blank to keep current' : 'Set login password'} />
              </F>
            </div>
          </div>
        </AdminModal>
      )}

      {/* New payout modal */}
      {modal === 'payout' && (
        <AdminModal open onClose={() => setModal(null)} title="Create Payout" size="md"
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={createPayout} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg disabled:opacity-60"><CreditCard className="w-3.5 h-3.5" /> {saving ? 'Creating...' : 'Create Payout'}</button>
          </>}>
          <div className="space-y-4">
            <F label="Vendor">
              <select value={payoutForm.vendorId} onChange={(e) => setPayoutForm((f) => ({ ...f, vendorId: e.target.value }))} className="input text-sm">
                {vendors.filter((v) => v.status === 'verified').map((v) => <option key={v.id} value={v.id}>{v.companyName}</option>)}
              </select>
            </F>
            <div className="grid grid-cols-2 gap-4">
              <F label="Amount (£)"><input type="number" step="0.01" value={payoutForm.amount} onChange={(e) => setPayoutForm((f) => ({ ...f, amount: e.target.value }))} className="input text-sm" placeholder="0.00" /></F>
              <F label="Method">
                <select value={payoutForm.method} onChange={(e) => setPayoutForm((f) => ({ ...f, method: e.target.value }))} className="input text-sm">
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="wise">Wise</option>
                  <option value="payoneer">Payoneer</option>
                  <option value="stripe">Stripe Connect</option>
                </select>
              </F>
              <F label="Period (e.g. 2026-04)"><input type="text" value={payoutForm.period} onChange={(e) => setPayoutForm((f) => ({ ...f, period: e.target.value }))} className="input text-sm" placeholder="2026-04" /></F>
              <F label="Currency"><input type="text" value={payoutForm.currency} onChange={(e) => setPayoutForm((f) => ({ ...f, currency: e.target.value }))} className="input text-sm" /></F>
            </div>
            <F label="Notes (optional)"><textarea value={payoutForm.notes} onChange={(e) => setPayoutForm((f) => ({ ...f, notes: e.target.value }))} className="input text-sm" rows={2} /></F>
          </div>
        </AdminModal>
      )}

      {/* Delete modal */}
      {modal === 'delete' && selected && (
        <AdminModal open onClose={() => setModal(null)} title="Delete Vendor" size="sm"
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50">Cancel</button>
            <button onClick={deleteVendor} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg">Delete</button>
          </>}>
          <p className="text-sm text-slate-600">Delete <strong>{selected.companyName}</strong>? This cannot be undone.</p>
        </AdminModal>
      )}
    </div>
  )
}
