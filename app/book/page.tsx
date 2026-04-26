import type { Metadata } from 'next'
import BookPage from '@/components/booking/BookPage'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/seo'
import { BUSINESS } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Book Umrah Transport | Add Services & Pay Online',
  description:
    'Book multiple Umrah transport services in one order — airport transfers, intercity travel, Ziyarat tours, Umrah with Qari & elderly assistance. Secure Stripe payment. Instant WhatsApp confirmation.',
  alternates: { canonical: '/book' },
  openGraph: {
    title: 'Book Umrah Transport Online | Umrah Transport',
    description:
      'Add services to your cart and pay securely by card. Airport transfers from £45, intercity from £85.',
    url: `${BUSINESS.url}/book`,
  },
}

export default function BookPageRoute() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: BUSINESS.url },
        { name: 'Book Now', url: `${BUSINESS.url}/book` },
      ])} />
      <BookPage />
    </>
  )
}
