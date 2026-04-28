import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json([])
  const cards = await prisma.savedCard.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(cards)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { last4, brand, expMonth, expYear, cardholderName, isDefault } = await req.json()
  if (!last4 || !brand || !expMonth || !expYear) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  if (last4.length !== 4 || !/^\d{4}$/.test(last4)) return NextResponse.json({ error: 'last4 must be 4 digits' }, { status: 400 })

  if (isDefault) await prisma.savedCard.updateMany({ where: { userId: user.id }, data: { isDefault: false } })

  const card = await prisma.savedCard.create({ data: { userId: user.id, last4, brand, expMonth: Number(expMonth), expYear: Number(expYear), cardholderName, isDefault: !!isDefault } })
  return NextResponse.json(card)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { id, makeDefaultId } = await req.json()
  const card = await prisma.savedCard.findFirst({ where: { id, userId: user.id } })
  if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.savedCard.delete({ where: { id } })

  if (makeDefaultId) await prisma.savedCard.update({ where: { id: makeDefaultId }, data: { isDefault: true } })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await getUser(session.user.email)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { id } = await req.json()
  await prisma.savedCard.updateMany({ where: { userId: user.id }, data: { isDefault: false } })
  await prisma.savedCard.update({ where: { id }, data: { isDefault: true } })
  return NextResponse.json({ ok: true })
}
