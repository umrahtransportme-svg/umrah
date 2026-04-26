'use client'

import { useState, useMemo } from 'react'
import { Search, CreditCard, TrendingUp, RefreshCw } from 'lucide-react'
import AdminPagination from '@/components/admin/ui/Pagination'
import { MOCK_PAYMENTS } from '@/lib/admin/mock-data'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDateTime, PAYMENT_COLORS } from '@/lib/admin/utils'
import type { PaymentStatus } from '@/lib/admin/types'

const PER_PAGE = 8
const METHOD_LABELS: Record<string, string> = { bank_transfer: 'Bank Transfer', card: 'Card', cash: 'Cash', stripe: 'Stripe' }

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let data = [...MOCK_PAYMENTS]
    if (statusFilter !== 'all') data = data.filter((p) => p.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter((p) => p.bookingReference.toLowerCase().includes(q) || p.customerName.toLowerCase().includes(q))
    }
    return data
  }, [search, statusFilter])

  const totalRevenue = MOCK_PAYMENTS.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalRefunded = MOCK_PAYMENTS.filter((p) => p.status === 'refunded').reduce((s, p) => s + p.amount, 0)
  const total = filtered.length
  const totalPages = Math.ceil(total / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: <TrendingUp className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Total Transactions', value: MOCK_PAYMENTS.filter((p) => p.status === 'paid').length, icon: <CreditCard className="w-5 h-5 text-brand-600" />, bg: 'bg-brand-50' },
          { label: 'Total Refunded', value: formatCurrency(totalRefunded), icon: <RefreshCw className="w-5 h-5 text-red-500" />, bg: 'bg-red-50' },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', s.bg)}>{s.icon}</div>
            <div><p className="text-xs text-slate-500">{s.label}</p><p className="text-xl font-bold text-slate-900">{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="search" placeholder="Search reference or customer..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="input pl-9 text-sm" />
        </div>
        <div className="flex gap-1">
          {(['all', 'paid', 'unpaid', 'partial', 'refunded'] as const).map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', statusFilter === s ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>{s}</button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><th className="table-th">Booking Ref</th><th className="table-th">Customer</th><th className="table-th hidden md:table-cell">Method</th><th className="table-th">Amount</th><th className="table-th">Status</th><th className="table-th hidden lg:table-cell">Date</th></tr></thead>
            <tbody>
              {paged.map((payment) => {
                const pc = PAYMENT_COLORS[payment.status]
                return (
                  <tr key={payment.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="table-td"><span className="font-mono text-xs font-medium text-slate-700">{payment.bookingReference}</span></td>
                    <td className="table-td"><span className="text-sm font-medium text-slate-900">{payment.customerName}</span></td>
                    <td className="table-td hidden md:table-cell"><span className="text-xs text-slate-600">{METHOD_LABELS[payment.method]}</span></td>
                    <td className="table-td"><span className="text-sm font-bold text-slate-900">{formatCurrency(payment.amount, payment.currency)}</span></td>
                    <td className="table-td"><span className={cn('badge', pc.bg, pc.text)}>{payment.status}</span></td>
                    <td className="table-td hidden lg:table-cell"><span className="text-xs text-slate-500">{formatDateTime(payment.createdAt)}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <AdminPagination page={page} totalPages={totalPages} totalItems={total} pageSize={PER_PAGE} onPageChange={setPage} />
      </div>
    </div>
  )
}
