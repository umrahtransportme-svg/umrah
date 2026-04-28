'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, CreditCard, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  pending:   { bg: 'bg-amber-50',  text: 'text-amber-700' },
  confirmed: { bg: 'bg-blue-50',   text: 'text-blue-700' },
  completed: { bg: 'bg-green-50',  text: 'text-green-700' },
  cancelled: { bg: 'bg-red-50',    text: 'text-red-700' },
}

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState<{ companyName: string; commissionRate: number; payoutSchedule: string; payoutDay: number } | null>(null)
  const [bookings, setBookings] = useState<{ id: string; reference: string; status: string; customerName: string; serviceType: string; travelDate: string; totalAmount: number; vendorAmount: number }[]>([])
  const [payments, setPayments] = useState<{ totalPaid: number; pendingEarnings: number }>({ totalPaid: 0, pendingEarnings: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/vendor/me').then((r) => r.json()),
      fetch('/api/vendor/bookings').then((r) => r.json()),
      fetch('/api/vendor/payments').then((r) => r.json()),
    ]).then(([v, b, p]) => { setVendor(v); setBookings(b); setPayments(p) })
  }, [])

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Payout', value: `£${payments.pendingEarnings.toFixed(2)}`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Earned', value: `£${payments.totalPaid.toFixed(2)}`, icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Completed Rides', value: bookings.filter((b) => b.status === 'completed').length, icon: CheckCircle2, color: 'text-brand-600', bg: 'bg-brand-50' },
  ]

  const scheduleLabel = vendor ? `${vendor.payoutSchedule === 'weekly' ? `Every week (day ${vendor.payoutDay})` : `Monthly (day ${vendor.payoutDay})`}` : '—'

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Welcome back{vendor ? `, ${vendor.companyName}` : ''}</h1>
        <p className="text-sm text-slate-500 mt-0.5">Here&apos;s an overview of your account</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg)}>
              <s.icon className={cn('w-4.5 h-4.5', s.color)} />
            </div>
            <div className="text-xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Payout schedule banner */}
      {vendor && (
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-brand-900">Payout schedule: {scheduleLabel}</p>
            <p className="text-xs text-brand-600 mt-0.5">Commission rate: {vendor.commissionRate}% platform fee · you receive {100 - vendor.commissionRate}%</p>
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900 text-sm">Recent Bookings</h2>
        </div>
        {bookings.length === 0 ? (
          <div className="py-12 text-center">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No bookings assigned yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {bookings.slice(0, 8).map((b) => {
              const s = STATUS_STYLE[b.status] || STATUS_STYLE.pending
              return (
                <div key={b.id} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{b.reference}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', s.bg, s.text)}>{b.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{b.customerName} · {b.serviceType} · {b.travelDate}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-slate-900">£{b.vendorAmount.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">your share</div>
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
