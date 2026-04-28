'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, Edit2, Trash2, Save, CheckCircle2, XCircle, PauseCircle, X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import FileUpload from '@/components/ui/FileUpload'

type Driver = {
  id: string; fullName: string; email: string | null; phone: string
  nationality: string | null; licenseNumber: string; licenseExpiry: string
  status: string; licenseDoc: string | null; licenseDocName: string | null
  passportDoc: string | null; passportDocName: string | null; photoUrl: string | null
  assignedVehicleId: string | null; notes: string | null; createdAt: string
}

const STATUS = {
  active:    { label: 'Active',    bg: 'bg-green-50',  text: 'text-green-700',  icon: CheckCircle2 },
  inactive:  { label: 'Inactive',  bg: 'bg-slate-100', text: 'text-slate-600',  icon: PauseCircle },
  suspended: { label: 'Suspended', bg: 'bg-red-50',    text: 'text-red-700',    icon: XCircle },
}

const BLANK = { fullName: '', email: '', phone: '', nationality: '', licenseNumber: '', licenseExpiry: '', status: 'active', licenseDoc: null as string | null, licenseDocName: null as string | null, passportDoc: null as string | null, passportDocName: null as string | null, photoUrl: null as string | null, assignedVehicleId: '', notes: '' }

const NATIONALITIES = ['British', 'Saudi', 'Pakistani', 'Bangladeshi', 'Indian', 'Egyptian', 'Sudanese', 'Yemeni', 'Indonesian', 'Other']

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>{children}</div>
}

const input = 'w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

function licenseStatus(expiry: string) {
  const exp = new Date(expiry)
  const now = new Date()
  const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  if (diff < 0) return { label: 'Expired', className: 'text-red-600' }
  if (diff < 30) return { label: `Expires in ${Math.round(diff)}d`, className: 'text-amber-600' }
  return { label: `Valid until ${exp.toLocaleDateString('en-GB')}`, className: 'text-green-600' }
}

export default function VendorDriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Driver | null>(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const r = await fetch('/api/vendor/drivers')
    if (r.ok) setDrivers(await r.json())
  }, [])
  useEffect(() => { load() }, [load])

  function openEdit(d: Driver) {
    setForm({ fullName: d.fullName, email: d.email || '', phone: d.phone, nationality: d.nationality || '', licenseNumber: d.licenseNumber, licenseExpiry: d.licenseExpiry, status: d.status, licenseDoc: d.licenseDoc, licenseDocName: d.licenseDocName, passportDoc: d.passportDoc, passportDocName: d.passportDocName, photoUrl: d.photoUrl, assignedVehicleId: d.assignedVehicleId || '', notes: d.notes || '' })
    setSelected(d); setError(null); setModal('edit')
  }

  async function save() {
    setSaving(true); setError(null)
    const res = modal === 'add'
      ? await fetch('/api/vendor/drivers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      : await fetch(`/api/vendor/drivers/${selected!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); setSaving(false); return }
    await load(); setSaving(false); setModal(null)
  }

  const activeCount = drivers.filter(d => d.status === 'active').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Drivers</h1>
          <p className="text-xs text-slate-500 mt-0.5">{drivers.length} registered · {activeCount} active</p>
        </div>
        <button onClick={() => { setForm(BLANK); setError(null); setModal('add') }} className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-xl transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Driver
        </button>
      </div>

      {drivers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center">
          <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 mb-1">No drivers registered</p>
          <p className="text-xs text-slate-400 mb-4">Add drivers to assign them to bookings.</p>
          <button onClick={() => { setForm(BLANK); setModal('add') }} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-xl">
            <Plus className="w-3.5 h-3.5" /> Add Driver
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {drivers.map((d) => {
            const s = STATUS[d.status as keyof typeof STATUS] || STATUS.active
            const Icon = s.icon
            const lic = licenseStatus(d.licenseExpiry)
            return (
              <div key={d.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-start gap-3 mb-3">
                  {d.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.photoUrl} alt={d.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg flex-shrink-0">
                      {d.fullName[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{d.fullName}</h3>
                      <span className={cn('flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0', s.bg, s.text)}>
                        <Icon className="w-3 h-3" />{s.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{d.phone}</p>
                    {d.nationality && <p className="text-xs text-slate-400">{d.nationality}</p>}
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">License: <span className="font-mono text-slate-700">{d.licenseNumber}</span></span>
                    <span className={cn('font-medium text-xs', lic.className)}>{lic.label}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[['License', d.licenseDoc], ['Passport', d.passportDoc]].map(([l, doc]) => (
                      <span key={l as string} className={cn('text-xs px-2 py-0.5 rounded-md font-medium', doc ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-400')}>
                        {l}: {doc ? '✓' : '—'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(d)} className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => { setSelected(d); setModal('delete') }} className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl my-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{modal === 'add' ? 'Add Driver' : 'Edit Driver'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <F label="Full Name *"><input className={input} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Mohammed Al-Rashid" /></F>
                </div>
                <F label="Phone *"><input type="tel" className={input} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+966 50 000 0000" /></F>
                <F label="Email">
                  <input type="email" className={input} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="driver@email.com" />
                </F>
                <F label="Nationality">
                  <select className={input} value={form.nationality} onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}>
                    <option value="">Select…</option>
                    {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
                  </select>
                </F>
                <F label="Status">
                  <select className={input} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </F>
                <F label="License Number *"><input className={cn(input, 'font-mono')} value={form.licenseNumber} onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))} placeholder="SA1234567" /></F>
                <F label="License Expiry *">
                  <input type="date" className={input} value={form.licenseExpiry} onChange={e => setForm(f => ({ ...f, licenseExpiry: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
                </F>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 mb-3">Driver Documents</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FileUpload label="Driving License *" value={form.licenseDoc} fileName={form.licenseDocName} accept=".pdf,.jpg,.jpeg,.png" onChange={(d, n) => setForm(f => ({ ...f, licenseDoc: d, licenseDocName: n }))} />
                  <FileUpload label="Passport / ID" value={form.passportDoc} fileName={form.passportDocName} accept=".pdf,.jpg,.jpeg,.png" onChange={(d, n) => setForm(f => ({ ...f, passportDoc: d, passportDocName: n }))} />
                  <FileUpload label="Driver Photo" value={form.photoUrl} fileName="photo" accept="image/*" preview onChange={(d, _) => setForm(f => ({ ...f, photoUrl: d }))} />
                </div>
              </div>

              <F label="Notes (optional)">
                <textarea className={input} rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </F>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{error}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-xl disabled:opacity-60">
                <Save className="w-3.5 h-3.5" />{saving ? 'Saving…' : 'Save Driver'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">Remove driver?</h3>
            <p className="text-sm text-slate-500 mb-5">{selected.fullName}</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={async () => { await fetch(`/api/vendor/drivers/${selected.id}`, { method: 'DELETE' }); await load(); setModal(null) }} className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
