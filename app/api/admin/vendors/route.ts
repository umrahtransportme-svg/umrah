import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/vendor-auth'
import { revalidatePath } from 'next/cache'

export async function GET(req: NextRequest) {
  if (!req.headers.get('x-user-id')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const vendors = await prisma.vendorAccount.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(vendors)
}

export async function POST(req: NextRequest) {
  if (!req.headers.get('x-user-id')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { companyName, contactName, email, phone, city, country, commissionRate, payoutSchedule, payoutDay, password } = body

  const vendor = await prisma.vendorAccount.create({
    data: {
      companyName, contactName, email, phone, city,
      country: country || 'Saudi Arabia',
      commissionRate: commissionRate || 15,
      payoutSchedule: payoutSchedule || 'monthly',
      payoutDay: payoutDay || 1,
      passwordHash: hashPassword(password || Math.random().toString(36).slice(2, 10)),
      status: 'pending',
    },
  })
  revalidatePath('/admin/vendors')
  return NextResponse.json(vendor)
}
