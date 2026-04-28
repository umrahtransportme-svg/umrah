import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const drivers = await prisma.vendorDriver.findMany({ where: { vendorId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(drivers)
}

export async function POST(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { fullName, email, phone, nationality, licenseNumber, licenseExpiry, licenseDoc, licenseDocName, passportDoc, passportDocName, photoUrl, assignedVehicleId, notes } = body

  if (!fullName || !phone || !licenseNumber || !licenseExpiry)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  // Warn if license is expired
  if (new Date(licenseExpiry) < new Date())
    return NextResponse.json({ error: 'License has expired. Please provide a valid license.' }, { status: 400 })

  const driver = await prisma.vendorDriver.create({
    data: { vendorId, fullName, email, phone, nationality, licenseNumber, licenseExpiry, licenseDoc, licenseDocName, passportDoc, passportDocName, photoUrl, assignedVehicleId, notes, status: 'active' },
  })
  return NextResponse.json(driver)
}
