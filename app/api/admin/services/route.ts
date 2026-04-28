import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-user-id') !== null
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const services = await prisma.service.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const service = await prisma.service.create({ data: body })
  revalidatePath('/', 'layout')
  return NextResponse.json(service, { status: 201 })
}
