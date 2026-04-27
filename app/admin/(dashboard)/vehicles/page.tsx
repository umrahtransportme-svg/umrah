'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, AlertCircle, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate, VEHICLE_LABELS } from '@/lib/admin/utils'
import AdminModal from '@/components/admin/ui/Modal'
import AdminEmptyState from '@/components/admin/ui/EmptyState'
import { useAdminStore } from '@/lib/admin/store'
import type { Vehicle, VehicleType } from '@/lib/admin/types'

const STATUS_STYLE = {
  available:   { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  in_use:      { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  maintenance: { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  retired:     { bg: 'bg-slate-100', text: 'text-slate-600',  dot: 'bg-slate-400' },
}

const BLANK: Omit<Vehicle, 'id' | 'createdAt'> = {
  make: '', model: '', year: new Date().getFullYear(), type: 'sedan', capacity: 3,
  plateNumber: '', color: 'White', driverId: undefined, vendorId: undefined,
  status: 'available', insuranceExpiry: '', lastService: '', mileage: 0, isActive: true,
}

export default function AdminVehiclesPage() {
  const { vehicles, vendors, drivers, addVehicle, updateVehicle, deleteVehicle } = useAdminStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<VehicleType | 'all'>('all')
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Vehicle | null>(null)
  const [form, setForm] = useState<Omit<Vehicle, 'id' | 'createdAt'>>(BLANK)

  const filtered = useMemo(() => {
    let data = [...vehicles]
    if (typeFilter !== 'all') data = data.filter((v) => v.type === typeFilter)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((v) =>
        v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.plateNumber.toLowerCase().includes(q),
      )
    }
    return data
  }, [vehicles, search, typeFilter])

  function openAdd() { setForm(BLANK); setModal('add') }
  function openEdit(v: Vehicle) { setForm(v); setSelected(v); setModal('edit') }
  function openDelete(v: Vehicle) { setSelected(v); setModal('delete') }
  function close() { setModal(null); setSelected(null) }

  function save() {
    if (modal === 'add') addVehicle(form)
    else if (modal === 'edit' && selected) updateVehicle(selected.id, form)
    close()
  }

  function F({ label, children }: { label: string; children: React.ReactNode }) {
    return <div><label className="label">{label}</label>{children}</div>
  }

  const soon = (d: string) => {
    const days = (new Date(d).getTime() - Date.now()) / 86400000
    return days < 30
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input type="search" placeholder="Search make, model, plate..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 text-sm" />
        </div>
        <div className="flex gap-1">
          {(['all', 'sedan', 'suv', 'minivan'] as const).map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', typeFilter === t ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
              {t === 'all' ? 'All' : VEHICLE_LABELS[t]}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Vehicle
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><AdminEmptyState icon={<Search className="w-7 h-7" />} title="No vehicles found" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((v) => {
            const s = STATUS_STYLE[v.status]
            const vendor = vendors.find((vn) => vn.id === v.vendorId)
            const driver = drivers.find((d) => d.id === v.driverId)
            return (
              <div key={v.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{v.make} {v.model}</h3>
                    <p className="text-xs text-slate-500">{v.year} · {v.color} · {v.plateNumber}</p>
                  </div>
                  <span className={cn('badge text-xs flex items-center gap-1', s.bg, s.text)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />{v.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-xs text-slate-600 capitalize">{v.type}</span>
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-xs text-slate-600">{v.capacity} pax</span>
                  {vendor && <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-xs text-slate-600">{vendor.companyName}</span>}
                </div>
                {driver && <p className="text-xs text-slate-500 mb-2">Driver: <strong className="text-slate-700">{driver.name}</strong></p>}
                <div className="flex items-center gap-2 text-xs mb-3">
                  <span className="text-slate-500">Insurance:</span>
                  <span className={cn('font-medium', soon(v.insuranceExpiry) ? 'text-red-600' : 'text-slate-700')}>
                    {formatDate(v.insuranceExpiry)}
                    {soon(v.insuranceExpiry) && <AlertCircle className="w-3 h-3 inline ml-1" />}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(v)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                  <button onClick={() => openDelete(v)} className="inline-flex items-center justify-center w-8 h-7 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <AdminModal open onClose={close} title={modal === 'add' ? 'Add Vehicle' : `Edit — ${selected?.make} ${selected?.model}`} size="lg"
          footer={<>
            <button onClick={close} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={save} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"><Save className="w-3.5 h-3.5" /> Save</button>
          </>}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <F label="Make"><input type="text" value={form.make} onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))} className="input text-sm" placeholder="Toyota" /></F>
              <F label="Model"><input type="text" value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} className="input text-sm" placeholder="Land Cruiser" /></F>
              <F label="Year"><input type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))} className="input text-sm" /></F>
              <F label="Type">
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as VehicleType }))} className="input text-sm">
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="minivan">Minivan</option>
                </select>
              </F>
              <F label="Capacity (pax)"><input type="number" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))} className="input text-sm" min={1} /></F>
              <F label="Plate Number"><input type="text" value={form.plateNumber} onChange={(e) => setForm((f) => ({ ...f, plateNumber: e.target.value }))} className="input text-sm" placeholder="ABC-1234" /></F>
              <F label="Color"><input type="text" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="input text-sm" /></F>
              <F label="Status">
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Vehicle['status'] }))} className="input text-sm">
                  <option value="available">Available</option>
                  <option value="in_use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </F>
              <F label="Vendor">
                <select value={form.vendorId || ''} onChange={(e) => setForm((f) => ({ ...f, vendorId: e.target.value || undefined }))} className="input text-sm">
                  <option value="">— None —</option>
                  {vendors.map((v) => <option key={v.id} value={v.id}>{v.companyName}</option>)}
                </select>
              </F>
              <F label="Assigned Driver">
                <select value={form.driverId || ''} onChange={(e) => setForm((f) => ({ ...f, driverId: e.target.value || undefined }))} className="input text-sm">
                  <option value="">— None —</option>
                  {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </F>
              <F label="Insurance Expiry"><input type="date" value={form.insuranceExpiry} onChange={(e) => setForm((f) => ({ ...f, insuranceExpiry: e.target.value }))} className="input text-sm" /></F>
              <F label="Last Service Date"><input type="date" value={form.lastService} onChange={(e) => setForm((f) => ({ ...f, lastService: e.target.value }))} className="input text-sm" /></F>
              <F label="Mileage (km)"><input type="number" value={form.mileage} onChange={(e) => setForm((f) => ({ ...f, mileage: Number(e.target.value) }))} className="input text-sm" min={0} /></F>
            </div>
          </div>
        </AdminModal>
      )}

      {modal === 'delete' && selected && (
        <AdminModal open onClose={close} title="Delete Vehicle" size="sm"
          footer={<>
            <button onClick={close} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={() => { deleteVehicle(selected.id); close() }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">Delete</button>
          </>}>
          <p className="text-sm text-slate-600">Delete <strong>{selected.make} {selected.model}</strong> ({selected.plateNumber})? This cannot be undone.</p>
        </AdminModal>
      )}
    </div>
  )
}
