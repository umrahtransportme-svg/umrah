import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import type { CartItem } from '@/types'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      items,
      customerName,
      customerEmail,
      customerWhatsApp,
      customerCountry,
      specialRequests,
    } = body as {
      items: CartItem[]
      customerName: string
      customerEmail: string
      customerWhatsApp: string
      customerCountry: string
      specialRequests?: string
    }

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const totalAmount = items.reduce((s: number, i: CartItem) => s + i.price, 0)
    const bookingRef = `UT-${Date.now().toString(36).toUpperCase().slice(-6)}`
    const primary = items[0]

    // Save booking to DB as pending_payment before creating Stripe session
    // so the webhook can find it by reference when payment completes
    const booking = await prisma.booking.create({
      data: {
        reference: bookingRef,
        status: 'pending_payment',
        serviceType: primary.serviceType,
        pickupLocation: primary.pickupLocation,
        dropoffLocation: primary.dropoffLocation,
        travelDate: primary.travelDate,
        passengers: primary.passengers,
        vehicleType: primary.vehicleType,
        customerName,
        customerEmail,
        customerWhatsapp: customerWhatsApp,
        customerCountry,
        notes: [
          specialRequests,
          items.length > 1
            ? `Additional services: ${items
                .slice(1)
                .map((i) => i.serviceLabel)
                .join(', ')}`
            : null,
        ]
          .filter(Boolean)
          .join('\n') || null,
        totalAmount,
      },
    })

    const lineItems = items.map((item: CartItem) => ({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.serviceLabel,
          description: `${item.pickupLocation} → ${item.dropoffLocation} · ${item.travelDate} at ${item.travelTime} · ${item.passengers} pax`,
        },
      },
    }))

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customerEmail,
      metadata: {
        bookingRef,
        bookingId: booking.id,
        customerName,
        customerWhatsApp,
        customerCountry,
        specialRequests: specialRequests ?? '',
        itemCount: String(items.length),
        services: items.map((i: CartItem) => i.serviceLabel).join(', '),
        // Serialise items so the webhook can reconstruct if needed
        itemsJson: JSON.stringify(
          items.map((i) => ({
            serviceType: i.serviceType,
            pickupLocation: i.pickupLocation,
            dropoffLocation: i.dropoffLocation,
            travelDate: i.travelDate,
            travelTime: i.travelTime,
            passengers: i.passengers,
            vehicleType: i.vehicleType,
          }))
        ).slice(0, 490), // Stripe metadata value limit is 500 chars
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/checkout/success?session_id={CHECKOUT_SESSION_ID}&ref=${bookingRef}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/checkout?cancelled=1`,
      payment_intent_data: {
        metadata: {
          bookingRef,
          bookingId: booking.id,
          customerName,
          customerEmail,
          customerWhatsApp,
          totalAmount: String(totalAmount),
        },
      },
      custom_text: {
        submit: {
          message: `Booking ref: ${bookingRef} · Pay securely with Visa or Mastercard`,
        },
      },
    })

    // Store the Stripe session ID on the booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url, bookingRef })
  } catch (err) {
    const error = err as Error
    console.error('Stripe error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
