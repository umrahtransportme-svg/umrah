import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  if (!req.headers.get('x-user-id')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payouts = await prisma.payout.findMany({
    include: { vendor: { select: { companyName: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(payouts)
}

export async function POST(req: NextRequest) {
  if (!req.headers.get('x-user-id')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { vendorId, amount, currency, method, period, notes } = await req.json()
  const payout = await prisma.payout.create({
    data: { vendorId, amount, currency: currency || 'GBP', method, period, notes, status: 'pending' },
    include: { vendor: { select: { companyName: true } } },
  })
  return NextResponse.json(payout)
}
