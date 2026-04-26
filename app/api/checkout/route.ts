import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import type { CartItem } from '@/types'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, customerName, customerEmail, customerWhatsApp, customerCountry, specialRequests } = body as {
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

    const lineItems = items.map((item: CartItem) => ({
      quantity: 1,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: `${item.serviceLabel}`,
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
        customerName,
        customerWhatsApp,
        customerCountry,
        specialRequests: specialRequests || '',
        itemCount: String(items.length),
        services: items.map((i: CartItem) => i.serviceLabel).join(', '),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/checkout/success?session_id={CHECKOUT_SESSION_ID}&ref=${bookingRef}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/checkout?cancelled=1`,
      payment_intent_data: {
        metadata: {
          bookingRef,
          customerName,
          customerEmail,
          customerWhatsApp,
          totalAmount: String(totalAmount),
        },
      },
      custom_text: {
        submit: { message: `Booking ref: ${bookingRef} · Pay securely with Visa or Mastercard` },
      },
    })

    return NextResponse.json({ url: session.url, bookingRef })
  } catch (err) {
    const error = err as Error
    console.error('Stripe error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
