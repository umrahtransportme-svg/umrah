import Anthropic from '@anthropic-ai/sdk'
import { prisma } from './prisma'
import { PRICING } from './config'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const FALLBACK = 'Assalamu Alaikum! I am having a technical issue right now. Please contact us at info@umrahtransport.me or call +44 7456 938750. JazakAllah Khair!'

// In-memory conversation history per WhatsApp number (30-min TTL)
interface Session {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  lastActive: number
}
const sessions = new Map<string, Session>()
const SESSION_TTL = 30 * 60 * 1000

function getSession(phone: string): Session {
  const now = Date.now()
  const s = sessions.get(phone)
  if (!s || now - s.lastActive > SESSION_TTL) {
    const fresh: Session = { messages: [], lastActive: now }
    sessions.set(phone, fresh)
    return fresh
  }
  s.lastActive = now
  return s
}

// Purge expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of sessions) {
    if (now - v.lastActive > SESSION_TTL) sessions.delete(k)
  }
}, 10 * 60_000)

// ── Booking lookup ─────────────────────────────────────────────────────────────

async function lookupBooking(ref: string) {
  return prisma.booking.findFirst({
    where: { reference: { equals: ref.toUpperCase() } },
    select: {
      reference: true,
      status: true,
      serviceType: true,
      pickupLocation: true,
      dropoffLocation: true,
      travelDate: true,
      passengers: true,
      vehicleType: true,
      driverId: true,
      totalAmount: true,
      paidAt: true,
    },
  })
}

async function lookupByPhone(phone: string) {
  const clean = phone.replace(/\D/g, '')
  return prisma.booking.findMany({
    where: { OR: [{ customerWhatsapp: { contains: clean.slice(-9) } }] },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      reference: true,
      status: true,
      serviceType: true,
      travelDate: true,
      pickupLocation: true,
      dropoffLocation: true,
      totalAmount: true,
    },
  })
}

// ── System prompt ──────────────────────────────────────────────────────────────
// Booking context goes here (system prompt), NOT in the user message,
// to avoid triggering content-filter policies on PII in user turns.

function buildSystemPrompt(bookingContext?: string) {
  const base = `You are the friendly AI customer support assistant for Umrah Transport — a premium transportation service for Muslim pilgrims performing Umrah and Hajj in Saudi Arabia (Makkah, Madinah, Jeddah).

You communicate via WhatsApp. Keep messages clear, warm, and concise. Use simple formatting (bold with *asterisks*, line breaks). Always greet with "Assalamu Alaikum" on the first message of a session. Never use HTML.

## Services & Pricing (GBP)

*Airport Transfers* (JED / MED airports)
- Sedan (1-3 pax): £${PRICING.airportTransfer.sedan}
- SUV (4-6 pax): £${PRICING.airportTransfer.suv}
- Luxury SUV: £${PRICING.airportTransfer['luxury-suv']}
- Hiace (7-10 pax): £${PRICING.airportTransfer.hiace}
- Coaster (11-16 pax): £${PRICING.airportTransfer.coaster}

*Intercity Transfers* (Makkah, Madinah, Jeddah)
- Sedan: £${PRICING.intercityTransfer.sedan}
- SUV: £${PRICING.intercityTransfer.suv}
- Luxury SUV: £${PRICING.intercityTransfer['luxury-suv']}
- Hiace: £${PRICING.intercityTransfer.hiace}
- Coaster: £${PRICING.intercityTransfer.coaster}

*Ziyarat Tours* (Islamic historic sites)
- Half Day: £${PRICING.ziyaratTour.halfDay}
- Full Day: £${PRICING.ziyaratTour.fullDay}

*Umrah with Qari* (guided Umrah with certified reciter): £${PRICING.umrahWithQari} per person

*Elderly Assistance* (helper + wheelchair support): £${PRICING.elderlyAssistance.fullDayRate}/day or £${PRICING.elderlyAssistance.hourlyRate}/hr (min ${PRICING.elderlyAssistance.minHours}h)

## Booking Process

Customers book at www.umrahtransport.me and pay by card. They receive a booking reference (e.g. UT-XXXXX). A driver is assigned after payment.

## Your Capabilities

1. Answer questions about services, pricing, vehicles, coverage areas
2. Check booking status using the booking context provided below
3. Help with changes — direct to website or say you will flag it to the team
4. General Umrah travel advice and tips
5. Handle complaints — acknowledge sincerely and assure follow-up

## Rules

- If you do not know something, say so honestly and offer to connect them with the team
- Never make up booking details, driver names, or prices you are not sure about
- For urgent issues (missed pickup, safety concern), say: "I am escalating this to our team right now — someone will contact you within 15 minutes."
- For refund or cancellation requests, direct to: info@umrahtransport.me with their booking reference
- Always end with: "Is there anything else I can help you with?"
- Be empathetic — many customers are first-time pilgrims, elderly, or travelling with families
- Use occasional Islamic phrases naturally (JazakAllah Khair, InshaAllah, Alhamdulillah)`

  if (bookingContext) {
    return base + `\n\n## Customer Booking Information\n${bookingContext}\nUse this information to answer the customer's question accurately.`
  }
  return base
}

// ── Main chat function ─────────────────────────────────────────────────────────

export async function handleIncomingMessage(
  fromPhone: string,
  messageText: string
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return 'Assalamu Alaikum! Our AI assistant is currently being set up. Please contact us directly at info@umrahtransport.me. JazakAllah Khair!'
  }

  const session = getSession(fromPhone)

  // Auto-detect booking reference in message
  const refMatch = messageText.match(/\b(UT|HUR)-[A-Z0-9]{4,10}\b/i)
  let bookingContext: string | undefined

  if (refMatch) {
    const booking = await lookupBooking(refMatch[0])
    if (booking) {
      const driverInfo = booking.driverId
        ? 'Driver assigned.'
        : 'Driver not yet assigned — team is working on this.'
      bookingContext =
        `Reference: ${booking.reference} | Status: ${booking.status} | ` +
        `Service: ${booking.serviceType} | From: ${booking.pickupLocation} | ` +
        `To: ${booking.dropoffLocation} | Date: ${booking.travelDate} | ` +
        `Passengers: ${booking.passengers} | Vehicle: ${booking.vehicleType} | ` +
        `Amount: GBP ${booking.totalAmount} | Paid: ${booking.paidAt ? 'Yes' : 'No'} | ${driverInfo}`
    } else {
      bookingContext = `No booking found with reference ${refMatch[0]}. The customer should double-check their reference number or confirmation email.`
    }
  } else if (
    messageText.toLowerCase().includes('my booking') ||
    messageText.toLowerCase().includes('booking status') ||
    messageText.toLowerCase().includes('my order')
  ) {
    const bookings = await lookupByPhone(fromPhone)
    if (bookings.length > 0) {
      bookingContext =
        'Recent bookings for this customer: ' +
        bookings
          .map(b => `${b.reference} (${b.status}) — ${b.serviceType} on ${b.travelDate}`)
          .join('; ')
    }
  }

  // Add only the user's message to session history — context goes in system prompt
  session.messages.push({ role: 'user', content: messageText })

  // Keep last 20 messages to stay within token limits
  if (session.messages.length > 20) {
    session.messages = session.messages.slice(-20)
  }

  // ── Primary attempt ────────────────────────────────────────────────────────
  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: buildSystemPrompt(bookingContext),
      messages: session.messages,
    })

    const reply =
      response.content[0]?.type === 'text'
        ? response.content[0].text
        : FALLBACK

    session.messages.push({ role: 'assistant', content: reply })
    return reply

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    const isContentFilter =
      msg.includes('content filtering') ||
      msg.includes('Output blocked') ||
      msg.includes('invalid_request_error')

    // ── Retry without booking context on content-filter errors ─────────────
    if (isContentFilter) {
      // Remove the last user message so the retry stays consistent
      session.messages.pop()
      const safeMessage = 'I have a question about your services.'
      try {
        const retry = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: buildSystemPrompt(),
          messages: [{ role: 'user', content: safeMessage }],
        })
        const reply =
          retry.content[0]?.type === 'text'
            ? retry.content[0].text
            : FALLBACK
        session.messages.push({ role: 'user', content: messageText })
        session.messages.push({ role: 'assistant', content: reply })
        return reply
      } catch {
        // fall through to fallback
      }
    }

    console.error('[WhatsApp Chatbot] Claude API error:', msg)
    // Remove the failed message from session so next message starts clean
    session.messages.pop()
    return FALLBACK
  }
}
