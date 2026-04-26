import {
  CalendarCheck, PoundSterling, Users, Clock,
  CheckCircle2, XCircle, ArrowRight, Star,
} from 'lucide-react'
import Link from 'next/link'
import AdminStatCard from '@/components/admin/ui/StatCard'
import AdminRevenueChart from '@/components/admin/charts/RevenueChart'
import AdminServicePieChart from '@/components/admin/charts/ServicePieChart'
import {
  MOCK_STATS, MOCK_REVENUE_DATA, MOCK_SERVICE_BREAKDOWN, MOCK_ACTIVITY, MOCK_BOOKINGS,
} from '@/lib/admin/mock-data'
import { formatCurrency, formatDateTime, timeAgo, SERVICE_LABELS, STATUS_COLORS } from '@/lib/admin/utils'
import type { ActivityItem } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

const ACTIVITY_ICONS: Record<ActivityItem['type'], React.ReactNode> = {
  booking:  <CalendarCheck className="w-4 h-4 text-brand-600" />,
  payment:  <PoundSterling className="w-4 h-4 text-green-600" />,
  driver:   <Users className="w-4 h-4 text-purple-600" />,
  review:   <Star className="w-4 h-4 text-amber-500" />,
  system:   <Clock className="w-4 h-4 text-slate-500" />,
}

export default function AdminDashboardPage() {
  const recentBookings = MOCK_BOOKINGS.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard title="Total Bookings" value={MOCK_STATS.totalBookings} change={MOCK_STATS.bookingsChange} icon={<CalendarCheck className="w-5 h-5 text-brand-600" />} iconBg="bg-brand-50" />
        <AdminStatCard title="Total Revenue" value={formatCurrency(MOCK_STATS.totalRevenue)} change={MOCK_STATS.revenueChange} icon={<PoundSterling className="w-5 h-5 text-green-600" />} iconBg="bg-green-50" />
        <AdminStatCard title="Active Drivers" value={MOCK_STATS.activeDrivers} change={MOCK_STATS.driversChange} icon={<Users className="w-5 h-5 text-purple-600" />} iconBg="bg-purple-50" />
        <AdminStatCard title="Pending Bookings" value={MOCK_STATS.pendingBookings} change={MOCK_STATS.pendingChange} changeLabel="vs yesterday" icon={<Clock className="w-5 h-5 text-amber-600" />} iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-slate-900">Revenue & Bookings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
            </div>
          </div>
          <AdminRevenueChart data={MOCK_REVENUE_DATA} />
        </div>
        <div className="card p-5">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">Service Breakdown</h2>
            <p className="text-xs text-slate-500 mt-0.5">By booking count</p>
          </div>
          <AdminServicePieChart data={MOCK_SERVICE_BREAKDOWN} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Reference</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th hidden md:table-cell">Service</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => {
                  const colors = STATUS_COLORS[booking.status]
                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="table-td"><span className="font-mono text-xs text-slate-600">{booking.reference}</span></td>
                      <td className="table-td">
                        <div className="font-medium text-slate-900 text-xs">{booking.customerName}</div>
                        <div className="text-xs text-slate-400">{booking.customerCountry}</div>
                      </td>
                      <td className="table-td hidden md:table-cell"><span className="text-xs text-slate-600">{SERVICE_LABELS[booking.serviceType]}</span></td>
                      <td className="table-td"><span className="text-xs font-semibold text-slate-900">{formatCurrency(booking.totalAmount, booking.currency)}</span></td>
                      <td className="table-td">
                        <span className={cn('badge text-xs', colors.bg, colors.text)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {MOCK_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                  {ACTIVITY_ICONS[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{item.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{timeAgo(item.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Completed today', value: '3', icon: <CheckCircle2 className="w-4 h-4 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Cancelled this week', value: '1', icon: <XCircle className="w-4 h-4 text-red-500" />, bg: 'bg-red-50' },
          { label: 'Avg booking value', value: '£87', icon: <PoundSterling className="w-4 h-4 text-brand-600" />, bg: 'bg-brand-50' },
          { label: 'Avg rating', value: '4.9★', icon: <Star className="w-4 h-4 text-amber-500" />, bg: 'bg-amber-50' },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', s.bg)}>{s.icon}</div>
            <div>
              <div className="text-lg font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
