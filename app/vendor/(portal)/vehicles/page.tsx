'use client'

import { useState, useEffect, useCallback } from 'react'
import { Car, Plus, Edit2, Trash2, Save, CheckCircle2, Clock, XCircle, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import FileUpload from '@/components/ui/FileUpload'

type Vehicle = {
  id: string; make: string; model: string; year: number; plate: string
  color: string | null; capacity: number; vehicleType: string; status: string
  regDoc: string | null; regDocName: string | null
  insuranceDoc: string | null; insuranceDocName: string | null
  roadworthyDoc: string | null; roadworthyDocName: string | null
  photoFront: string | null; photoSide: string | null; notes: string | null
  createdAt: string
}

const CURRENT_YEAR = new Date().getFullYear()
const MIN_YEAR = CURRENT_YEAR - 3

const VEHICLE_TYPES = ['Sedan', 'SUV', 'Van', 'Minibus', 'Bus', 'Luxury']
const STATUS = {
  pending:  { label: 'Pending Review', bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  active:   { label: 'Active',         bg: 'bg-green-50', text: 'text-green-700',  icon: CheckCircle2 },
  rejected: { label: 'Rejected',       bg: 'bg-red-50',   text: 'text-red-700',    icon: XCircle },
}

const BLANK = { make: '', model: '', year: CURRENT_YEAR, plate: '', color: '', capacity: 4, vehicleType: 'Sedan', notes: '', regDoc: null as string | null, regDocName: null as string | null, insuranceDoc: null as string | null, insuranceDocName: null as string | null, roadworthyDoc: null as string | null, roadworthyDocName: null as string | null, photoFront: null as string | null, photoSide: null as string | null }

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>{children}</div>
}

const input = 'w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

export default function VendorVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Vehicle | null>(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const r = await fetch('/api/vendor/vehicles')
    if (r.ok) setVehicles(await r.json())
  }, [])
  useEffect(() => { load() }, [load])

  function openAdd() { setForm(BLANK); setError(null); setModal('add') }
  function openEdit(v: Vehicle) {
    setForm({ make: v.make, model: v.model, year: v.year, plate: v.plate, color: v.color || '', capacity: v.capacity, vehicleType: v.vehicleType, notes: v.notes || '', regDoc: v.regDoc, regDocName: v.regDocName, insuranceDoc: v.insuranceDoc, insuranceDocName: v.insuranceDocName, roadworthyDoc: v.roadworthyDoc, roadworthyDocName: v.roadworthyDocName, photoFront: v.photoFront, photoSide: v.photoSide })
    setSelected(v); setError(null); setModal('edit')
  }

  async function save() {
    setSaving(true); setError(null)
    const res = modal === 'add'
      ? await fetch('/api/vendor/vehicles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      : await fetch(`/api/vendor/vehicles/${selected!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); setSaving(false); return }
    await load(); setSaving(false); setModal(null)
  }

  async function del() {
    await fetch(`/api/vendor/vehicles/${selected!.id}`, { method: 'DELETE' })
    await load(); setModal(null)
  }

  const activeCount = vehicles.filter(v => v.status === 'active').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Fleet Vehicles</h1>
          <p className="text-xs text-slate-500 mt-0.5">{vehicles.length} registered · {activeCount} active</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-xl transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Vehicle
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>All vehicles must be <strong>no more than 3 years old</strong> (registered {MIN_YEAR} or later). Upload complete documents for faster approval.</span>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center">
          <Car className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 mb-1">No vehicles registered</p>
          <p className="text-xs text-slate-400 mb-4">Add your first vehicle to get started.</p>
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-xl">
            <Plus className="w-3.5 h-3.5" /> Add Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {vehicles.map((v) => {
            const s = STATUS[v.status as keyof typeof STATUS] || STATUS.pending
            const Icon = s.icon
            const docsComplete = !!(v.regDoc && v.insuranceDoc && v.roadworthyDoc)
            return (
              <div key={v.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {v.photoFront ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.photoFront} alt={v.plate} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Car className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{v.make} {v.model}</h3>
                      <p className="text-xs text-slate-500 font-mono">{v.plate}</p>
                    </div>
                  </div>
                  <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', s.bg, s.text)}>
                    <Icon className="w-3 h-3" />{s.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 mb-3">
                  <div className="bg-slate-50 rounded-lg px-2 py-1.5 text-center"><div className="font-bold">{v.year}</div><div className="text-slate-400">Year</div></div>
                  <div className="bg-slate-50 rounded-lg px-2 py-1.5 text-center"><div className="font-bold">{v.capacity}</div><div className="text-slate-400">Seats</div></div>
                  <div className="bg-slate-50 rounded-lg px-2 py-1.5 text-center"><div className="font-bold truncate">{v.vehicleType}</div><div className="text-slate-400">Type</div></div>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  {[['Reg', v.regDoc], ['Ins', v.insuranceDoc], ['RW', v.roadworthyDoc]].map(([l, d]) => (
                    <span key={l as string} className={cn('text-xs px-2 py-0.5 rounded-md font-medium', d ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-400')}>
                      {l}: {d ? '✓' : '—'}
                    </span>
                  ))}
                  {!docsComplete && <span className="text-xs text-amber-600">Docs incomplete</span>}
                </div>

                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(v)} className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => { setSelected(v); setModal('delete') }} className="flex items-center justify-center w-7 h-7 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{modal === 'add' ? 'Add Vehicle' : 'Edit Vehicle'}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Basic info */}
              <div className="grid grid-cols-2 gap-4">
                <F label="Make *"><input className={input} value={form.make} onChange={e => setForm(f => ({ ...f, make: e.target.value }))} placeholder="Toyota" /></F>
                <F label="Model *"><input className={input} value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="HiAce" /></F>
                <F label={`Year * (min ${MIN_YEAR})`}>
                  <input type="number" className={input} value={form.year} min={MIN_YEAR} max={CURRENT_YEAR + 1}
                    onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} />
                  {form.year < MIN_YEAR && <p className="text-xs text-red-500 mt-1">Vehicle must be {MIN_YEAR} or newer</p>}
                </F>
                <F label="Plate Number *"><input className={cn(input, 'uppercase font-mono')} value={form.plate} onChange={e => setForm(f => ({ ...f, plate: e.target.value.toUpperCase() }))} placeholder="AB12 CDE" /></F>
                <F label="Color"><input className={input} value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="White" /></F>
                <F label="Passenger Capacity *"><input type="number" className={input} value={form.capacity} min={1} max={60} onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))} /></F>
                <div className="col-span-2">
                  <F label="Vehicle Type *">
                    <div className="flex gap-2 flex-wrap">
                      {VEHICLE_TYPES.map(t => (
                        <button key={t} type="button" onClick={() => setForm(f => ({ ...f, vehicleType: t }))}
                          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors', form.vehicleType === t ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300')}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </F>
                </div>
              </div>

              {/* Documents */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">2</span>
                  Vehicle Documents
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FileUpload label="Registration Certificate *" value={form.regDoc} fileName={form.regDocName} accept=".pdf,.jpg,.jpeg,.png" onChange={(d, n) => setForm(f => ({ ...f, regDoc: d, regDocName: n }))} />
                  <FileUpload label="Insurance Certificate *" value={form.insuranceDoc} fileName={form.insuranceDocName} accept=".pdf,.jpg,.jpeg,.png" onChange={(d, n) => setForm(f => ({ ...f, insuranceDoc: d, insuranceDocName: n }))} />
                  <FileUpload label="Road Worthiness Certificate *" value={form.roadworthyDoc} fileName={form.roadworthyDocName} accept=".pdf,.jpg,.jpeg,.png" onChange={(d, n) => setForm(f => ({ ...f, roadworthyDoc: d, roadworthyDocName: n }))} />
                  <FileUpload label="Front Photo" value={form.photoFront} fileName="front-photo" accept="image/*" preview onChange={(d, _) => setForm(f => ({ ...f, photoFront: d }))} />
                  <FileUpload label="Side Photo" value={form.photoSide} fileName="side-photo" accept="image/*" preview onChange={(d, _) => setForm(f => ({ ...f, photoSide: d }))} />
                </div>
              </div>

              <F label="Notes (optional)">
                <textarea className={input} rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any additional info..." />
              </F>

              {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || form.year < MIN_YEAR} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-xl disabled:opacity-60 transition-colors">
                <Save className="w-3.5 h-3.5" />{saving ? 'Saving…' : 'Save Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">Delete vehicle?</h3>
            <p className="text-sm text-slate-500 mb-5">{selected.make} {selected.model} · {selected.plate}</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={del} className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
