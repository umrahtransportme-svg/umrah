import { BUSINESS } from './config'

export function getWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodedMessage}`
}

export function buildBookingMessage(data: {
  service: string
  pickup: string
  dropoff: string
  date: string
  time: string
  passengers: number
  vehicle: string
  name: string
  bookingRef: string
}): string {
  return `🕌 *New Booking Request - Hajj Umrah Rentals*

📋 *Booking Reference:* ${data.bookingRef}

🚗 *Service:* ${data.service}
📍 *From:* ${data.pickup}
📍 *To:* ${data.dropoff}
📅 *Date:* ${data.date}
⏰ *Time:* ${data.time}
👥 *Passengers:* ${data.passengers}
🚙 *Vehicle:* ${data.vehicle}
👤 *Name:* ${data.name}

Please confirm availability and pricing. Thank you!`
}

export function openWhatsApp(message: string): void {
  if (typeof window !== 'undefined') {
    window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
  }
}
