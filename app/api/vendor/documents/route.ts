import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const docs = await prisma.vendorDocument.findMany({ where: { vendorId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(docs)
}

export async function POST(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { docType, label, fileData, fileName, expiryDate } = await req.json()

  if (!docType || !label) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Upsert — one doc per type per vendor
  const existing = await prisma.vendorDocument.findFirst({ where: { vendorId, docType } })
  let doc
  if (existing) {
    doc = await prisma.vendorDocument.update({ where: { id: existing.id }, data: { fileData, fileName, expiryDate, status: 'pending' } })
  } else {
    doc = await prisma.vendorDocument.create({ data: { vendorId, docType, label, fileData, fileName, expiryDate, status: 'pending' } })
  }
  return NextResponse.json(doc)
}

export async function DELETE(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const doc = await prisma.vendorDocument.findFirst({ where: { id, vendorId } })
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.vendorDocument.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
