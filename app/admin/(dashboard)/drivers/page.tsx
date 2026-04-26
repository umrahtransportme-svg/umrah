'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Star, Phone } from 'lucide-react'
import { MOCK_DRIVERS } from '@/lib/admin/mock-data'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/admin/utils'

const STATUS_STYLE = {
  available:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  on_trip:    { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  off_duty:   { bg: 'bg-slate-100', text: 'text-slate-600',  dot: 'bg-slate-400' },
  suspended:  { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500' },
}

export default function AdminDriversPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    let data = [...MOCK_DRIVERS]
    if (statusFilter !== 'all') data = data.filter((d) => d.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((d) => d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) || d.phone.includes(q))
    }
    return data
  }, [search, statusFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="search" placeholder="Search name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 text-sm" />
        </div>
        <div className="flex gap-1">
          {['all', 'available', 'on_trip', 'off_duty', 'suspended'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', statusFilter === s ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors flex-shrink-0">
          <Plus className="w-3.5 h-3.5" /> Add Driver
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead><tr><th className="table-th">Driver</th><th className="table-th hidden md:table-cell">Contact</th><th className="table-th hidden lg:table-cell">Languages</th><th className="table-th">Rating</th><th className="table-th hidden sm:table-cell">Trips</th><th className="table-th">Status</th><th className="table-th hidden lg:table-cell">License Expiry</th><th className="table-th text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map((driver) => {
              const st = STATUS_STYLE[driver.status]
              return (
                <tr key={driver.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm flex-shrink-0">{driver.name[0]}</div>
                      <div><div className="text-sm font-medium text-slate-900">{driver.name}</div><div className="text-xs text-slate-400">{driver.nationality}</div></div>
                    </div>
                  </td>
                  <td className="table-td hidden md:table-cell">
                    <div className="text-xs text-slate-700">{driver.email}</div>
                    <div className="flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-slate-400" /><span className="text-xs text-slate-500">{driver.phone}</span></div>
                  </td>
                  <td className="table-td hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">{driver.languages.map((l) => (<span key={l} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">{l}</span>))}</div>
                  </td>
                  <td className="table-td"><div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /><span className="text-sm font-semibold text-slate-900">{driver.rating}</span></div></td>
                  <td className="table-td hidden sm:table-cell"><span className="text-sm text-slate-700">{driver.totalTrips}</span></td>
                  <td className="table-td"><span className={cn('badge', st.bg, st.text)}><span className={cn('w-1.5 h-1.5 rounded-full', st.dot)} />{driver.status.replace('_', ' ')}</span></td>
                  <td className="table-td hidden lg:table-cell"><span className="text-xs text-slate-600">{formatDate(driver.licenseExpiry)}</span></td>
                  <td className="table-td"><div className="flex items-center justify-end gap-1"><button className="inline-flex items-center gap-1 px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs font-medium rounded-lg transition-colors">Edit</button><button className="inline-flex items-center gap-1 px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs font-medium rounded-lg transition-colors">Trips</button></div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
