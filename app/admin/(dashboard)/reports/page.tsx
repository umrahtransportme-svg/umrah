'use client'

import { useEffect, useState, useCallback } from 'react'
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react'
import AdminRevenueChart from '@/components/admin/charts/RevenueChart'
import AdminServicePieChart from '@/components/admin/charts/ServicePieChart'
import { formatCurrency } from '@/lib/admin/utils'

type Range = '7d' | '30d' | '6m' | '1y'

const RANGE_LABELS: Record<Range, string> = {
  '7d':  'Last 7 days',
  '30d': 'Last 30 days',
  '6m':  'Last 6 months',
  '1y':  'This year',
}

interface ReportsData {
  stats: {
    totalRevenue: number
    totalBookings: number
    completedBookings: number
    cancelledBookings: number
    avgBookingValue: number
    totalVendorPayouts: number
  }
  monthlyData: Array<{ month: string; revenue: number; bookings: number }>
  serviceBreakdown: Array<{ name: string; count: number; revenue: number; color: string }>
  countryBreakdown: Array<{ country: string; bookings: number; revenue: number }>
  recentTransactions: Array<{
    id: string
    reference: string
    customerName: string
    customerCountry: string
    serviceType: string
    totalAmount: number
    status: string
    createdAt: string
  }>
}

function ReportsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-48 bg-slate-100 rounded" />
        <div className="h-8 w-28 bg-slate-100 rounded-lg" />
      </div>
      <div className="flex items-center gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-slate-100 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 h-24 bg-slate-50" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2 h-72 bg-slate-50" />
        <div className="card p-5 h-72 bg-slate-50" />
      </div>
      <div className="card p-5 h-48 bg-slate-50" />
    </div>
  )
}

export default function AdminReportsPage() {
  const [range, setRange]     = useState<Range>('30d')
  const [data, setData]       = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const [exporting, setExporting] = useState(false)

  const fetchReports = useCallback(async (r: Range) => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/admin/reports?range=${r}`, {
        headers: { 'x-user-id': 'admin' },
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Failed to fetch reports')
      const json = await res.json()
      setData(json)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports(range)
  }, [range, fetchReports])

  async function handleExportCsv() {
    setExporting(true)
    try {
      const res = await fetch(`/api/admin/reports?range=${range}&format=csv`, {
        headers: { 'x-user-id': 'admin' },
      })
      if (!res.ok) throw new Error('Export failed')
      const blob  = await res.blob()
      const url   = URL.createObjectURL(blob)
      const a     = document.createElement('a')
      const cd    = res.headers.get('Content-Disposition') ?? ''
      const match = cd.match(/filename="(.+?)"/)
      a.href      = url
      a.download  = match ? match[1] : `bookings-${range}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // silently fail — could show a toast in a future iteration
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <ReportsSkeleton />

  if (error || !data) {
    return (
      <div className="card p-10 text-center">
        <p className="text-slate-500 font-medium">Could not load reports data.</p>
        <p className="text-xs text-slate-400 mt-1">Please refresh the page or try again later.</p>
      </div>
    )
  }

  const { stats, monthlyData, serviceBreakdown, countryBreakdown } = data
  const totalBookingsForPct = stats.totalBookings || 1

  // Shape service breakdown for the pie chart (expects { name, value, color })
  const pieData = serviceBreakdown.map((s) => ({
    name:  s.name,
    value: s.count,
    color: s.color,
  }))

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Analytics and performance reports</p>
        <button
          onClick={handleExportCsv}
          disabled={exporting}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5" />
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {/* Range selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
        {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={
              r === range
                ? 'px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 text-white'
                : 'px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors'
            }
          >
            {RANGE_LABELS[r]}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: formatCurrency(stats.totalRevenue),
            change: null as string | null,
            icon: <TrendingUp className="w-5 h-5 text-green-600" />,
            bg: 'bg-green-50',
          },
          {
            label: 'Total Bookings',
            value: stats.totalBookings,
            change: null as string | null,
            icon: <Calendar className="w-5 h-5 text-brand-600" />,
            bg: 'bg-brand-50',
          },
          {
            label: 'Completed',
            value: stats.completedBookings,
            change: null as string | null,
            icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
            bg: 'bg-purple-50',
          },
          {
            label: 'Avg Value',
            value: formatCurrency(stats.avgBookingValue),
            change: null as string | null,
            icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
            bg: 'bg-amber-50',
          },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                {kpi.icon}
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900">{kpi.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2">
          <h2 className="font-bold text-slate-900 mb-4">Revenue & Bookings Trend</h2>
          <AdminRevenueChart data={monthlyData} />
        </div>
        <div className="card p-5">
          <h2 className="font-bold text-slate-900 mb-4">Service Mix</h2>
          {pieData.length > 0
            ? <AdminServicePieChart data={pieData} />
            : <p className="text-xs text-slate-400 mt-8 text-center">No data for this period</p>
          }
        </div>
      </div>

      {/* Top markets */}
      <div className="card p-5">
        <h2 className="font-bold text-slate-900 mb-4">Top Markets</h2>
        {countryBreakdown.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No bookings in this period</p>
        ) : (
          <div className="space-y-3">
            {countryBreakdown.map((c, i) => {
              const pct = (c.bookings / totalBookingsForPct) * 100
              return (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{c.country}</span>
                      <div className="text-xs text-slate-500 text-right">
                        <span className="font-medium text-slate-700">{c.bookings} bookings</span>
                        <span className="mx-1">·</span>
                        <span>{formatCurrency(c.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
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
