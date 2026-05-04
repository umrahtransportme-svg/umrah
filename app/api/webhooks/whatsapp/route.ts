import { NextRequest, NextResponse } from 'next/server'

const WA_API_URL = 'https://graph.facebook.com/v19.0'

const AUTO_REPLY =
  'Assalamu Alaikum! Thanks for messaging Umrah Transport. Our team will reply shortly. ' +
  'For urgent matters please call +44 7456 938750 or visit umrahtransport.me.'

// ── Webhook verification (Meta sends a GET to verify the endpoint) ─────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// ── Incoming message handler ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: WhatsAppWebhookBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Acknowledge immediately — Meta requires a 200 within 20 seconds
  // We process asynchronously to avoid timeout
  processWebhook(body).catch((err) =>
    console.error('[WhatsApp Webhook] Processing error:', err)
  )

  return NextResponse.json({ status: 'ok' })
}

async function processWebhook(body: WhatsAppWebhookBody) {
  if (body.object !== 'whatsapp_business_account') return

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'messages') continue

      const value = change.value
      if (!value?.messages?.length) continue

      for (const msg of value.messages) {
        await markRead(msg.id)
        await sendReply(msg.from, AUTO_REPLY)
      }
    }
  }
}

// ── WhatsApp Cloud API helpers ─────────────────────────────────────────────────

async function apiCall(endpoint: string, body: object) {
  const token         = process.env.WHATSAPP_API_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneNumberId) return

  await fetch(`${WA_API_URL}/${phoneNumberId}/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

async function sendReply(to: string, text: string) {
  await apiCall('messages', {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: text, preview_url: false },
  })
}

async function markRead(messageId: string) {
  await apiCall('messages', {
    messaging_product: 'whatsapp',
    status: 'read',
    message_id: messageId,
  })
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface WhatsAppWebhookBody {
  object: string
  entry?: Array<{
    changes?: Array<{
      field: string
      value?: {
        messages?: Array<{
          id: string
          from: string
          type: string
          text?: { body: string }
          timestamp: string
        }>
      }
    }>
  }>
}
