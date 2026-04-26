import type { Metadata } from 'next'
import { BUSINESS } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Contact Umrah Transport | WhatsApp, Email & Phone',
  description:
    'Contact Umrah Transport 24/7 via WhatsApp, email or phone. Get an instant quote for airport transfers, intercity travel, Ziyarat tours or guided Umrah in Makkah, Madinah & Jeddah.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Umrah Transport | Available 24/7',
    description:
      '24/7 support via WhatsApp. Instant quotes for all Umrah transportation services.',
    url: `${BUSINESS.url}/contact`,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
