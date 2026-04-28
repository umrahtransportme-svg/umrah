import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const vendor = await prisma.vendorAccount.findUnique({
    where: { id: vendorId },
    select: { id: true, companyName: true, contactName: true, email: true, phone: true, city: true, country: true, commissionRate: true, payoutMethod: true, payoutDetails: true, payoutSchedule: true, payoutDay: true, status: true, createdAt: true },
  })
  if (!vendor) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(vendor)
}

export async function PUT(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { companyName, contactName, phone, city, country, payoutMethod, payoutDetails } = body

  const vendor = await prisma.vendorAccount.update({
    where: { id: vendorId },
    data: { companyName, contactName, phone, city, country, payoutMethod, payoutDetails },
  })
  return NextResponse.json(vendor)
}
