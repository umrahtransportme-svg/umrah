import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return NextResponse.json(user ?? {})
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { phone, nationality, dateOfBirth, name, profilePicture } = body
  const user = await prisma.user.upsert({
    where: { email: session.user.email },
    update: { phone, nationality, dateOfBirth, name: name || session.user.name, profilePicture },
    create: {
      email: session.user.email,
      name: name || session.user.name,
      image: session.user.image,
      phone,
      nationality,
      dateOfBirth,
      profilePicture,
    },
  })
  return NextResponse.json(user)
}
