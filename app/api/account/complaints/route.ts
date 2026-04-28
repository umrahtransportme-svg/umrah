import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json([])
  const complaints = await prisma.complaint.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(complaints)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { bookingRef, category, subject, message, priority } = await req.json()
  if (!category || !subject || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const complaint = await prisma.complaint.create({
    data: { userId: user.id, bookingRef, category, subject, message, priority: priority || 'normal', status: 'open' },
  })
  return NextResponse.json(complaint)
}
