import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Umrah Transport',
    short_name: 'Umrah Transport',
    description:
      'Premium transportation for Umrah pilgrims — airport transfers, intercity travel & Ziyarat tours in Makkah, Madinah & Jeddah.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait',
    categories: ['travel', 'transportation', 'religion'],
    lang: 'en-GB',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Book a Transfer',
        short_name: 'Book Now',
        description: 'Start a new Umrah transport booking',
        url: '/book',
      },
      {
        name: 'Airport Transfers',
        short_name: 'Airport',
        description: 'Jeddah & Madinah airport transfers',
        url: '/services/airport-transfers',
      },
    ],
  }
}
