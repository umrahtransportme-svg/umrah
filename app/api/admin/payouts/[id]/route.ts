import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!req.headers.get('x-user-id')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { status, reference } = await req.json()
  const payout = await prisma.payout.update({
    where: { id },
    data: { status, reference, paidAt: status === 'paid' ? new Date() : null },
  })
  return NextResponse.json(payout)
}
