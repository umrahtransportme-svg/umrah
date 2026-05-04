import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-user-id') !== null
}

function getRangeStart(range: string): Date {
  const now = new Date()
  switch (range) {
    case '7d':  return new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000)
    case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case '6m':  return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
    case '1y':  return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    default:    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

function getMonthCount(range: string): number {
  switch (range) {
    case '7d':  return 1
    case '30d': return 1
    case '6m':  return 6
    case '1y':  return 12
    default:    return 1
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const range  = searchParams.get('range')  ?? '30d'
  const format = searchParams.get('format') ?? 'json'
  const rangeStart = getRangeStart(range)

  const COLORS: Record<string, string> = {
    airport_transfer:   '#2563eb',
    intercity_transfer: '#7c3aed',
    ziyarat_tour:       '#059669',
    umrah_with_qari:    '#d97706',
    elderly_assistance: '#dc2626',
  }

  // Fetch all bookings in range (used for CSV and JSON)
  const bookingsInRange = await prisma.booking.findMany({
    where: { createdAt: { gte: rangeStart } },
    orderBy: { createdAt: 'desc' },
  })

  // ── CSV export ──────────────────────────────────────────────────────────────
  if (format === 'csv') {
    const header = [
      'Reference', 'Customer', 'Email', 'Country',
      'Service', 'Status', 'Amount (GBP)', 'Created',
    ].join(',')

    const rows = bookingsInRange.map((b) => [
      b.reference,
      `"${b.customerName.replace(/"/g, '""')}"`,
      b.customerEmail,
      `"${b.customerCountry.replace(/"/g, '""')}"`,
      b.serviceType,
      b.status,
      b.totalAmount.toFixed(2),
      new Date(b.createdAt).toISOString().slice(0, 10),
    ].join(','))

    const csv = [header, ...rows].join('\n')
    const filename = `bookings-${range}-${new Date().toISOString().slice(0, 10)}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  }

  // ── JSON response ────────────────────────────────────────────────────────────
  const completedBookings = bookingsInRange.filter((b) => b.status === 'completed').length
  const cancelledBookings = bookingsInRange.filter((b) => b.status === 'cancelled').length
  const totalRevenue      = bookingsInRange
    .filter((b) => ['confirmed', 'completed'].includes(b.status))
    .reduce((sum, b) => sum + b.totalAmount, 0)
  const validForAvg = bookingsInRange.filter((b) => !['cancelled', 'refunded'].includes(b.status))
  const avgBookingValue   = validForAvg.length > 0
    ? Math.round(validForAvg.reduce((s, b) => s + b.totalAmount, 0) / validForAvg.length)
    : 0

  // Total vendor payouts in range
  const payoutsAgg = await prisma.payout.aggregate({
    _sum: { amount: true },
    where: {
      status: 'paid',
      paidAt: { gte: rangeStart },
    },
  })
  const totalVendorPayouts = Math.round(payoutsAgg._sum.amount ?? 0)

  const stats = {
    totalRevenue:      Math.round(totalRevenue),
    totalBookings:     bookingsInRange.length,
    completedBookings,
    cancelledBookings,
    avgBookingValue,
    totalVendorPayouts,
  }

  // Monthly data
  const monthCount = getMonthCount(range)
  const monthlyData: Array<{ month: string; revenue: number; bookings: number }> = []

  if (range === '7d') {
    // Daily breakdown for 7-day range
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date()
      dayStart.setHours(0, 0, 0, 0)
      dayStart.setDate(dayStart.getDate() - i)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayEnd.getDate() + 1)

      const dayBookings = bookingsInRange.filter((b) => {
        const d = new Date(b.createdAt)
        return d >= dayStart && d < dayEnd
      })
      const dayRevenue = dayBookings
        .filter((b) => ['confirmed', 'completed'].includes(b.status))
        .reduce((s, b) => s + b.totalAmount, 0)

      monthlyData.push({
        month: dayStart.toLocaleString('default', { weekday: 'short' }),
        revenue: Math.round(dayRevenue),
        bookings: dayBookings.length,
      })
    }
  } else {
    for (let i = monthCount - 1; i >= 0; i--) {
      const start = new Date()
      start.setDate(1)
      start.setMonth(start.getMonth() - i)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)

      const mBookings = bookingsInRange.filter((b) => {
        const d = new Date(b.createdAt)
        return d >= start && d < end
      })
      const mRevenue = mBookings
        .filter((b) => ['confirmed', 'completed'].includes(b.status))
        .reduce((s, b) => s + b.totalAmount, 0)

      monthlyData.push({
        month: start.toLocaleString('default', { month: 'short' }),
        revenue: Math.round(mRevenue),
        bookings: mBookings.length,
      })
    }
  }

  // Service breakdown
  const serviceMap = new Map<string, { count: number; revenue: number }>()
  for (const b of bookingsInRange) {
    const existing = serviceMap.get(b.serviceType) ?? { count: 0, revenue: 0 }
    existing.count++
    if (['confirmed', 'completed'].includes(b.status)) {
      existing.revenue += b.totalAmount
    }
    serviceMap.set(b.serviceType, existing)
  }

  const serviceBreakdown = Array.from(serviceMap.entries()).map(([key, val]) => ({
    name: key
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    count:   val.count,
    revenue: Math.round(val.revenue),
    color:   COLORS[key] ?? '#64748b',
  }))

  // Country breakdown — top 5
  const countryMap = new Map<string, { bookings: number; revenue: number }>()
  for (const b of bookingsInRange) {
    const country = b.customerCountry || 'Unknown'
    const existing = countryMap.get(country) ?? { bookings: 0, revenue: 0 }
    existing.bookings++
    if (['confirmed', 'completed'].includes(b.status)) {
      existing.revenue += b.totalAmount
    }
    countryMap.set(country, existing)
  }

  const countryBreakdown = Array.from(countryMap.entries())
    .map(([country, val]) => ({
      country,
      bookings: val.bookings,
      revenue:  Math.round(val.revenue),
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5)

  // Recent transactions (last 20)
  const recentTransactions = bookingsInRange.slice(0, 20).map((b) => ({
    id:              b.id,
    reference:       b.reference,
    customerName:    b.customerName,
    customerCountry: b.customerCountry,
    serviceType:     b.serviceType,
    totalAmount:     b.totalAmount,
    status:          b.status,
    createdAt:       b.createdAt.toISOString(),
  }))

  return NextResponse.json({
    stats,
    monthlyData,
    serviceBreakdown,
    countryBreakdown,
    recentTransactions,
  })
}
