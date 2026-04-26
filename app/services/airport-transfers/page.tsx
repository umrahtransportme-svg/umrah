import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Plane,
  Clock,
  Shield,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  MessageCircle,
} from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'
import BookingCTA from '@/components/sections/BookingCTA'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbSchema, serviceSchema } from '@/lib/seo'
import { BUSINESS, PRICING } from '@/lib/config'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Jeddah & Madinah Airport Transfers | Umrah Transport',
  description:
    'Book professional Umrah airport transfers from Jeddah Airport (JED) and Madinah Airport (MED). Meet & greet, flight tracking, luxury vehicles. From £45. Trusted by UK & US pilgrim families.',
  alternates: { canonical: '/services/airport-transfers' },
  openGraph: {
    title: 'Jeddah & Madinah Airport Transfers | Umrah Transport',
    description:
      'Professional airport transfers for Umrah pilgrims. Meet & greet at arrivals, flight tracking included. From £45.',
    url: `${BUSINESS.url}/services/airport-transfers`,
  },
}

const routes = [
  { from: 'Jeddah Airport (JED)', to: 'Makkah', sedan: 45, suv: 65, van: 85 },
  { from: 'Jeddah Airport (JED)', to: 'Madinah', sedan: 95, suv: 130, van: 165 },
  { from: 'Jeddah Airport (JED)', to: 'Jeddah City', sedan: 35, suv: 50, van: 70 },
  { from: 'Madinah Airport (MED)', to: 'Madinah City', sedan: 40, suv: 58, van: 78 },
  { from: 'Madinah Airport (MED)', to: 'Makkah', sedan: 95, suv: 130, van: 165 },
]

const features = [
  {
    icon: Plane,
    title: 'Flight Tracking',
    desc: 'We monitor your flight in real-time. Delayed? We will still be there.',
  },
  {
    icon: Users,
    title: 'Meet & Greet',
    desc: 'Your driver waits at arrivals with a name board ready.',
  },
  {
    icon: Clock,
    title: 'Available 24/7',
    desc: 'Early morning or late night arrival — we are always ready.',
  },
  {
    icon: Shield,
    title: 'Fully Insured',
    desc: 'All vehicles are insured and drivers are licensed & vetted.',
  },
  {
    icon: MapPin,
    title: 'All Airports',
    desc: 'Jeddah King Abdulaziz Airport and Madinah Airport covered.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Updates',
    desc: 'Get real-time updates on your driver status via WhatsApp.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a transfer from Jeddah Airport to Makkah cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A private transfer from Jeddah Airport (JED) to Makkah costs from £45 (sedan, up to 3 passengers), £65 (SUV, up to 6 passengers) or £85 (minivan, up to 12 passengers). All prices include meet & greet, flight tracking and luggage assistance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you track my flight if it is delayed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Umrah Transport monitors all flights in real-time. If your flight is delayed, your driver will wait at no extra charge (up to 60 minutes free waiting time). You will also receive WhatsApp updates on your driver\'s status.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer airport transfers from Madinah Airport?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We offer private airport transfers from Madinah Prince Mohammad bin Abdulaziz Airport (MED) to Madinah city hotels, Makkah and Jeddah. Prices start from £40 (sedan) for Madinah Airport to Madinah city.',
      },
    },
  ],
}

export default function AirportTransfersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BUSINESS.url },
          { name: 'Services', url: `${BUSINESS.url}/services` },
          { name: 'Airport Transfers', url: `${BUSINESS.url}/services/airport-transfers` },
        ])}
      />
      <JsonLd
        data={serviceSchema({
          name: 'Umrah Airport Transfers',
          description:
            'Professional meet & greet airport transfers from Jeddah (JED) and Madinah (MED) airports for Umrah pilgrims. Includes flight tracking, name-board greeting and luggage assistance.',
          url: `${BUSINESS.url}/services/airport-transfers`,
          minPrice: PRICING.airportTransfer.sedan,
          serviceType: 'Airport Transfer',
        })}
      />
      <JsonLd data={faqSchema} />

      <div className="pt-16">
        <div className="bg-gradient-to-br from-blue-50 to-white border-b border-slate-100">
          <div className="container-custom py-16 md:py-20">
            <AnimatedSection className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <span className="section-tag">Airport Transfers</span>
              </div>
              <h1 className="section-heading mb-4">
                Umrah airport transfers —{' '}
                <span className="text-gradient">Jeddah & Madinah</span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                From the moment you land at Jeddah or Madinah airport your
                journey is in safe hands. Our professional drivers track your
                flight and greet you with a warm welcome — no matter what time
                you arrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/book" className="btn-primary">
                  Book Airport Transfer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Get a Quote
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Features */}
        <section className="section-padding">
          <div className="container-custom">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Why our airport transfer is different
              </h2>
            </AnimatedSection>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <StaggerItem key={f.title}>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 card-lift">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1.5">{f.title}</h3>
                    <p className="text-slate-500 text-sm">{f.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Pricing */}
        <section className="section-padding bg-section-alt">
          <div className="container-custom">
            <AnimatedSection className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Airport transfer pricing
              </h2>
              <p className="text-slate-500">
                Transparent pricing — no hidden fees, confirmed before booking.
              </p>
            </AnimatedSection>
            <AnimatedSection>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Route</th>
                        <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">Sedan (1–3)</th>
                        <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">SUV (1–6)</th>
                        <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">Minivan (1–12)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routes.map((route, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-brand-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-800">{route.from}</div>
                            <div className="text-xs text-slate-400 mt-0.5">→ {route.to}</div>
                          </td>
                          <td className="text-center px-4 py-4 font-bold text-brand-600">{formatPrice(route.sedan)}</td>
                          <td className="text-center px-4 py-4 font-bold text-brand-600">{formatPrice(route.suv)}</td>
                          <td className="text-center px-4 py-4 font-bold text-brand-600">{formatPrice(route.van)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
                  Prices in GBP. Payment accepted in GBP, USD, CAD & AUD. Return journey available at same rate.
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* What to expect */}
        <section className="section-padding">
          <div className="container-custom">
            <AnimatedSection className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">What to expect</h2>
            </AnimatedSection>
            <AnimatedSection className="max-w-2xl mx-auto">
              <ol className="space-y-6">
                {[
                  { n: '01', title: 'Book online or via WhatsApp', desc: 'Complete your booking with your flight details. We confirm within minutes.' },
                  { n: '02', title: 'We track your flight', desc: 'On the day of travel, we monitor your flight for delays or early arrivals.' },
                  { n: '03', title: 'Driver waits at arrivals', desc: 'Your driver is at arrivals holding a board with your name.' },
                  { n: '04', title: 'Comfortable journey to your hotel', desc: 'Relax in a clean, air-conditioned vehicle as we take you to your hotel.' },
                ].map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-50 border-2 border-brand-100 flex items-center justify-center flex-shrink-0 font-bold text-brand-600 text-sm">{step.n}</div>
                    <div>
                      <h3 className="font-bold text-slate-900">{step.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </AnimatedSection>
          </div>
        </section>

        {/* Included */}
        <section className="py-12 bg-brand-50">
          <div className="container-custom">
            <AnimatedSection className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">Every airport transfer includes</h2>
            </AnimatedSection>
            <AnimatedSection>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  'Meet & Greet with name board',
                  'Flight tracking',
                  'Luggage assistance',
                  'Air-conditioned vehicle',
                  'Licensed professional driver',
                  'WhatsApp updates',
                  'Free waiting time (60 mins)',
                  'Complimentary water',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-brand-100 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        <BookingCTA />
      </div>
    </>
  )
}
