'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Star, Building2, Car, Users } from 'lucide-react'
import { MOCK_VENDORS } from '@/lib/admin/mock-data'
import { cn } from '@/lib/utils'

const STATUS_STYLE = {
  active:    { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  inactive:  { bg: 'bg-slate-100', text: 'text-slate-600',  dot: 'bg-slate-400' },
  suspended: { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
}

export default function AdminVendorsPage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return MOCK_VENDORS
    const q = search.toLowerCase()
    return MOCK_VENDORS.filter((v) => v.companyName.toLowerCase().includes(q) || v.contactName.toLowerCase().includes(q) || v.city.toLowerCase().includes(q))
  }, [search])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="search" placeholder="Search company, contact, city..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 text-sm" />
        </div>
        <button className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((vendor) => {
          const st = STATUS_STYLE[vendor.status]
          return (
            <div key={vendor.id} className="card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0"><Building2 className="w-5 h-5 text-brand-600" /></div>
                  <div><div className="font-bold text-slate-900">{vendor.companyName}</div><div className="text-xs text-slate-500">{vendor.contactName} · {vendor.city}, {vendor.country}</div></div>
                </div>
                <span className={cn('badge', st.bg, st.text)}><span className={cn('w-1.5 h-1.5 rounded-full', st.dot)} />{vendor.status}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[{ label: 'Vehicles', value: vendor.vehicles, icon: <Car className="w-3 h-3" /> }, { label: 'Drivers', value: vendor.drivers, icon: <Users className="w-3 h-3" /> }, { label: 'Rating', value: vendor.rating, icon: <Star className="w-3 h-3" /> }, { label: 'Commission', value: `${vendor.commissionRate}%`, icon: null }].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-lg p-2">
                    <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">{s.icon}<span className="text-xs">{s.label}</span></div>
                    <div className="text-sm font-bold text-slate-900">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1 border-t border-slate-100">
                <div className="flex-1"><div className="text-xs text-slate-500">{vendor.email}</div><div className="text-xs text-slate-500">{vendor.phone}</div></div>
                <div className="flex gap-1">
                  <button className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Edit</button>
                  <button className="inline-flex items-center px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-medium rounded-lg transition-colors">View</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
