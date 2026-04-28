import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { passport: true } })
  return NextResponse.json(user?.passport ?? {})
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const user = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {},
    create: { email: session.user.email, name: session.user.name, image: session.user.image },
  })
  const passport = await prisma.passportDetail.upsert({
    where: { userId: user.id },
    update: body,
    create: { userId: user.id, ...body },
  })
  return NextResponse.json(passport)
}
