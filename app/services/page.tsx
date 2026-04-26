import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Plane,
  Car,
  MapPin,
  Star,
  Heart,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'
import BookingCTA from '@/components/sections/BookingCTA'

export const metadata: Metadata = {
  title: 'Umrah Transport Services | Airport, Intercity, Ziyarat & More',
  description:
    'Complete Umrah transportation services: airport transfers (from £45), intercity travel (from £85), Ziyarat tours (from £75), guided Umrah with Qari & elderly assistance. Operating in Makkah, Madinah & Jeddah.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Umrah Transport Services | Umrah Transport',
    description:
      'Airport transfers, intercity travel, Ziyarat tours, guided Umrah & elderly assistance for pilgrims from UK, USA, Canada & Australia.',
  },
}

const services = [
  {
    icon: Plane,
    title: 'Airport Transfers',
    description:
      'Professional meet & greet service at Jeddah King Abdulaziz Airport and Madinah Airport. We track your flight so we are always there on time — even if your flight is delayed.',
    keyPoints: [
      'Meet & Greet with name board',
      'Flight tracking included',
      'Jeddah & Madinah airports',
      'Both arrivals & departures',
      'Help with luggage',
      'Air-conditioned vehicles',
    ],
    startingFrom: 45,
    href: '/services/airport-transfers',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: 'Most Popular',
  },
  {
    icon: Car,
    title: 'Intercity Transfers',
    description:
      'Comfortable private transfers between the holy cities. Travel from Makkah to Madinah, Madinah to Makkah, or any city to Jeddah in style and comfort.',
    keyPoints: [
      'Makkah ↔ Madinah',
      'Makkah / Madinah → Jeddah',
      'Private vehicle (no sharing)',
      'Sedan, SUV or Minivan',
      'Door-to-hotel service',
      'Stops by request',
    ],
    startingFrom: 85,
    href: '/services/intercity-transfers',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600',
    badge: null,
  },
  {
    icon: MapPin,
    title: 'Ziyarat Tours',
    description:
      'Guided religious site visits in Makkah and Madinah. Visit historically significant Islamic landmarks with a knowledgeable English/Urdu/Arabic speaking guide.',
    keyPoints: [
      'Makkah & Madinah Ziyarat',
      'Qualified bilingual guide',
      'All key historical sites',
      'Half-day & full-day options',
      'Private group tours',
      'Flexible scheduling',
    ],
    startingFrom: 75,
    href: '/services/ziyarat-tours',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badge: null,
  },
  {
    icon: Star,
    title: 'Umrah with Qari',
    description:
      'Experience a deeply meaningful Umrah with step-by-step guidance from a qualified Qari. Ideal for first-time pilgrims who want to perform Umrah correctly and spiritually.',
    keyPoints: [
      'Certified Qari guide',
      'English, Urdu & Arabic',
      'Step-by-step guidance',
      'From Ihram to completion',
      'Transport to/from Haram',
      'Small private groups',
    ],
    startingFrom: 180,
    href: '/services/special-services#umrah-qari',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    badge: 'Premium',
  },
  {
    icon: Heart,
    title: 'Elderly & Disabled Assistance',
    description:
      'Compassionate, professional support for elderly or disabled pilgrims. We provide a personal helper, wheelchair support, and ensure a comfortable, dignified Umrah experience.',
    keyPoints: [
      'Dedicated personal helper',
      'Wheelchair & mobility support',
      'Haram entry/exit assistance',
      'Door-to-door full service',
      'Half-day & full-day booking',
      'Priority care throughout',
    ],
    startingFrom: 85,
    href: '/services/special-services#elderly',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
    badge: 'Care',
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="bg-hero border-b border-slate-100">
        <div className="container-custom py-16 md:py-20 text-center">
          <AnimatedSection>
            <span className="section-tag mb-4">Our Services</span>
            <h1 className="section-heading mb-4">
              Complete transport for{' '}
              <span className="text-gradient">your pilgrimage</span>
            </h1>
            <p className="section-subheading max-w-2xl mx-auto">
              From airport arrivals to Ziyarat tours — we offer every service a
              pilgrim needs, with professionalism and care at every step.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Services */}
      <section className="section-padding">
        <div className="container-custom">
          <StaggerContainer className="space-y-8">
            {services.map((svc, i) => (
              <StaggerItem key={svc.title}>
                <div
                  className={`bg-white rounded-3xl border border-slate-100 overflow-hidden card-lift`}
                >
                  <div
                    className={`grid lg:grid-cols-2 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                  >
                    {/* Content */}
                    <div className="p-8 md:p-10">
                      {svc.badge && (
                        <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-xs font-semibold rounded-full border border-brand-100 mb-4">
                          {svc.badge}
                        </span>
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-2xl ${svc.bgColor} flex items-center justify-center`}
                        >
                          <svc.icon className={`w-6 h-6 ${svc.iconColor}`} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          {svc.title}
                        </h2>
                      </div>

                      <p className="text-slate-500 leading-relaxed mb-6">
                        {svc.description}
                      </p>

                      <div className="flex items-center gap-3 mb-6">
                        <div>
                          <span className="text-slate-400 text-sm">From</span>
                          <span className="text-2xl font-bold text-brand-600 ml-1.5">
                            {formatPrice(svc.startingFrom)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link href="/book" className="btn-primary">
                          Book Now
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href={svc.href} className="btn-secondary">
                          Learn More
                        </Link>
                      </div>
                    </div>

                    {/* Features */}
                    <div className={`${svc.bgColor} p-8 md:p-10`}>
                      <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
                        What&apos;s included
                      </h3>
                      <ul className="space-y-3">
                        {svc.keyPoints.map((point) => (
                          <li
                            key={point}
                            className="flex items-center gap-3"
                          >
                            <ChevronRight
                              className={`w-4 h-4 ${svc.iconColor} flex-shrink-0`}
                            />
                            <span className="text-slate-700 text-sm font-medium">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BookingCTA />
    </div>
  )
}
