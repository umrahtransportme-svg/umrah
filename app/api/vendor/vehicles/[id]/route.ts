import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  const vehicle = await prisma.vendorVehicle.findFirst({ where: { id, vendorId } })
  if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (body.year) {
    const minYear = new Date().getFullYear() - 3
    if (Number(body.year) < minYear) return NextResponse.json({ error: `Vehicle must not be more than 3 years old (minimum year: ${minYear})` }, { status: 400 })
  }

  const updated = await prisma.vendorVehicle.update({ where: { id }, data: body })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const vehicle = await prisma.vendorVehicle.findFirst({ where: { id, vendorId } })
  if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.vendorVehicle.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
