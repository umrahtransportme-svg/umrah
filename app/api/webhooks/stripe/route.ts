import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { processBookingConfirmed } from '@/lib/auto-assign'

// Must read raw body before any parsing — Next.js App Router does this automatically
// when you call req.text() instead of req.json().

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        const ref = pi.metadata?.bookingRef
        if (ref) {
          await prisma.booking.updateMany({
            where: { reference: ref, status: 'pending_payment' },
            data: { status: 'payment_failed' },
          })
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const ref = (charge.metadata?.bookingRef) as string | undefined
        if (ref) {
          await prisma.booking.updateMany({
            where: { reference: ref },
            data: {
              refunded: true,
              refundAmount: (charge.amount_refunded ?? 0) / 100,
              status: 'cancelled',
            },
          })
        }
        break
      }

      default:
        // Unhandled event type — ignore silently
        break
    }
  } catch (err) {
    console.error('[Stripe Webhook] Handler error for', event.type, err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const ref = session.metadata?.bookingRef
  const bookingId = session.metadata?.bookingId

  if (!ref) return

  const totalAmount = (session.amount_total ?? 0) / 100
  const paymentIntentId =
    typeof session.payment_intent === 'string' ? session.payment_intent : null

  // Try to find the booking by ID or reference
  const existing = await prisma.booking.findFirst({
    where: {
      OR: [
        ...(bookingId ? [{ id: bookingId }] : []),
        { reference: ref },
        { stripeSessionId: session.id },
      ],
    },
  })

  if (existing) {
    // Idempotency: only run the post-payment pipeline once per booking.
    // updateMany with paidAt:null guard is race-safe — concurrent retries
    // of the same Stripe event will result in count=0 for all but one call.
    const result = await prisma.booking.updateMany({
      where: { id: existing.id, paidAt: null },
      data: {
        status: 'confirmed',
        totalAmount,
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        paidAt: new Date(),
      },
    })
    if (result.count === 0) {
      console.log(`[Stripe Webhook] Booking ${ref} already processed — skipping`)
      return
    }
    await processBookingConfirmed(existing.id)
    return
  }

  // Fallback: booking not found — create from session metadata
  const items: Array<{
    serviceType: string
    pickupLocation: string
    dropoffLocation: string
    travelDate: string
    travelTime: string
    passengers: number
    vehicleType: string
  }> = JSON.parse(session.metadata?.itemsJson ?? '[]')

  const first = items[0]
  const newBooking = await prisma.booking.create({
    data: {
      reference: ref,
      status: 'confirmed',
      serviceType: first?.serviceType ?? session.metadata?.services ?? 'transport',
      pickupLocation: first?.pickupLocation ?? 'See booking details',
      dropoffLocation: first?.dropoffLocation ?? 'See booking details',
      travelDate: first?.travelDate ?? 'TBC',
      passengers: first?.passengers ?? 1,
      vehicleType: first?.vehicleType ?? 'sedan',
      customerName: session.metadata?.customerName ?? 'Customer',
      customerEmail: session.customer_email ?? '',
      customerWhatsapp: session.metadata?.customerWhatsApp ?? '',
      customerCountry: session.metadata?.customerCountry ?? '',
      notes: session.metadata?.specialRequests ?? null,
      totalAmount,
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      paidAt: new Date(),
    },
  })
  await processBookingConfirmed(newBooking.id)
}
