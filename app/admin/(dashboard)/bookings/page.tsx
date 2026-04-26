'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Filter, Eye, Edit2, Trash2, MapPin, Calendar, Users, Car } from 'lucide-react'
import AdminModal from '@/components/admin/ui/Modal'
import AdminPagination from '@/components/admin/ui/Pagination'
import AdminEmptyState from '@/components/admin/ui/EmptyState'
import { MOCK_BOOKINGS } from '@/lib/admin/mock-data'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate, SERVICE_LABELS, VEHICLE_LABELS, STATUS_COLORS, PAYMENT_COLORS } from '@/lib/admin/utils'
import type { Booking, BookingStatus } from '@/lib/admin/types'

const STATUSES: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const PER_PAGE = 8

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [viewBooking, setViewBooking] = useState<Booking | null>(null)

  const filtered = useMemo(() => {
    let data = [...MOCK_BOOKINGS]
    if (statusFilter !== 'all') data = data.filter((b) => b.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((b) => b.reference.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q) || b.customerEmail.toLowerCase().includes(q))
    }
    return data
  }, [search, statusFilter])

  const total = filtered.length
  const totalPages = Math.ceil(total / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="search" placeholder="Search reference, name, email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="input pl-9 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {STATUSES.map((s) => (
              <button key={s.value} onClick={() => { setStatusFilter(s.value); setPage(1) }} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors', statusFilter === s.value ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
                {s.label}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors flex-shrink-0 ml-2">
            <Plus className="w-3.5 h-3.5" /> New Booking
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {paged.length === 0 ? (
          <AdminEmptyState icon={<Calendar className="w-7 h-7" />} title="No bookings found" description="Try adjusting your search or filters" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-th">Reference</th>
                    <th className="table-th">Customer</th>
                    <th className="table-th hidden md:table-cell">Service</th>
                    <th className="table-th hidden lg:table-cell">Date</th>
                    <th className="table-th">Amount</th>
                    <th className="table-th">Status</th>
                    <th className="table-th">Payment</th>
                    <th className="table-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((booking) => {
                    const sc = STATUS_COLORS[booking.status]
                    const pc = PAYMENT_COLORS[booking.paymentStatus]
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="table-td"><span className="font-mono text-xs font-medium text-slate-700">{booking.reference}</span></td>
                        <td className="table-td">
                          <div className="font-medium text-slate-900 text-xs">{booking.customerName}</div>
                          <div className="text-xs text-slate-400">{booking.customerCountry}</div>
                        </td>
                        <td className="table-td hidden md:table-cell">
                          <div className="text-xs text-slate-700">{SERVICE_LABELS[booking.serviceType]}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Car className="w-3 h-3 text-slate-400" /><span className="text-xs text-slate-400">{VEHICLE_LABELS[booking.vehicleType]}</span>
                            <Users className="w-3 h-3 text-slate-400 ml-1" /><span className="text-xs text-slate-400">{booking.passengers}</span>
                          </div>
                        </td>
                        <td className="table-td hidden lg:table-cell">
                          <div className="text-xs text-slate-700">{formatDate(booking.pickupDate)}</div>
                          <div className="text-xs text-slate-400">{booking.pickupTime}</div>
                        </td>
                        <td className="table-td"><span className="text-sm font-semibold text-slate-900">{formatCurrency(booking.totalAmount, booking.currency)}</span></td>
                        <td className="table-td"><span className={cn('badge', sc.bg, sc.text)}><span className={cn('w-1.5 h-1.5 rounded-full', sc.dot)} />{booking.status.replace('_', ' ')}</span></td>
                        <td className="table-td"><span className={cn('badge', pc.bg, pc.text)}>{booking.paymentStatus}</span></td>
                        <td className="table-td">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setViewBooking(booking)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <AdminPagination page={page} totalPages={totalPages} totalItems={total} pageSize={PER_PAGE} onPageChange={setPage} />
          </>
        )}
      </div>

      {viewBooking && (
        <AdminModal open={!!viewBooking} onClose={() => setViewBooking(null)} title={`Booking ${viewBooking.reference}`} size="lg"
          footer={<><button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setViewBooking(null)}>Close</button><button className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /> Edit Booking</button></>}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="label">Status</p><span className={cn('badge', STATUS_COLORS[viewBooking.status].bg, STATUS_COLORS[viewBooking.status].text)}><span className={cn('w-1.5 h-1.5 rounded-full', STATUS_COLORS[viewBooking.status].dot)} />{viewBooking.status.replace('_', ' ')}</span></div>
              <div><p className="label">Payment</p><span className={cn('badge', PAYMENT_COLORS[viewBooking.paymentStatus].bg, PAYMENT_COLORS[viewBooking.paymentStatus].text)}>{viewBooking.paymentStatus}</span></div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Customer</p>
              <div className="grid grid-cols-2 gap-3">
                {[['Name', viewBooking.customerName], ['Email', viewBooking.customerEmail], ['Phone', viewBooking.customerPhone], ['Country', viewBooking.customerCountry]].map(([k, v]) => (
                  <div key={k}><p className="label">{k}</p><p className="text-sm text-slate-900">{v}</p></div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Journey</p>
              <div className="grid grid-cols-2 gap-3">
                {[['Service', SERVICE_LABELS[viewBooking.serviceType]], ['Vehicle', VEHICLE_LABELS[viewBooking.vehicleType]], ['Passengers', String(viewBooking.passengers)], ['Amount', formatCurrency(viewBooking.totalAmount, viewBooking.currency)], ['Date', formatDate(viewBooking.pickupDate)], ['Time', viewBooking.pickupTime]].map(([k, v]) => (
                  <div key={k}><p className="label">{k}</p><p className="text-sm text-slate-900">{v}</p></div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <div className="flex gap-4">
                <div className="flex-1"><div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl"><MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /><div><p className="text-xs text-slate-500">Pickup</p><p className="text-sm font-medium text-slate-900">{viewBooking.pickupLocation}</p></div></div></div>
                <div className="flex-1"><div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl"><MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /><div><p className="text-xs text-slate-500">Drop-off</p><p className="text-sm font-medium text-slate-900">{viewBooking.dropoffLocation}</p></div></div></div>
              </div>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  )
}
