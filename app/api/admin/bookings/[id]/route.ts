import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDriverAssignedToCustomer, sendDriverJobNotification } from '@/lib/email'
import { notifyCustomerDriverAssigned, notifyDriverJobAssigned } from '@/lib/whatsapp-notify'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-user-id') !== null
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { vendor: { select: { companyName: true } } },
  })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(booking)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  // Handle manual driver assignment
  if (body.action === 'assign_driver') {
    return assignDriver(id, body.driverId)
  }

  const booking = await prisma.booking.update({ where: { id }, data: body })
  return NextResponse.json(booking)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.booking.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

async function assignDriver(bookingId: string, driverId: string) {
  const [booking, driver] = await Promise.all([
    prisma.booking.findUnique({ where: { id: bookingId } }),
    prisma.vendorDriver.findUnique({
      where: { id: driverId },
      include: { vendor: { select: { commissionRate: true } } },
    }),
  ])

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  if (!driver) return NextResponse.json({ error: 'Driver not found' }, { status: 404 })

  const vehicle = driver.assignedVehicleId
    ? await prisma.vendorVehicle.findUnique({ where: { id: driver.assignedVehicleId } })
    : null

  const vendorAmount =
    booking.totalAmount * (1 - driver.vendor.commissionRate / 100)
  const vehicleInfo = vehicle
    ? `${vehicle.make} ${vehicle.model} (${vehicle.plate})`
    : 'Vehicle assigned'

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      driverId: driver.id,
      vendorId: driver.vendorId,
      vendorAmount,
      status: 'confirmed',
    },
  })

  // Notify customer and driver
  await Promise.allSettled([
    sendDriverAssignedToCustomer({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingRef: booking.reference,
      driverName: driver.fullName,
      driverPhone: driver.phone,
      vehicleInfo,
      travelDate: booking.travelDate,
      pickupLocation: booking.pickupLocation,
    }),
    notifyCustomerDriverAssigned({
      customerPhone: booking.customerWhatsapp,
      customerName: booking.customerName,
      bookingRef: booking.reference,
      driverName: driver.fullName,
      driverPhone: driver.phone,
      vehicleInfo,
      travelDate: booking.travelDate,
      pickupLocation: booking.pickupLocation,
    }),
    sendDriverJobNotification({
      driverEmail: driver.email ?? '',
      driverName: driver.fullName,
      customerName: booking.customerName,
      customerPhone: booking.customerWhatsapp,
      bookingRef: booking.reference,
      serviceType: booking.serviceType,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      travelDate: booking.travelDate,
      passengers: booking.passengers,
      notes: booking.notes ?? undefined,
    }),
    notifyDriverJobAssigned({
      driverPhone: driver.phone,
      driverName: driver.fullName,
      customerName: booking.customerName,
      customerPhone: booking.customerWhatsapp,
      bookingRef: booking.reference,
      serviceType: booking.serviceType,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      travelDate: booking.travelDate,
      passengers: booking.passengers,
      notes: booking.notes ?? undefined,
    }),
  ])

  return NextResponse.json(updated)
}
