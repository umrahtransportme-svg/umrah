import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const MIN_YEAR = () => new Date().getFullYear() - 3

export async function GET(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const vehicles = await prisma.vendorVehicle.findMany({ where: { vendorId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(vehicles)
}

export async function POST(req: NextRequest) {
  const vendorId = req.headers.get('x-vendor-id')
  if (!vendorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { make, model, year, plate, color, capacity, vehicleType, regDoc, regDocName, insuranceDoc, insuranceDocName, roadworthyDoc, roadworthyDocName, photoFront, photoSide, notes } = body

  if (!make || !model || !year || !plate || !capacity || !vehicleType)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  if (year < MIN_YEAR())
    return NextResponse.json({ error: `Vehicle must not be more than 3 years old (minimum year: ${MIN_YEAR()})` }, { status: 400 })

  if (year > new Date().getFullYear() + 1)
    return NextResponse.json({ error: 'Invalid vehicle year' }, { status: 400 })

  const existing = await prisma.vendorVehicle.findUnique({ where: { plate } })
  if (existing) return NextResponse.json({ error: 'A vehicle with this plate already exists' }, { status: 400 })

  const vehicle = await prisma.vendorVehicle.create({
    data: { vendorId, make, model, year: Number(year), plate, color, capacity: Number(capacity), vehicleType, regDoc, regDocName, insuranceDoc, insuranceDocName, roadworthyDoc, roadworthyDocName, photoFront, photoSide, notes, status: 'pending' },
  })
  return NextResponse.json(vehicle)
}
