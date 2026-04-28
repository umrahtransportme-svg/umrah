'use client'

import { useState, useEffect } from 'react'
import { Plane, Car, MapPin, Star, Heart, Edit2, ToggleLeft, ToggleRight, Plus, Trash2, Wrench, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/admin/utils'
import AdminModal from '@/components/admin/ui/Modal'

const ICON_MAP: Record<string, React.ElementType> = {
  Plane, Car, MapPin, Star, Heart, Wrench,
}

const ICON_OPTIONS = ['Plane', 'Car', 'MapPin', 'Star', 'Heart', 'Wrench']
const COLOR_OPTIONS = [
  { label: 'Blue',   value: 'bg-blue-50 text-blue-600' },
  { label: 'Purple', value: 'bg-purple-50 text-purple-600' },
  { label: 'Green',  value: 'bg-green-50 text-green-600' },
  { label: 'Amber',  value: 'bg-amber-50 text-amber-600' },
  { label: 'Red',    value: 'bg-red-50 text-red-600' },
]

interface PricingTier { id: string; label: string; price: number }
interface Service {
  id: string; name: string; iconName: string; enabled: boolean
  description: string; pricing: PricingTier[]; colorClass: string
}

const BLANK: Omit<Service, 'id'> = {
  name: '', iconName: 'Wrench', enabled: true,
  description: '', pricing: [], colorClass: 'bg-blue-50 text-blue-600',
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editService, setEditService] = useState<Service | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null)
  const [form, setForm] = useState<Omit<Service, 'id'>>(BLANK)

  async function load() {
    const res = await fetch('/api/admin/services')
    if (res.ok) setServices(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openEdit(svc: Service) {
    setForm({ name: svc.name, iconName: svc.iconName, enabled: svc.enabled, description: svc.description, pricing: svc.pricing, colorClass: svc.colorClass })
    setIsNew(false)
    setEditService(svc)
  }

  function openAdd() {
    setForm({ ...BLANK })
    setIsNew(true)
    setEditService({ id: '', ...BLANK })
  }

  function closeEdit() { setEditService(null); setIsNew(false) }

  async function saveEdit() {
    if (!editService) return
    setSaving(true)
    if (isNew) {
      const res = await fetch('/api/admin/services', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) { const svc = await res.json(); setServices((s) => [...s, svc]) }
    } else {
      const res = await fetch(`/api/admin/services/${editService.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) { const svc = await res.json(); setServices((s) => s.map((x) => x.id === svc.id ? svc : x)) }
    }
    setSaving(false)
    closeEdit()
  }

  async function toggleEnabled(svc: Service) {
    const res = await fetch(`/api/admin/services/${svc.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !svc.enabled }),
    })
    if (res.ok) { const updated = await res.json(); setServices((s) => s.map((x) => x.id === updated.id ? updated : x)) }
  }

  async function doDelete() {
    if (!confirmDelete) return
    const res = await fetch(`/api/admin/services/${confirmDelete.id}`, { method: 'DELETE' })
    if (res.ok) setServices((s) => s.filter((x) => x.id !== confirmDelete.id))
    setConfirmDelete(null)
  }

  function addPriceRow() {
    setForm((f) => ({ ...f, pricing: [...f.pricing, { id: Math.random().toString(36).slice(2), label: '', price: 0 }] }))
  }
  function removePriceRow(id: string) {
    setForm((f) => ({ ...f, pricing: f.pricing.filter((p) => p.id !== id) }))
  }
  function updatePriceRow(id: string, key: 'label' | 'price', value: string | number) {
    setForm((f) => ({ ...f, pricing: f.pricing.map((p) => p.id === id ? { ...p, [key]: value } : p) }))
  }

  if (loading) return <div className="text-sm text-slate-500 p-4">Loading services…</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage services shown on the public website</p>
        <button onClick={openAdd} className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Service
        </button>
      </div>

      <div className="space-y-3">
        {services.map((service) => {
          const Icon = ICON_MAP[service.iconName] || Wrench
          return (
            <div key={service.id} className={cn('card p-5 transition-opacity', !service.enabled && 'opacity-60')}>
              <div className="flex items-start gap-4">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', service.colorClass)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{service.name}</h3>
                    {!service.enabled && <span className="badge bg-slate-100 text-slate-500 text-xs">Disabled</span>}
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.pricing.map((p) => (
                      <span key={p.id} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700">
                        {p.label}: <strong>{formatCurrency(p.price)}</strong>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(service)} className="inline-flex items-center gap-1 px-2 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-medium rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setConfirmDelete(service)} className="inline-flex items-center gap-1 px-2 py-1.5 text-red-400 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => toggleEnabled(service)}
                    className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors', service.enabled ? 'text-brand-600 hover:bg-brand-50' : 'text-slate-500 hover:bg-slate-100')}>
                    {service.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {service.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editService && (
        <AdminModal open={!!editService} onClose={closeEdit} title={isNew ? 'Add Service' : `Edit — ${editService.name}`} size="lg"
          footer={
            <>
              <button onClick={closeEdit} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Service'}
              </button>
            </>
          }>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Service Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input text-sm" placeholder="e.g. Airport Transfer" />
              </div>
              <div>
                <label className="label">Icon</label>
                <select value={form.iconName} onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))} className="input text-sm">
                  {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input resize-none text-sm" placeholder="Short description shown on website" />
            </div>
            <div>
              <label className="label">Color Theme</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button key={c.value} onClick={() => setForm((f) => ({ ...f, colorClass: c.value }))}
                    className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border-2', c.value, form.colorClass === c.value ? 'border-current' : 'border-transparent opacity-70')}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Pricing Options</label>
                <button onClick={addPriceRow} className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium">
                  <Plus className="w-3.5 h-3.5" /> Add tier
                </button>
              </div>
              <div className="space-y-2">
                {form.pricing.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <input type="text" value={p.label} onChange={(e) => updatePriceRow(p.id, 'label', e.target.value)} className="input text-sm flex-1" placeholder="e.g. Sedan (3 pax)" />
                    <div className="relative w-28">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">£</span>
                      <input type="number" value={p.price} onChange={(e) => updatePriceRow(p.id, 'price', Number(e.target.value))} className="input text-sm pl-7 w-full" min={0} />
                    </div>
                    <button onClick={() => removePriceRow(p.id)} className="p-1.5 rounded text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {form.pricing.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-3 border border-dashed border-slate-200 rounded-lg">No pricing tiers yet — click Add tier above</p>
                )}
              </div>
            </div>
            <div>
              <label className="label">Enabled</label>
              <button onClick={() => setForm((f) => ({ ...f, enabled: !f.enabled }))}
                className={cn('flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors', form.enabled ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-500')}>
                {form.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {form.enabled ? 'Enabled — visible on website' : 'Disabled — hidden from website'}
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {confirmDelete && (
        <AdminModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Service" size="sm"
          footer={
            <>
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={doDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">Delete</button>
            </>
          }>
          <p className="text-sm text-slate-600">Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This cannot be undone.</p>
        </AdminModal>
      )}
    </div>
  )
}
