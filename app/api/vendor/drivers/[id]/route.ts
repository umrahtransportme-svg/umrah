import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const driver = await prisma.vendorDriver.findFirst({ where: { id, vendorId } })
  if (!driver) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const updated = await prisma.vendorDriver.update({ where: { id }, data: body })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const driver = await prisma.vendorDriver.findFirst({ where: { id, vendorId } })
  if (!driver) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.vendorDriver.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
