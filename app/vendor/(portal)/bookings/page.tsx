'use client'

import { useEffect, useState } from 'react'
import { Search, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  pending:   { bg: 'bg-amber-50',  text: 'text-amber-700' },
  confirmed: { bg: 'bg-blue-50',   text: 'text-blue-700' },
  completed: { bg: 'bg-green-50',  text: 'text-green-700' },
  cancelled: { bg: 'bg-red-50',    text: 'text-red-700' },
}

type Booking = { id: string; reference: string; status: string; serviceType: string; customerName: string; customerEmail: string; pickupLocation: string; dropoffLocation: string; travelDate: string; passengers: number; vehicleType: string; totalAmount: number; vendorAmount: number; notes: string | null }

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/vendor/bookings').then((r) => r.json()).then(setBookings)
  }, [])

  const filtered = bookings.filter((b) => {
    const matchFilter = filter === 'all' || b.status === filter
    const q = search.toLowerCase()
    const matchSearch = !search || b.reference.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q) || b.serviceType.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  return (
    <div className="space-y-4 max-w-5xl">
      <h1 className="text-xl font-bold text-slate-900">My Bookings</h1>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', filter === s ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
            {s}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input type="search" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 w-44" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No bookings found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((b) => {
              const s = STATUS_STYLE[b.status] || STATUS_STYLE.pending
              return (
                <div key={b.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{b.reference}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', s.bg, s.text)}>{b.status}</span>
                      </div>
                      <p className="text-sm text-slate-700 font-medium">{b.customerName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{b.serviceType} · {b.vehicleType} · {b.passengers} pax</p>
                      <p className="text-xs text-slate-500 mt-1">📍 {b.pickupLocation} → {b.dropoffLocation}</p>
                      <p className="text-xs text-slate-500">📅 {b.travelDate}</p>
                      {b.notes && <p className="text-xs text-slate-400 mt-1 italic">Note: {b.notes}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold text-slate-900">£{b.vendorAmount.toFixed(2)}</div>
                      <div className="text-xs text-slate-400">your share</div>
                      <div className="text-xs text-slate-300 mt-0.5">Total: £{b.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
