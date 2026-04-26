'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Plane,
  Car,
  MapPin,
  Star,
  Heart,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { formatPrice } from '@/lib/utils'

const services = [
  {
    id: 'airport-transfers',
    icon: Plane,
    title: 'Airport Transfers',
    description:
      'Professional meet & greet service at Jeddah and Madinah airports. Flight tracking included — we wait for you.',
    features: ['Meet & Greet service', 'Flight tracking', 'All airports covered'],
    startingFrom: 45,
    href: '/services/airport-transfers',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    accent: 'border-blue-100',
    badge: 'Most Popular',
  },
  {
    id: 'intercity-transfers',
    icon: Car,
    title: 'Intercity Transfers',
    description:
      'Comfortable private transfers between Makkah, Madinah & Jeddah. Sedan, SUV or minivan — your choice.',
    features: ['Private vehicle', 'All route options', 'Door-to-door service'],
    startingFrom: 85,
    href: '/services/intercity-transfers',
    color: 'bg-violet-50',
    iconColor: 'text-violet-600',
    accent: 'border-violet-100',
    badge: null,
  },
  {
    id: 'ziyarat-tours',
    icon: MapPin,
    title: 'Ziyarat Tours',
    description:
      'Guided religious site tours in Makkah and Madinah. Visit historic Islamic landmarks with knowledgeable guides.',
    features: ['Licensed guide', 'Makkah & Madinah', 'Half/Full day'],
    startingFrom: 75,
    href: '/services/ziyarat-tours',
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    accent: 'border-emerald-100',
    badge: null,
  },
  {
    id: 'umrah-with-qari',
    icon: Star,
    title: 'Umrah with Qari',
    description:
      'Step-by-step guided Umrah experience with a qualified Qari. Perfect for first-time pilgrims. Multilingual.',
    features: ['Qualified Qari guide', 'EN / UR / AR', 'Ideal for beginners'],
    startingFrom: 180,
    href: '/services/special-services#umrah-qari',
    color: 'bg-amber-50',
    iconColor: 'text-amber-600',
    accent: 'border-amber-100',
    badge: 'Premium',
  },
  {
    id: 'elderly-assistance',
    icon: Heart,
    title: 'Elderly & Disabled',
    description:
      'Personal care & wheelchair assistance for elderly or disabled pilgrims. Door-to-door with dedicated helper.',
    features: ['Wheelchair support', 'Personal helper', '10-hr or daily booking'],
    startingFrom: 85,
    href: '/services/special-services#elderly',
    color: 'bg-rose-50',
    iconColor: 'text-rose-600',
    accent: 'border-rose-100',
    badge: null,
  },
]

export default function ServicesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Heading */}
        <AnimatedSection className="text-center mb-14">
          <span className="section-tag mb-4">Our Services</span>
          <h2 className="section-heading">
            Everything you need for{' '}
            <span className="text-gradient">your pilgrimage</span>
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            From the moment you land to the completion of your sacred journey —
            we provide premium transportation and assistance at every step.
          </p>
        </AnimatedSection>

        {/* Services grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <Link
                href={service.href}
                className={`group relative flex flex-col h-full bg-white rounded-2xl border ${service.accent} hover:border-brand-200 p-6 card-lift transition-all duration-300 hover:shadow-card-hover`}
              >
                {/* Badge */}
                {service.badge && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full">
                    {service.badge}
                  </span>
                )}

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-1.5 mb-5">
                  {service.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400">From</span>
                    <span className="text-lg font-bold text-brand-600 ml-1">
                      {formatPrice(service.startingFrom)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.3} className="text-center mt-10">
          <Link
            href="/book"
            className="btn-primary text-base px-8 py-4 rounded-2xl"
          >
            Book Any Service Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-slate-400 mt-3">
            Instant WhatsApp confirmation · No hidden fees
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
