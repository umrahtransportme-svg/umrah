import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import ServicesSection from '@/components/sections/ServicesSection'
import Stats from '@/components/sections/Stats'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import HowItWorks from '@/components/sections/HowItWorks'
import SpecialServicesSection from '@/components/sections/SpecialServicesSection'
import Testimonials from '@/components/sections/Testimonials'
import BookingCTA from '@/components/sections/BookingCTA'
import JsonLd from '@/components/seo/JsonLd'
import { reviewsSchema, homepageFaqSchema, breadcrumbSchema } from '@/lib/seo'
import { BUSINESS } from '@/lib/config'
import { getContent } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title:
    'Umrah Transport | Premium Pilgrimage Transportation — Makkah, Madinah & Jeddah',
  description:
    'Umrah Transport offers premium, reliable transportation for pilgrims from UK, USA, Canada & Australia. Airport transfers from £45, Makkah–Madinah intercity, Ziyarat tours & guided Umrah. Book online — instant WhatsApp confirmation.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Umrah Transport | Premium Pilgrimage Transportation',
    description:
      'Trusted by 1,000+ pilgrim families from the UK, USA, Canada & Australia. Airport transfers, intercity travel, Ziyarat tours & guided Umrah in Makkah, Madinah & Jeddah.',
    url: BUSINESS.url,
  },
}

export default async function HomePage() {
  const [heroContent, statsContent, whyUsContent, howItWorksContent, ctaContent] =
    await Promise.all([
      getContent('home', 'hero'),
      getContent('home', 'stats'),
      getContent('home', 'why_us'),
      getContent('home', 'how_it_works'),
      getContent('home', 'booking_cta'),
    ])

  return (
    <>
      <JsonLd data={reviewsSchema} />
      <JsonLd
        data={breadcrumbSchema([{ name: 'Home', url: BUSINESS.url }])}
      />
      <JsonLd data={homepageFaqSchema} />
      <Hero content={heroContent} />
      <ServicesSection />
      <Stats content={statsContent} />
      <WhyChooseUs content={whyUsContent} />
      <HowItWorks content={howItWorksContent} />
      <SpecialServicesSection />
      <Testimonials />
      <BookingCTA content={ctaContent} />
    </>
  )
}
