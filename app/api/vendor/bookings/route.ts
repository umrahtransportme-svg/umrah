import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bookings = await prisma.booking.findMany({
    where: { vendorId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(bookings)
}
