// Server-side WhatsApp Cloud API (Meta) notifications

const WA_API_URL = 'https://graph.facebook.com/v19.0'

function isConfigured() {
  return Boolean(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)
}

function cleanPhone(raw: string): string {
  return raw.replace(/\s+/g, '').replace(/[^\d+]/g, '').replace(/^(?!\+)/, '+')
}

async function sendText(to: string, message: string): Promise<boolean> {
  if (!isConfigured()) return false
  try {
    const res = await fetch(
      `${WA_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone(to),
          type: 'text',
          text: { body: message, preview_url: false },
        }),
      }
    )
    if (!res.ok) {
      const err = await res.text()
      console.error('[WhatsApp] Send failed:', err)
    }
    return res.ok
  } catch (err) {
    console.error('[WhatsApp] Network error:', err)
    return false
  }
}

// ── Customer: Booking Confirmed ───────────────────────────────────────────────

export async function notifyCustomerBookingConfirmed(data: {
  customerPhone: string
  customerName: string
  bookingRef: string
  serviceType: string
  travelDate: string
  pickupLocation: string
  totalAmount: number
}) {
  const msg = `🕌 *Booking Confirmed — Hajj Umrah Rentals*

Assalamu Alaikum ${data.customerName} 🤲

Your booking is *confirmed* and payment received!

📋 *Ref:* ${data.bookingRef}
🚗 *Service:* ${data.serviceType}
📍 *Pickup:* ${data.pickupLocation}
📅 *Date:* ${data.travelDate}
💷 *Total:* £${data.totalAmount}

Your driver details will be sent shortly. Barakallahu Feekum! 🕋

_— Hajj Umrah Rentals_`

  await sendText(data.customerPhone, msg)
}

// ── Customer: Driver Assigned ─────────────────────────────────────────────────

export async function notifyCustomerDriverAssigned(data: {
  customerPhone: string
  customerName: string
  bookingRef: string
  driverName: string
  driverPhone: string
  vehicleInfo: string
  travelDate: string
  pickupLocation: string
}) {
  const msg = `🚗 *Driver Assigned — ${data.bookingRef}*

Assalamu Alaikum ${data.customerName}!

Your driver has been assigned:

👤 *Driver:* ${data.driverName}
📞 *WhatsApp:* ${data.driverPhone}
🚙 *Vehicle:* ${data.vehicleInfo}
📅 *Date:* ${data.travelDate}
📍 *Pickup:* ${data.pickupLocation}

Please save your driver's number and contact them for any coordination on arrival.

_— Hajj Umrah Rentals_`

  await sendText(data.customerPhone, msg)
}

// ── Driver: New Job Assigned ──────────────────────────────────────────────────

export async function notifyDriverJobAssigned(data: {
  driverPhone: string
  driverName: string
  customerName: string
  customerPhone: string
  bookingRef: string
  serviceType: string
  pickupLocation: string
  dropoffLocation: string
  travelDate: string
  travelTime?: string
  passengers: number
  notes?: string
}) {
  const msg = `🚗 *New Job Assigned — Hajj Umrah Rentals*

Dear ${data.driverName},

You have a new booking:

📋 *Ref:* ${data.bookingRef}
👤 *Customer:* ${data.customerName}
📞 *Customer No.:* ${data.customerPhone}
🚗 *Service:* ${data.serviceType}
📍 *From:* ${data.pickupLocation}
📍 *To:* ${data.dropoffLocation}
📅 *Date:* ${data.travelDate}${data.travelTime ? ` at ${data.travelTime}` : ''}
👥 *Passengers:* ${data.passengers}${data.notes ? `\n📝 *Notes:* ${data.notes}` : ''}

Please be at the pickup location on time. JazakAllah Khair!`

  await sendText(data.driverPhone, msg)
}

// ── Admin: New Booking Alert ──────────────────────────────────────────────────

export async function notifyAdminNewBooking(data: {
  bookingRef: string
  customerName: string
  serviceType: string
  travelDate: string
  totalAmount: number
}) {
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER
  if (!adminPhone) return

  const msg = `📋 *New Booking Received*

Ref: ${data.bookingRef}
Customer: ${data.customerName}
Service: ${data.serviceType}
Date: ${data.travelDate}
Amount: £${data.totalAmount}

Login to admin to assign driver if auto-assignment failed.`

  await sendText(adminPhone, msg)
}
