import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-user-id') !== null
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const drivers = await prisma.driver.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(drivers)
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const driver = await prisma.driver.create({ data: body })
  return NextResponse.json(driver, { status: 201 })
}
