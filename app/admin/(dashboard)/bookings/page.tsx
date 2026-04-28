'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Eye, Edit2, Trash2, MapPin, Calendar, Users, Car, Save } from 'lucide-react'
import AdminModal from '@/components/admin/ui/Modal'
import AdminPagination from '@/components/admin/ui/Pagination'
import AdminEmptyState from '@/components/admin/ui/EmptyState'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/lib/admin/utils'

interface Booking {
  id: string; reference: string; status: string
  serviceType: string; pickupLocation: string; dropoffLocation: string
  travelDate: string; passengers: number; vehicleType: string
  customerName: string; customerEmail: string; customerWhatsapp: string; customerCountry: string
  totalAmount: number; driverId?: string; notes?: string
  createdAt: string; updatedAt: string
}

const STATUSES = [
  { label: 'All',         value: 'all' },
  { label: 'Pending',     value: 'pending' },
  { label: 'Confirmed',   value: 'confirmed' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',   value: 'completed' },
  { label: 'Cancelled',   value: 'cancelled' },
]

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending:     { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  confirmed:   { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  in_progress: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
  completed:   { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400' },
  cancelled:   { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-400' },
}

const PER_PAGE = 8

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [viewBooking, setViewBooking] = useState<Booking | null>(null)
  const [editBooking, setEditBooking] = useState<Booking | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Booking | null>(null)
  const [editForm, setEditForm] = useState<Partial<Booking>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page), limit: String(PER_PAGE),
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      ...(search ? { search } : {}),
    })
    const res = await fetch(`/api/admin/bookings?${params}`)
    if (res.ok) {
      const data = await res.json()
      setBookings(data.data)
      setTotal(data.total)
    }
    setLoading(false)
  }, [page, statusFilter, search])

  useEffect(() => { load() }, [load])

  function openEdit(b: Booking) { setEditForm({ ...b }); setEditBooking(b) }

  async function saveEdit() {
    if (!editBooking) return
    setSaving(true)
    const res = await fetch(`/api/admin/bookings/${editBooking.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: editForm.status, totalAmount: editForm.totalAmount, notes: editForm.notes }),
    })
    if (res.ok) { await load() }
    setSaving(false)
    setEditBooking(null)
  }

  async function doDelete() {
    if (!confirmDelete) return
    await fetch(`/api/admin/bookings/${confirmDelete.id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    await load()
  }

  const totalPages = Math.ceil(total / PER_PAGE)
  const sc = (status: string) => STATUS_COLORS[status] ?? STATUS_COLORS.pending

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="search" placeholder="Search reference or name…"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="input pl-9 text-sm" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div className="flex gap-1 overflow-x-auto">
            {STATUSES.map((s) => (
              <button key={s.value} onClick={() => { setStatusFilter(s.value); setPage(1) }}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors', statusFilter === s.value ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading bookings…</div>
        ) : bookings.length === 0 ? (
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
                    <th className="table-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const color = sc(booking.status)
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="table-td"><span className="font-mono text-xs font-medium text-slate-700">{booking.reference}</span></td>
                        <td className="table-td">
                          <div className="font-medium text-slate-900 text-xs">{booking.customerName}</div>
                          <div className="text-xs text-slate-400">{booking.customerCountry}</div>
                        </td>
                        <td className="table-td hidden md:table-cell">
                          <div className="text-xs text-slate-700">{booking.serviceType}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Car className="w-3 h-3 text-slate-400" /><span className="text-xs text-slate-400">{booking.vehicleType}</span>
                            <Users className="w-3 h-3 text-slate-400 ml-1" /><span className="text-xs text-slate-400">{booking.passengers}</span>
                          </div>
                        </td>
                        <td className="table-td hidden lg:table-cell">
                          <div className="text-xs text-slate-700">{formatDate(booking.travelDate)}</div>
                        </td>
                        <td className="table-td"><span className="text-sm font-semibold text-slate-900">{formatCurrency(booking.totalAmount)}</span></td>
                        <td className="table-td">
                          <span className={cn('badge', color.bg, color.text)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', color.dot)} />
                            {booking.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="table-td">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setViewBooking(booking)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                            <button onClick={() => openEdit(booking)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setConfirmDelete(booking)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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

      {/* View modal */}
      {viewBooking && (
        <AdminModal open onClose={() => setViewBooking(null)} title={`Booking — ${viewBooking.reference}`} size="lg"
          footer={<>
            <button onClick={() => setViewBooking(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Close</button>
            <button onClick={() => { setViewBooking(null); openEdit(viewBooking) }} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
          </>}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="label">Status</p><span className={cn('badge', sc(viewBooking.status).bg, sc(viewBooking.status).text)}><span className={cn('w-1.5 h-1.5 rounded-full', sc(viewBooking.status).dot)} />{viewBooking.status.replace(/_/g, ' ')}</span></div>
              <div><p className="label">Amount</p><p className="text-sm font-semibold text-slate-900">{formatCurrency(viewBooking.totalAmount)}</p></div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Customer</p>
              <div className="grid grid-cols-2 gap-3">
                {([['Name', viewBooking.customerName], ['Email', viewBooking.customerEmail], ['WhatsApp', viewBooking.customerWhatsapp], ['Country', viewBooking.customerCountry]] as [string, string][]).map(([k, v]) => (
                  <div key={k}><p className="label">{k}</p><p className="text-sm text-slate-900">{v}</p></div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Journey</p>
              <div className="grid grid-cols-2 gap-3">
                {([['Service', viewBooking.serviceType], ['Vehicle', viewBooking.vehicleType], ['Passengers', String(viewBooking.passengers)], ['Date', formatDate(viewBooking.travelDate)]] as [string, string][]).map(([k, v]) => (
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
            {viewBooking.notes && (
              <div className="border-t border-slate-100 pt-4">
                <p className="label">Notes</p><p className="text-sm text-slate-700">{viewBooking.notes}</p>
              </div>
            )}
          </div>
        </AdminModal>
      )}

      {/* Edit modal */}
      {editBooking && (
        <AdminModal open onClose={() => setEditBooking(null)} title={`Edit — ${editBooking.reference}`} size="lg"
          footer={<>
            <button onClick={() => setEditBooking(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={saveEdit} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-60"><Save className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save Changes'}</button>
          </>}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Booking Status</label>
                <select value={editForm.status || ''} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))} className="input text-sm">
                  {(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as string[]).map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Total Amount (£)</label>
                <input type="number" value={editForm.totalAmount ?? 0} onChange={(e) => setEditForm((f) => ({ ...f, totalAmount: Number(e.target.value) }))} className="input text-sm" min={0} />
              </div>
            </div>
            <div>
              <label className="label">Internal Notes</label>
              <textarea rows={2} value={editForm.notes || ''} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} className="input resize-none text-sm" placeholder="Internal notes (not visible to customer)" />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <AdminModal open onClose={() => setConfirmDelete(null)} title="Delete Booking" size="sm"
          footer={<>
            <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">Delete</button>
          </>}>
          <p className="text-sm text-slate-600">Delete booking <strong>{confirmDelete.reference}</strong> for <strong>{confirmDelete.customerName}</strong>? This cannot be undone.</p>
        </AdminModal>
      )}
    </div>
  )
}
