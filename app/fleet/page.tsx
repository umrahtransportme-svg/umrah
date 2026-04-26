import type { Metadata } from 'next'
import FleetPageClient from '@/components/fleet/FleetPageClient'

export const metadata: Metadata = {
  title: 'Our Fleet',
  description: 'Browse our premium fleet — Sedan, SUV, Luxury SUV, Hiace and Coaster — available for airport transfers, intercity travel and Ziyarat tours across Makkah, Madinah and Jeddah.',
}

export default function FleetPage() {
  return <FleetPageClient />
}
