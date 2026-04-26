import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CheckCircle,
  ArrowRight,
  Globe,
  Heart,
  Shield,
  Star,
} from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'
import BookingCTA from '@/components/sections/BookingCTA'

export const metadata: Metadata = {
  title: 'About Umrah Transport | UK-Based Pilgrimage Transport Specialists',
  description:
    'Umrah Transport is a UK-based pilgrimage transportation company serving Muslim families from the UK, USA, Canada and Australia since 2018. Learn about our story, mission and team.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Umrah Transport | Pilgrimage Transport Specialists Since 2018',
    description:
      'Founded in 2018 by a pilgrim, for pilgrims. Learn how Umrah Transport became the trusted choice for over 1,000 families from the UK, USA, Canada and Australia.',
  },
}

const values = [
  {
    icon: Heart,
    title: 'Care & Compassion',
    desc: "Every pilgrim's journey is sacred. We treat each customer with the care and respect they deserve.",
  },
  {
    icon: Shield,
    title: 'Safety First',
    desc: 'All vehicles are fully insured, regularly inspected. All drivers are licensed and DBS-checked.',
  },
  {
    icon: Globe,
    title: 'Cultural Understanding',
    desc: 'We understand the needs of Muslims from Western countries. Our multilingual team is always ready.',
  },
  {
    icon: Star,
    title: 'Excellence Always',
    desc: 'We do not just provide a service — we strive to make your pilgrimage experience unforgettable.',
  },
]

const team = [
  {
    name: 'Abdullah Rahman',
    role: 'Founder & Director',
    bio: 'With 15 years of experience in pilgrimage services, Abdullah founded Hajj Umrah Rentals to give Western Muslims a premium, trustworthy transport option.',
    initials: 'AR',
    color: 'bg-brand-100 text-brand-700',
  },
  {
    name: 'Fatima Malik',
    role: 'Operations Manager',
    bio: 'Fatima oversees all bookings and ensures every customer receives timely, professional service from start to finish.',
    initials: 'FM',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Omar Siddiqui',
    role: 'Head of Driver Relations',
    bio: 'Omar manages our team of professional drivers and ensures every vehicle meets our strict standards of safety and cleanliness.',
    initials: 'OS',
    color: 'bg-amber-100 text-amber-700',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="bg-hero border-b border-slate-100">
        <div className="container-custom py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="section-tag mb-4">About Us</span>
              <h1 className="section-heading mb-5">
                Serving pilgrims with{' '}
                <span className="text-gradient">heart and purpose</span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                Hajj Umrah Rentals was founded with a simple but powerful
                mission: to make the transportation aspect of Umrah
                stress-free, comfortable and deeply professional for Muslim
                families from around the world.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                We understand what it means to travel for worship. Every
                booking is handled with the understanding that this may be
                the most important journey of your life — and we take that
                responsibility seriously.
              </p>
              <div className="flex gap-3">
                <Link href="/book" className="btn-primary">
                  Book a Service
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Contact Us
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '2018', label: 'Founded', sub: 'Serving pilgrims since' },
                  { value: '1,000+', label: 'Pilgrims Served', sub: 'Every year' },
                  { value: '4.9★', label: 'Average Rating', sub: 'From 500+ reviews' },
                  { value: '24/7', label: 'Support', sub: 'Via WhatsApp' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl border border-slate-100 p-5 card-lift"
                  >
                    <div className="text-2xl font-bold text-brand-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="font-semibold text-slate-800 text-sm">
                      {stat.label}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <span className="section-tag mb-4">Our Story</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                Why we started Hajj Umrah Rentals
              </h2>
              <div className="space-y-4 text-slate-500 leading-relaxed text-left">
                <p>
                  Our founder, Abdullah Rahman, made his first Umrah from the
                  UK in 2012. The experience was transformative — but the
                  transport was a constant source of stress. Unreliable drivers,
                  no-shows, vehicles that were not fit for families with
                  children, and language barriers made an already exhausting
                  trip even harder.
                </p>
                <p>
                  Having spoken to hundreds of pilgrims from the UK, USA,
                  Canada and Australia who shared the same frustrations, Abdullah
                  decided to build the service he always wished existed. In 2018,
                  Hajj Umrah Rentals was born — a company built by pilgrims,
                  for pilgrims.
                </p>
                <p>
                  Today, we serve thousands of families every year, with a
                  team of professional, English-speaking drivers and a
                  WhatsApp-first support system that means help is always
                  just one message away.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-section-alt">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Our values
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 card-lift h-full">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              The team behind your journey
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 card-lift text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl ${member.color} flex items-center justify-center mx-auto mb-4 text-xl font-bold`}
                  >
                    {member.initials}
                  </div>
                  <h3 className="font-bold text-slate-900">{member.name}</h3>
                  <div className="text-sm text-brand-600 font-medium mb-3">
                    {member.role}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Trust signals */}
      <section className="section-padding bg-section-alt">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Trusted across the world
            </h2>
          </AnimatedSection>
          <AnimatedSection>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { flag: '🇬🇧', country: 'United Kingdom' },
                { flag: '🇺🇸', country: 'United States' },
                { flag: '🇨🇦', country: 'Canada' },
                { flag: '🇦🇺', country: 'Australia' },
                { flag: '🇩🇪', country: 'Germany' },
                { flag: '🇫🇷', country: 'France' },
                { flag: '🇳🇱', country: 'Netherlands' },
                { flag: '🇸🇪', country: 'Sweden' },
              ].map((c) => (
                <div
                  key={c.country}
                  className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-slate-200 shadow-sm"
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="text-sm font-medium text-slate-700">
                    {c.country}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-10">
            <div className="max-w-2xl mx-auto">
              <ul className="space-y-3">
                {[
                  'Serving 1,000+ pilgrims annually from 20+ countries',
                  'Partnerships with major hotels in Makkah & Madinah',
                  'Trained & certified drivers with years of experience',
                  '24/7 WhatsApp support in English, Urdu & Arabic',
                  'Zero hidden fees — transparent pricing always',
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    <span className="text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <BookingCTA />
    </div>
  )
}
