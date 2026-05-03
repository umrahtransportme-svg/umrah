import { prisma } from './prisma'
import {
  sendBookingConfirmation,
  sendDriverAssignedToCustomer,
  sendDriverJobNotification,
  sendAdminNewBookingAlert,
} from './email'
import {
  notifyCustomerBookingConfirmed,
  notifyCustomerDriverAssigned,
  notifyDriverJobAssigned,
  notifyAdminNewBooking,
} from './whatsapp-notify'

// Vehicle types that satisfy each booking vehicle type, in preference order
const VEHICLE_FALLBACK: Record<string, string[]> = {
  sedan: ['sedan'],
  suv: ['suv', 'luxury-suv'],
  'luxury-suv': ['luxury-suv', 'suv'],
  hiace: ['hiace', 'minivan'],
  coaster: ['coaster', 'bus'],
}

interface AssignResult {
  assigned: boolean
  driverId?: string
  driverName?: string
  driverPhone?: string
  vehicleInfo?: string
}

export async function autoAssignDriver(bookingId: string): Promise<AssignResult> {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) return { assigned: false }

  const acceptableTypes = VEHICLE_FALLBACK[booking.vehicleType] ?? [booking.vehicleType]

  // Find an active driver from an active vendor who has an assigned vehicle
  // matching the required type and capacity, not already on a confirmed future booking
  const driver = await prisma.vendorDriver.findFirst({
    where: {
      status: 'active',
      assignedVehicleId: { not: null },
      vendor: { status: 'active' },
    },
    include: {
      vendor: {
        select: { commissionRate: true, status: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  if (!driver) return { assigned: false }

  // Validate the assigned vehicle meets requirements
  const vehicle = await prisma.vendorVehicle.findFirst({
    where: {
      id: driver.assignedVehicleId!,
      status: 'active',
      vehicleType: { in: acceptableTypes },
      capacity: { gte: booking.passengers },
    },
  })

  if (!vehicle) return { assigned: false }

  const vendorAmount =
    booking.totalAmount * (1 - (driver.vendor.commissionRate / 100))
  const vehicleInfo = `${vehicle.make} ${vehicle.model} (${vehicle.plate})`

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      driverId: driver.id,
      vendorId: driver.vendorId,
      vendorAmount,
      status: 'confirmed',
    },
  })

  return {
    assigned: true,
    driverId: driver.id,
    driverName: driver.fullName,
    driverPhone: driver.phone,
    vehicleInfo,
  }
}

// Full post-payment pipeline: confirm → notify customer → assign driver → notify all
export async function processBookingConfirmed(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) return

  // 1. Send booking confirmation to customer (email + WhatsApp)
  await Promise.allSettled([
    sendBookingConfirmation({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingRef: booking.reference,
      serviceType: booking.serviceType,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      travelDate: booking.travelDate,
      passengers: booking.passengers,
      vehicleType: booking.vehicleType,
      totalAmount: booking.totalAmount,
    }),
    notifyCustomerBookingConfirmed({
      customerPhone: booking.customerWhatsapp,
      customerName: booking.customerName,
      bookingRef: booking.reference,
      serviceType: booking.serviceType,
      travelDate: booking.travelDate,
      pickupLocation: booking.pickupLocation,
      totalAmount: booking.totalAmount,
    }),
    sendAdminNewBookingAlert({
      bookingRef: booking.reference,
      customerName: booking.customerName,
      serviceType: booking.serviceType,
      travelDate: booking.travelDate,
      totalAmount: booking.totalAmount,
    }),
    notifyAdminNewBooking({
      bookingRef: booking.reference,
      customerName: booking.customerName,
      serviceType: booking.serviceType,
      travelDate: booking.travelDate,
      totalAmount: booking.totalAmount,
    }),
  ])

  // 2. Try auto-assign a driver
  const result = await autoAssignDriver(bookingId)

  if (!result.assigned || !result.driverName || !result.driverPhone) return

  // 3. Find the assigned driver record for their email
  const driver = await prisma.vendorDriver.findUnique({
    where: { id: result.driverId },
  })
  if (!driver) return

  // 4. Notify customer about driver assignment (email + WhatsApp)
  await Promise.allSettled([
    sendDriverAssignedToCustomer({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingRef: booking.reference,
      driverName: result.driverName,
      driverPhone: result.driverPhone,
      vehicleInfo: result.vehicleInfo ?? '',
      travelDate: booking.travelDate,
      pickupLocation: booking.pickupLocation,
    }),
    notifyCustomerDriverAssigned({
      customerPhone: booking.customerWhatsapp,
      customerName: booking.customerName,
      bookingRef: booking.reference,
      driverName: result.driverName,
      driverPhone: result.driverPhone,
      vehicleInfo: result.vehicleInfo ?? '',
      travelDate: booking.travelDate,
      pickupLocation: booking.pickupLocation,
    }),
  ])

  // 5. Notify driver (email + WhatsApp)
  await Promise.allSettled([
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
}
