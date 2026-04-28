'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  pending:    { bg: 'bg-amber-50',  text: 'text-amber-700' },
  processing: { bg: 'bg-blue-50',   text: 'text-blue-700' },
  paid:       { bg: 'bg-green-50',  text: 'text-green-700' },
  failed:     { bg: 'bg-red-50',    text: 'text-red-700' },
}

type Payout = { id: string; amount: number; currency: string; status: string; method: string; period: string | null; reference: string | null; paidAt: string | null; createdAt: string; notes: string | null }

export default function VendorPaymentsPage() {
  const [data, setData] = useState<{ payouts: Payout[]; totalPaid: number; pendingEarnings: number } | null>(null)

  useEffect(() => {
    fetch('/api/vendor/payments').then((r) => r.json()).then(setData)
  }, [])

  if (!data) return <div className="text-sm text-slate-500">Loading...</div>

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-bold text-slate-900">Payments & Payouts</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">£{data.pendingEarnings.toFixed(2)}</div>
          <div className="text-xs text-slate-500 mt-0.5">Pending earnings</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">£{data.totalPaid.toFixed(2)}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total paid out</div>
        </div>
      </div>

      {/* Payout history */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-900 text-sm">Payout History</h2>
        </div>
        {data.payouts.length === 0 ? (
          <div className="py-14 text-center">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No payouts yet</p>
            <p className="text-xs text-slate-400 mt-1">Payouts appear here once processed by admin</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {data.payouts.map((p) => {
              const s = STATUS_STYLE[p.status] || STATUS_STYLE.pending
              return (
                <div key={p.id} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', s.bg, s.text)}>{p.status}</span>
                      <span className="text-xs text-slate-500 capitalize">{p.method}</span>
                      {p.period && <span className="text-xs text-slate-400">· {p.period}</span>}
                    </div>
                    {p.reference && <p className="text-xs text-slate-400 mt-0.5">Ref: {p.reference}</p>}
                    <p className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString()}{p.paidAt ? ` · Paid ${new Date(p.paidAt).toLocaleDateString()}` : ''}</p>
                    {p.notes && <p className="text-xs text-slate-400 italic">{p.notes}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-bold text-slate-900">£{p.amount.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">{p.currency}</div>
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
