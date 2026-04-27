'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Edit2, Trash2, Star, Phone, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/admin/utils'
import AdminModal from '@/components/admin/ui/Modal'
import AdminEmptyState from '@/components/admin/ui/EmptyState'
import { useAdminStore } from '@/lib/admin/store'
import type { Driver } from '@/lib/admin/types'

const STATUS_STYLE = {
  available:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  on_trip:    { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  off_duty:   { bg: 'bg-slate-100', text: 'text-slate-600',  dot: 'bg-slate-400' },
  suspended:  { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
}

const BLANK: Omit<Driver, 'id' | 'createdAt'> = {
  name: '', email: '', phone: '', whatsapp: '', licenseNumber: '', licenseExpiry: '',
  nationality: '', languages: ['Arabic'], vehicleId: undefined, vendorId: undefined,
  rating: 5, totalTrips: 0, status: 'available', isActive: true,
}

export default function AdminDriversPage() {
  const { drivers, vendors, addDriver, updateDriver, deleteDriver } = useAdminStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Driver['status'] | 'all'>('all')
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Driver | null>(null)
  const [form, setForm] = useState<Omit<Driver, 'id' | 'createdAt'>>(BLANK)
  const [langInput, setLangInput] = useState('')

  const filtered = useMemo(() => {
    let data = [...drivers]
    if (statusFilter !== 'all') data = data.filter((d) => d.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((d) =>
        d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) || d.phone.includes(q),
      )
    }
    return data
  }, [drivers, search, statusFilter])

  function openAdd() { setForm(BLANK); setLangInput(''); setModal('add') }
  function openEdit(d: Driver) { setForm(d); setLangInput(d.languages.join(', ')); setSelected(d); setModal('edit') }
  function openDelete(d: Driver) { setSelected(d); setModal('delete') }
  function close() { setModal(null); setSelected(null) }

  function save() {
    const langs = langInput.split(',').map((l) => l.trim()).filter(Boolean)
    const data = { ...form, languages: langs.length ? langs : ['Arabic'] }
    if (modal === 'add') addDriver(data)
    else if (modal === 'edit' && selected) updateDriver(selected.id, data)
    close()
  }

  function F({ label, children }: { label: string; children: React.ReactNode }) {
    return <div><label className="label">{label}</label>{children}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input type="search" placeholder="Search name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 text-sm" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {(['all', 'available', 'on_trip', 'off_duty', 'suspended'] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition-colors', statusFilter === s ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Driver
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><AdminEmptyState icon={<Search className="w-7 h-7" />} title="No drivers found" /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Driver</th>
                <th className="table-th hidden md:table-cell">Contact</th>
                <th className="table-th hidden lg:table-cell">Vendor</th>
                <th className="table-th hidden lg:table-cell">License Expiry</th>
                <th className="table-th">Status</th>
                <th className="table-th hidden sm:table-cell">Rating</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((d) => {
                const s = STATUS_STYLE[d.status]
                const vendor = vendors.find((v) => v.id === d.vendorId)
                return (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">{d.name[0]}</div>
                        <div>
                          <div className="font-medium text-slate-900 text-xs">{d.name}</div>
                          <div className="text-xs text-slate-400">{d.nationality} · {d.languages.join(', ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-td hidden md:table-cell">
                      <div className="text-xs text-slate-700">{d.email}</div>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400"><Phone className="w-3 h-3" />{d.phone}</div>
                    </td>
                    <td className="table-td hidden lg:table-cell"><span className="text-xs text-slate-600">{vendor?.companyName || '—'}</span></td>
                    <td className="table-td hidden lg:table-cell"><span className="text-xs text-slate-600">{formatDate(d.licenseExpiry)}</span></td>
                    <td className="table-td"><span className={cn('badge text-xs flex items-center gap-1', s.bg, s.text)}><span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />{d.status.replace('_', ' ')}</span></td>
                    <td className="table-td hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-xs"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><span className="font-medium text-slate-700">{d.rating}</span><span className="text-slate-400">({d.totalTrips})</span></div>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(d)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => openDelete(d)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <AdminModal open onClose={close} title={modal === 'add' ? 'Add Driver' : `Edit — ${selected?.name}`} size="lg"
          footer={<>
            <button onClick={close} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={save} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"><Save className="w-3.5 h-3.5" /> Save</button>
          </>}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <F label="Full Name"><input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input text-sm" placeholder="Yusuf Al-Amri" /></F>
              <F label="Email"><input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input text-sm" /></F>
              <F label="Phone"><input type="text" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input text-sm" placeholder="+966 55 111 1111" /></F>
              <F label="WhatsApp (optional)"><input type="text" value={form.whatsapp || ''} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} className="input text-sm" /></F>
              <F label="Nationality"><input type="text" value={form.nationality} onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))} className="input text-sm" /></F>
              <F label="Languages (comma separated)"><input type="text" value={langInput} onChange={(e) => setLangInput(e.target.value)} className="input text-sm" placeholder="Arabic, English, Urdu" /></F>
              <F label="License Number"><input type="text" value={form.licenseNumber} onChange={(e) => setForm((f) => ({ ...f, licenseNumber: e.target.value }))} className="input text-sm" /></F>
              <F label="License Expiry"><input type="date" value={form.licenseExpiry} onChange={(e) => setForm((f) => ({ ...f, licenseExpiry: e.target.value }))} className="input text-sm" /></F>
              <F label="Vendor">
                <select value={form.vendorId || ''} onChange={(e) => setForm((f) => ({ ...f, vendorId: e.target.value || undefined }))} className="input text-sm">
                  <option value="">— None —</option>
                  {vendors.map((v) => <option key={v.id} value={v.id}>{v.companyName}</option>)}
                </select>
              </F>
              <F label="Status">
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Driver['status'] }))} className="input text-sm">
                  <option value="available">Available</option>
                  <option value="on_trip">On Trip</option>
                  <option value="off_duty">Off Duty</option>
                  <option value="suspended">Suspended</option>
                </select>
              </F>
            </div>
          </div>
        </AdminModal>
      )}

      {modal === 'delete' && selected && (
        <AdminModal open onClose={close} title="Delete Driver" size="sm"
          footer={<>
            <button onClick={close} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={() => { deleteDriver(selected.id); close() }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">Delete</button>
          </>}>
          <p className="text-sm text-slate-600">Delete driver <strong>{selected.name}</strong>? This cannot be undone.</p>
        </AdminModal>
      )}
    </div>
  )
}
