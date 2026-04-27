'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, Star, Building2, Car, Users, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdminModal from '@/components/admin/ui/Modal'
import AdminEmptyState from '@/components/admin/ui/EmptyState'
import { useAdminStore } from '@/lib/admin/store'
import type { Vendor } from '@/lib/admin/types'

const STATUS_STYLE = {
  active:    { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  inactive:  { bg: 'bg-slate-100', text: 'text-slate-600',  dot: 'bg-slate-400' },
  suspended: { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
}

const BLANK: Omit<Vendor, 'id' | 'createdAt'> = {
  companyName: '', contactName: '', email: '', phone: '',
  city: '', country: 'Saudi Arabia', vehicles: 0, drivers: 0,
  rating: 5, commissionRate: 15, status: 'active',
}

export default function AdminVendorsPage() {
  const { vendors, addVendor, updateVendor, deleteVendor } = useAdminStore()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Vendor | null>(null)
  const [form, setForm] = useState(BLANK)

  const filtered = useMemo(() => {
    if (!search) return vendors
    const q = search.toLowerCase()
    return vendors.filter((v) =>
      v.companyName.toLowerCase().includes(q) ||
      v.contactName.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q),
    )
  }, [vendors, search])

  function openAdd() { setForm(BLANK); setModal('add') }
  function openEdit(v: Vendor) { setForm(v); setSelected(v); setModal('edit') }
  function openDelete(v: Vendor) { setSelected(v); setModal('delete') }
  function close() { setModal(null); setSelected(null) }

  function save() {
    if (modal === 'add') addVendor(form)
    else if (modal === 'edit' && selected) updateVendor(selected.id, form)
    close()
  }

  function F({ label, children }: { label: string; children: React.ReactNode }) {
    return <div><label className="label">{label}</label>{children}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input type="search" placeholder="Search company, contact, city..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 text-sm" />
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Vendor
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><AdminEmptyState icon={<Building2 className="w-7 h-7" />} title="No vendors found" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((vendor) => {
            const s = STATUS_STYLE[vendor.status]
            return (
              <div key={vendor.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <span className={cn('badge text-xs flex items-center gap-1', s.bg, s.text)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />{vendor.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-0.5">{vendor.companyName}</h3>
                <p className="text-xs text-slate-500 mb-3">{vendor.contactName} · {vendor.city}, {vendor.country}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /><strong className="text-slate-700">{vendor.vehicles}</strong> vehicles</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /><strong className="text-slate-700">{vendor.drivers}</strong> drivers</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><strong className="text-slate-700">{vendor.rating}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(vendor)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => openDelete(vendor)} className="inline-flex items-center justify-center w-8 h-7 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <AdminModal open onClose={close} title={modal === 'add' ? 'Add Vendor' : `Edit — ${selected?.companyName}`} size="lg"
          footer={<>
            <button onClick={close} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={save} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"><Save className="w-3.5 h-3.5" /> Save</button>
          </>}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <F label="Company Name"><input type="text" value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} className="input text-sm" placeholder="Makkah Cabs" /></F>
              <F label="Contact Name"><input type="text" value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} className="input text-sm" placeholder="Khalid Al-Fahad" /></F>
              <F label="Email"><input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input text-sm" /></F>
              <F label="Phone"><input type="text" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input text-sm" placeholder="+966 50 111 1111" /></F>
              <F label="City"><input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="input text-sm" /></F>
              <F label="Country"><input type="text" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="input text-sm" /></F>
              <F label="Commission Rate (%)"><input type="number" value={form.commissionRate} onChange={(e) => setForm((f) => ({ ...f, commissionRate: Number(e.target.value) }))} className="input text-sm" min={0} max={100} /></F>
              <F label="Status">
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Vendor['status'] }))} className="input text-sm">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </F>
            </div>
          </div>
        </AdminModal>
      )}

      {modal === 'delete' && selected && (
        <AdminModal open onClose={close} title="Delete Vendor" size="sm"
          footer={<>
            <button onClick={close} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={() => { deleteVendor(selected.id); close() }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">Delete</button>
          </>}>
          <p className="text-sm text-slate-600">Delete <strong>{selected.companyName}</strong>? This cannot be undone.</p>
        </AdminModal>
      )}
    </div>
  )
}
