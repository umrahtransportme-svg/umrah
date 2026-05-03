import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateBookingRef } from '@/lib/utils'
import { buildBookingMessage } from '@/lib/whatsapp'
import { prisma } from '@/lib/prisma'

const bookingSchema = z.object({
  serviceType: z.string().min(1),
  pickupLocation: z.string().min(1),
  dropoffLocation: z.string().min(1),
  travelDate: z.string().min(1),
  travelTime: z.string().min(1),
  passengers: z.number().min(1).max(20),
  vehicleType: z.string().min(1),
  fullName: z.string().min(2),
  whatsappNumber: z.string().min(8),
  country: z.string().min(1),
  email: z.string().email(),
  specialRequests: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = bookingSchema.parse(body)

    const reference = generateBookingRef()

    const whatsappMessage = buildBookingMessage({
      service: data.serviceType,
      pickup: data.pickupLocation,
      dropoff: data.dropoffLocation,
      date: data.travelDate,
      time: data.travelTime,
      passengers: data.passengers,
      vehicle: data.vehicleType,
      name: data.fullName,
      bookingRef: reference,
    })

    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '447456938750'}?text=${encodeURIComponent(whatsappMessage)}`

    const booking = await prisma.booking.create({
      data: {
        reference,
        serviceType: data.serviceType,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        travelDate: data.travelDate,
        passengers: data.passengers,
        vehicleType: data.vehicleType,
        customerName: data.fullName,
        customerEmail: data.email,
        customerWhatsapp: data.whatsappNumber,
        customerCountry: data.country,
        notes: data.specialRequests,
        status: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      bookingRef: reference,
      whatsappUrl,
      message: 'Booking received. Please complete via WhatsApp.',
      booking,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }
    console.error('Booking error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Booking API — use POST to create a booking' })
}
