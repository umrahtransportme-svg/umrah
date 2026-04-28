import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-user-id') !== null
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(vehicles)
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const vehicle = await prisma.vehicle.create({ data: body })
  return NextResponse.json(vehicle, { status: 201 })
}
