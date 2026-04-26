import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react'
import AdminRevenueChart from '@/components/admin/charts/RevenueChart'
import AdminServicePieChart from '@/components/admin/charts/ServicePieChart'
import { MOCK_REVENUE_DATA, MOCK_SERVICE_BREAKDOWN, MOCK_BOOKINGS } from '@/lib/admin/mock-data'
import { formatCurrency, SERVICE_LABELS } from '@/lib/admin/utils'

const COUNTRY_STATS = [
  { country: 'United Kingdom', bookings: 118, revenue: 8940 },
  { country: 'United States', bookings: 52, revenue: 4160 },
  { country: 'Canada', bookings: 38, revenue: 3040 },
  { country: 'Australia', bookings: 29, revenue: 2320 },
  { country: 'Other', bookings: 10, revenue: 800 },
]

export default function AdminReportsPage() {
  const completedBookings = MOCK_BOOKINGS.filter((b) => b.status === 'completed').length
  const totalRevenue = MOCK_REVENUE_DATA[MOCK_REVENUE_DATA.length - 1].revenue

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Analytics and performance reports</p>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-slate-400" />
        {['Last 7 days', 'Last 30 days', 'Last 6 months', 'This year'].map((r) => (
          <button key={r} className={r === 'Last 6 months' ? 'px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 text-white' : 'px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}>{r}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), change: '+8.3%', icon: <TrendingUp className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Total Bookings', value: 247, change: '+12.5%', icon: <Calendar className="w-5 h-5 text-brand-600" />, bg: 'bg-brand-50' },
          { label: 'Completed', value: completedBookings, change: '+5%', icon: <BarChart3 className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
          { label: 'Avg Value', value: '£87', change: '-2%', icon: <TrendingUp className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.bg}`}>{kpi.icon}</div>
              <span className={`text-xs font-medium ${kpi.change.startsWith('+') ? 'text-green-700' : 'text-red-600'}`}>{kpi.change}</span>
            </div>
            <div className="text-xl font-bold text-slate-900">{kpi.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2"><h2 className="font-bold text-slate-900 mb-4">Revenue & Bookings Trend</h2><AdminRevenueChart data={MOCK_REVENUE_DATA} /></div>
        <div className="card p-5"><h2 className="font-bold text-slate-900 mb-4">Service Mix</h2><AdminServicePieChart data={MOCK_SERVICE_BREAKDOWN} /></div>
      </div>

      <div className="card p-5">
        <h2 className="font-bold text-slate-900 mb-4">Top Markets</h2>
        <div className="space-y-3">
          {COUNTRY_STATS.map((c, i) => {
            const pct = (c.bookings / 247) * 100
            return (
              <div key={c.country} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">{c.country}</span>
                    <div className="text-xs text-slate-500 text-right"><span className="font-medium text-slate-700">{c.bookings} bookings</span><span className="mx-1">·</span><span>{formatCurrency(c.revenue)}</span></div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
