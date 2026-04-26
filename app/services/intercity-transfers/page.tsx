import type { Metadata } from 'next'
import Link from 'next/link'
import { Car, MapPin, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'
import BookingCTA from '@/components/sections/BookingCTA'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Makkah to Madinah Transfer | Intercity Umrah Transport',
  description:
    'Private intercity transfers between Makkah, Madinah and Jeddah. Sedan, SUV or minivan — fully private, no shared taxis. Makkah–Madinah from £85. Book online with Umrah Transport.',
  alternates: { canonical: '/services/intercity-transfers' },
  openGraph: {
    title: 'Makkah to Madinah Transfer | Umrah Transport',
    description:
      'Private transfers between Makkah, Madinah and Jeddah for Umrah pilgrims. From £85. No shared taxis — your vehicle, your schedule.',
  },
}

const routes = [
  {
    from: 'Makkah',
    to: 'Madinah',
    distance: '~450 km',
    duration: '~5 hrs',
    sedan: 85,
    suv: 115,
    van: 145,
  },
  {
    from: 'Madinah',
    to: 'Makkah',
    distance: '~450 km',
    duration: '~5 hrs',
    sedan: 85,
    suv: 115,
    van: 145,
  },
  {
    from: 'Makkah',
    to: 'Jeddah',
    distance: '~90 km',
    duration: '~1.5 hrs',
    sedan: 50,
    suv: 70,
    van: 95,
  },
  {
    from: 'Madinah',
    to: 'Jeddah',
    distance: '~420 km',
    duration: '~4.5 hrs',
    sedan: 80,
    suv: 110,
    van: 140,
  },
  {
    from: 'Jeddah',
    to: 'Makkah',
    distance: '~90 km',
    duration: '~1.5 hrs',
    sedan: 50,
    suv: 70,
    van: 95,
  },
]

const vehicles = [
  {
    name: 'Sedan',
    capacity: '1–3 passengers',
    example: 'Toyota Camry or similar',
    features: ['Air conditioning', 'Comfortable seating', 'Boot storage', 'USB charging'],
  },
  {
    name: 'SUV',
    capacity: '1–6 passengers',
    example: 'Toyota Land Cruiser or similar',
    features: ['Spacious interior', 'Extra luggage room', 'Luxury comfort', 'USB charging'],
  },
  {
    name: 'Minivan',
    capacity: '1–12 passengers',
    example: 'Toyota HiAce or similar',
    features: ['Large group capacity', 'Maximum luggage', 'Air conditioning', 'Fold-down seats'],
  },
]

export default function IntercityTransfersPage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-violet-50 to-white border-b border-slate-100">
        <div className="container-custom py-16 md:py-20">
          <AnimatedSection className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-violet-600" />
              </div>
              <span className="section-tag">Intercity Transfers</span>
            </div>
            <h1 className="section-heading mb-4">
              Private transfers between{' '}
              <span className="text-gradient">holy cities</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Travel comfortably between Makkah, Madinah and Jeddah in a
              private vehicle. No shared taxis — your private car, your
              schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/book?service=intercity-transfer" className="btn-primary">
                Book a Transfer
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Get a Quote
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Why private */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Why choose private transfer?
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Car, title: 'Private Vehicle', desc: 'No strangers, no sharing. Your family, your space.' },
              { icon: Clock, title: 'Your Schedule', desc: 'Depart when you want. Stops allowed on request.' },
              { icon: MapPin, title: 'Door to Door', desc: 'Picked up from your hotel. Dropped at your destination.' },
              { icon: Shield, title: 'Safe & Insured', desc: 'All vehicles fully insured with professional drivers.' },
            ].map((f) => (
              <StaggerItem key={f.title}>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 card-lift text-center">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <f.icon className="w-5 h-5 text-violet-600" />
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
              Route pricing
            </h2>
            <p className="text-slate-500">Transparent pricing for all intercity routes</p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Route</th>
                      <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">Sedan</th>
                      <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">SUV</th>
                      <th className="text-center px-4 py-4 text-sm font-semibold text-slate-600">Minivan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-brand-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800 text-sm">
                            {route.from} → {route.to}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {route.distance} · {route.duration}
                          </div>
                        </td>
                        <td className="text-center px-4 py-4 font-bold text-brand-600">
                          {formatPrice(route.sedan)}
                        </td>
                        <td className="text-center px-4 py-4 font-bold text-brand-600">
                          {formatPrice(route.suv)}
                        </td>
                        <td className="text-center px-4 py-4 font-bold text-brand-600">
                          {formatPrice(route.van)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Vehicles */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Choose your vehicle</h2>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <StaggerItem key={v.name}>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 card-lift">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{v.name}</h3>
                  <div className="text-sm text-brand-600 font-medium mb-0.5">{v.capacity}</div>
                  <div className="text-xs text-slate-400 mb-4">{v.example}</div>
                  <ul className="space-y-2">
                    {v.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
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
