import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MOCK_REVENUE_DATA, MOCK_SERVICE_BREAKDOWN } from '@/lib/admin/mock-data'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-user-id') !== null
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [
    totalBookings,
    revenueAgg,
    activeDrivers,
    pendingBookings,
    prevMonthBookings,
    prevMonthRevenue,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['confirmed', 'completed'] } },
    }),
    prisma.vendorDriver.count({ where: { status: 'active' } }),
    prisma.booking.count({ where: { status: 'pending' } }),
    // Previous 30-day window for change %
    prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { in: ['confirmed', 'completed'] },
        paidAt: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ])

  const thisMonthBookings = await prisma.booking.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  })

  const thisMonthRevenue = (
    await prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { in: ['confirmed', 'completed'] },
        paidAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    })
  )._sum.totalAmount ?? 0

  const totalRevenue = revenueAgg._sum.totalAmount ?? 0
  const prevRev = prevMonthRevenue._sum.totalAmount ?? 0

  function changePct(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100 * 10) / 10
  }

  const stats = {
    totalBookings,
    totalRevenue: Math.round(totalRevenue),
    activeDrivers,
    pendingBookings,
    bookingsChange: changePct(thisMonthBookings, prevMonthBookings),
    revenueChange: changePct(thisMonthRevenue, prevRev),
    driversChange: 0,
    pendingChange: 0,
  }

  // Revenue chart: last 6 months
  const months: Array<{ month: string; revenue: number; bookings: number }> = []
  for (let i = 5; i >= 0; i--) {
    const start = new Date()
    start.setDate(1)
    start.setMonth(start.getMonth() - i)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setMonth(end.getMonth() + 1)

    const [rev, cnt] = await Promise.all([
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: { in: ['confirmed', 'completed'] },
          createdAt: { gte: start, lt: end },
        },
      }),
      prisma.booking.count({ where: { createdAt: { gte: start, lt: end } } }),
    ])

    months.push({
      month: start.toLocaleString('default', { month: 'short' }),
      revenue: Math.round(rev._sum.totalAmount ?? 0),
      bookings: cnt,
    })
  }

  // Service breakdown from real data
  const serviceCounts = await prisma.booking.groupBy({
    by: ['serviceType'],
    _count: true,
  })

  const total = serviceCounts.reduce((s, r) => s + r._count, 0) || 1
  const COLORS: Record<string, string> = {
    'airport-transfer': '#2563eb',
    'intercity-transfer': '#7c3aed',
    'ziyarat-tour': '#059669',
    'umrah-with-qari': '#d97706',
    'elderly-assistance': '#dc2626',
    airport_transfer: '#2563eb',
    intercity_transfer: '#7c3aed',
    ziyarat_tour: '#059669',
    umrah_with_qari: '#d97706',
    elderly_assistance: '#dc2626',
  }

  const serviceBreakdown =
    serviceCounts.length > 0
      ? serviceCounts.map((r) => ({
          name: r.serviceType
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          value: Math.round((r._count / total) * 100),
          color: COLORS[r.serviceType] ?? '#64748b',
        }))
      : MOCK_SERVICE_BREAKDOWN

  return NextResponse.json({
    stats,
    revenueData: months.some((m) => m.revenue > 0) ? months : MOCK_REVENUE_DATA,
    serviceBreakdown,
  })
}
