import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [payouts, bookings] = await Promise.all([
    prisma.payout.findMany({ where: { vendorId }, orderBy: { createdAt: 'desc' } }),
    prisma.booking.findMany({
      where: { vendorId, status: 'confirmed' },
      select: { id: true, vendorAmount: true, travelDate: true, status: true },
    }),
  ])

  const totalPaid = payouts.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const pendingEarnings = bookings.reduce((s, b) => s + b.vendorAmount, 0) - totalPaid

  return NextResponse.json({ payouts, totalPaid, pendingEarnings })
}
