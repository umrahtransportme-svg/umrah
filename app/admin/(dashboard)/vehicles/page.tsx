'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, AlertCircle } from 'lucide-react'
import { MOCK_VEHICLES } from '@/lib/admin/mock-data'
import { cn } from '@/lib/utils'
import { formatDate, VEHICLE_LABELS } from '@/lib/admin/utils'

const STATUS_STYLE = {
  available:   { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  in_use:      { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  maintenance: { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  retired:     { bg: 'bg-slate-100', text: 'text-slate-600',  dot: 'bg-slate-400' },
}

export default function AdminVehiclesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    let data = [...MOCK_VEHICLES]
    if (typeFilter !== 'all') data = data.filter((v) => v.type === typeFilter)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((v) => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.plateNumber.toLowerCase().includes(q))
    }
    return data
  }, [search, typeFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="search" placeholder="Search make, model, plate..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 text-sm" />
        </div>
        <div className="flex gap-1">
          {['all', 'sedan', 'suv', 'minivan'].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', typeFilter === t ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
              {t === 'all' ? 'All' : VEHICLE_LABELS[t as keyof typeof VEHICLE_LABELS]}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors flex-shrink-0">
          <Plus className="w-3.5 h-3.5" /> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((vehicle) => {
          const st = STATUS_STYLE[vehicle.status]
          const insuranceWarning = new Date(vehicle.insuranceExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          return (
            <div key={vehicle.id} className="card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div><div className="font-bold text-slate-900">{vehicle.make} {vehicle.model}</div><div className="text-xs text-slate-500 mt-0.5">{vehicle.year} · {vehicle.color} · {vehicle.plateNumber}</div></div>
                <span className={cn('badge', st.bg, st.text)}><span className={cn('w-1.5 h-1.5 rounded-full', st.dot)} />{vehicle.status.replace('_', ' ')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[{ label: 'Type', value: VEHICLE_LABELS[vehicle.type] }, { label: 'Capacity', value: `${vehicle.capacity} pax` }, { label: 'Mileage', value: `${(vehicle.mileage / 1000).toFixed(0)}k km` }].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-lg p-2"><div className="text-xs text-slate-500">{s.label}</div><div className="text-sm font-semibold text-slate-900 mt-0.5">{s.value}</div></div>
                ))}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Insurance expires</span>
                  <span className={cn('font-medium', insuranceWarning ? 'text-red-600' : 'text-slate-700')}>{insuranceWarning && <AlertCircle className="w-3 h-3 inline mr-1" />}{formatDate(vehicle.insuranceExpiry)}</span>
                </div>
                <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Last service</span><span className="font-medium text-slate-700">{formatDate(vehicle.lastService)}</span></div>
              </div>
              <div className="flex gap-2 pt-1 border-t border-slate-100">
                <button className="inline-flex items-center justify-center flex-1 py-1.5 px-3 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Edit</button>
                <button className="inline-flex items-center justify-center flex-1 py-1.5 px-3 text-slate-600 hover:bg-slate-100 text-xs font-medium rounded-lg transition-colors">View Trips</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
