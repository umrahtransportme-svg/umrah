'use client'

import { useEffect, useState } from 'react'
import {
  CalendarCheck, PoundSterling, Users, Clock,
  CheckCircle2, XCircle, ArrowRight, Star,
} from 'lucide-react'
import Link from 'next/link'
import AdminStatCard from '@/components/admin/ui/StatCard'
import AdminRevenueChart from '@/components/admin/charts/RevenueChart'
import AdminServicePieChart from '@/components/admin/charts/ServicePieChart'
import { formatCurrency, SERVICE_LABELS, STATUS_COLORS } from '@/lib/admin/utils'
import { cn } from '@/lib/utils'

interface RecentBooking {
  id: string
  reference: string
  customerName: string
  customerCountry: string
  serviceType: string
  totalAmount: number
  status: string
  createdAt: string
}

interface StatsData {
  stats: {
    totalBookings: number
    totalRevenue: number
    activeDrivers: number
    pendingBookings: number
    bookingsChange: number
    revenueChange: number
    driversChange: number
    pendingChange: number
    completedToday: number
    avgBookingValue: number
  }
  revenueData: Array<{ month: string; revenue: number; bookings: number }>
  serviceBreakdown: Array<{ name: string; value: number; color: string }>
  recentBookings: RecentBooking[]
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5 h-28">
            <div className="h-10 w-10 rounded-xl bg-slate-100 mb-3" />
            <div className="h-6 w-24 bg-slate-100 rounded mb-1" />
            <div className="h-3 w-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2 h-72 bg-slate-50" />
        <div className="card p-5 h-72 bg-slate-50" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card xl:col-span-2 h-52 bg-slate-50" />
        <div className="card p-5 h-52 bg-slate-50" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 h-16 bg-slate-50" />
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [data, setData]       = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { 'x-user-id': 'admin' },
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('Failed to fetch stats')
        const json = await res.json()
        setData(json)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <DashboardSkeleton />

  if (error || !data) {
    return (
      <div className="card p-10 text-center">
        <p className="text-slate-500 font-medium">Could not load dashboard data.</p>
        <p className="text-xs text-slate-400 mt-1">Please refresh the page or try again later.</p>
      </div>
    )
  }

  const { stats, revenueData, serviceBreakdown, recentBookings } = data

  const cancelledThisWeek = recentBookings.filter((b) => {
    const age = Date.now() - new Date(b.createdAt).getTime()
    return b.status === 'cancelled' && age < 7 * 24 * 60 * 60 * 1000
  }).length

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Bookings"
          value={stats.totalBookings}
          change={stats.bookingsChange}
          icon={<CalendarCheck className="w-5 h-5 text-brand-600" />}
          iconBg="bg-brand-50"
        />
        <AdminStatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change={stats.revenueChange}
          icon={<PoundSterling className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-50"
        />
        <AdminStatCard
          title="Active Drivers"
          value={stats.activeDrivers}
          change={stats.driversChange}
          icon={<Users className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50"
        />
        <AdminStatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          change={stats.pendingChange}
          changeLabel="vs yesterday"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-slate-900">Revenue & Bookings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
            </div>
          </div>
          <AdminRevenueChart data={revenueData} />
        </div>
        <div className="card p-5">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">Service Breakdown</h2>
            <p className="text-xs text-slate-500 mt-0.5">By booking count</p>
          </div>
          <AdminServicePieChart data={serviceBreakdown} />
        </div>
      </div>

      {/* Recent bookings table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Recent Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
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
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="table-td text-center text-slate-400 py-8">
                      No bookings yet
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => {
                    const statusKey = booking.status as keyof typeof STATUS_COLORS
                    const colors = STATUS_COLORS[statusKey] ?? STATUS_COLORS.pending
                    const serviceKey = booking.serviceType as keyof typeof SERVICE_LABELS
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="table-td">
                          <span className="font-mono text-xs text-slate-600">{booking.reference}</span>
                        </td>
                        <td className="table-td">
                          <div className="font-medium text-slate-900 text-xs">{booking.customerName}</div>
                          <div className="text-xs text-slate-400">{booking.customerCountry}</div>
                        </td>
                        <td className="table-td hidden md:table-cell">
                          <span className="text-xs text-slate-600">
                            {SERVICE_LABELS[serviceKey] ?? booking.serviceType}
                          </span>
                        </td>
                        <td className="table-td">
                          <span className="text-xs font-semibold text-slate-900">
                            {formatCurrency(booking.totalAmount)}
                          </span>
                        </td>
                        <td className="table-td">
                          <span className={cn('badge text-xs', colors.bg, colors.text)}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
                            {booking.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick stats summary card */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-900 mb-4">Quick Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-900">Completed today</p>
                <p className="text-lg font-bold text-slate-900">{stats.completedToday}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-900">Cancelled this week</p>
                <p className="text-lg font-bold text-slate-900">{cancelledThisWeek}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                <PoundSterling className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-900">Avg booking value</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(stats.avgBookingValue)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-900">Active drivers</p>
                <p className="text-lg font-bold text-slate-900">{stats.activeDrivers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom quick-stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Completed today',
            value: String(stats.completedToday),
            icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
            bg: 'bg-green-50',
          },
          {
            label: 'Pending bookings',
            value: String(stats.pendingBookings),
            icon: <Clock className="w-4 h-4 text-amber-600" />,
            bg: 'bg-amber-50',
          },
          {
            label: 'Avg booking value',
            value: formatCurrency(stats.avgBookingValue),
            icon: <PoundSterling className="w-4 h-4 text-brand-600" />,
            bg: 'bg-brand-50',
          },
          {
            label: 'Active drivers',
            value: String(stats.activeDrivers),
            icon: <Users className="w-4 h-4 text-purple-600" />,
            bg: 'bg-purple-50',
          },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', s.bg)}>
              {s.icon}
            </div>
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
