import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, CheckCircle, ArrowRight, Clock, Users } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'
import BookingCTA from '@/components/sections/BookingCTA'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Ziyarat Tours Makkah & Madinah | Guided Islamic Site Visits',
  description:
    'Book guided Ziyarat tours in Makkah and Madinah. Visit Jabal al-Noor, Cave of Hira, Masjid Quba, Uhud Mountain & more. Multilingual guides, private vehicle. Half-day from £75.',
  alternates: { canonical: '/services/ziyarat-tours' },
  openGraph: {
    title: 'Ziyarat Tours Makkah & Madinah | Umrah Transport',
    description:
      'Guided visits to historic Islamic sites in Makkah and Madinah. Private vehicle, multilingual guides. From £75.',
  },
}

const makkahSites = [
  { name: 'Masjid al-Aisha (Miqat)', desc: 'Where pilgrims enter Ihram state' },
  { name: 'Jabal al-Noor', desc: 'Mountain where first Quranic revelation descended' },
  { name: "Cave of Hira (Ghar Hira')", desc: 'Cave where Prophet Muhammad ﷺ received first revelation' },
  { name: "Jabal Thawr", desc: 'Cave where Prophet ﷺ sought shelter during Hijra' },
  { name: "Jannat al-Mu'alla", desc: 'Ancient cemetery where Prophet ﷺ family are buried' },
  { name: 'Masjid al-Jinn', desc: 'Historic mosque with significant Islamic history' },
  { name: 'Mina', desc: 'Valley where pilgrims stay during Hajj & throw Jamarat' },
  { name: 'Muzdalifah', desc: 'Open plain between Mina and Arafat' },
]

const madinahSites = [
  { name: 'Masjid Quba', desc: "First mosque built in Islam's history" },
  { name: 'Masjid Qiblatain', desc: 'Mosque where Qibla direction was changed to Makkah' },
  { name: 'Masjid al-Jumuah', desc: 'First Friday prayer site in Islam' },
  { name: 'Uhud Mountain', desc: "Site of the Battle of Uhud & Sayyid al-Shuhada'" },
  { name: "Jannat al-Baqi'", desc: 'Sacred cemetery next to Masjid an-Nabawi' },
  { name: 'Seven Mosques (Masajid as-Sab\'a)', desc: 'Historic mosques from Battle of Khandaq' },
  { name: "Masjid Ghamama", desc: 'Mosque where first Eid prayer was performed' },
  { name: "Bir al-Ghars", desc: 'Well where Prophet ﷺ performed Ghusl' },
]

const packages = [
  {
    name: 'Makkah Half-Day Ziyarat',
    duration: '4–5 hours',
    sites: '4–5 sites',
    price: 75,
    group: 'Up to 6 people',
    includes: ['Private vehicle', 'English/Urdu guide', 'Hotel pickup', 'Key sites visited'],
  },
  {
    name: 'Makkah Full-Day Ziyarat',
    duration: '8–9 hours',
    sites: '7–8 sites',
    price: 120,
    group: 'Up to 6 people',
    includes: ['Private vehicle', 'English/Urdu guide', 'Hotel pickup', 'All major sites', 'Break included'],
  },
  {
    name: 'Madinah Half-Day Ziyarat',
    duration: '4–5 hours',
    sites: '4–5 sites',
    price: 75,
    group: 'Up to 6 people',
    includes: ['Private vehicle', 'English/Urdu guide', 'Hotel pickup', 'Key sites visited'],
  },
  {
    name: 'Madinah Full-Day Ziyarat',
    duration: '8–9 hours',
    sites: '7–8 sites',
    price: 120,
    group: 'Up to 6 people',
    includes: ['Private vehicle', 'English/Urdu guide', 'Hotel pickup', 'All major sites', 'Break included'],
  },
]

export default function ZiyaratToursPage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-emerald-50 to-white border-b border-slate-100">
        <div className="container-custom py-16 md:py-20">
          <AnimatedSection className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="section-tag">Ziyarat Tours</span>
            </div>
            <h1 className="section-heading mb-4">
              Guided visits to{' '}
              <span className="text-gradient">sacred sites</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Explore the historic Islamic landmarks of Makkah and Madinah with
              our knowledgeable guides. Visit the sites that shaped Islamic
              history — with context, duas and reverence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/book?service=ziyarat-tour" className="btn-primary">
                Book a Ziyarat Tour
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Enquire Now
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Packages */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Tour packages
            </h2>
            <p className="text-slate-500">
              Choose the package that fits your schedule and group size
            </p>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <StaggerItem key={pkg.name}>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 card-lift h-full">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{pkg.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {pkg.sites}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {pkg.group}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {pkg.includes.map((inc) => (
                      <li key={inc} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 text-xs">From</span>
                      <span className="text-xl font-bold text-brand-600 ml-1">
                        {formatPrice(pkg.price)}
                      </span>
                    </div>
                    <Link href="/book?service=ziyarat-tour" className="btn-primary text-sm px-5 py-2.5">
                      Book
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Sites */}
      <section className="section-padding bg-section-alt">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Sites we visit
            </h2>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-10">
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl border border-emerald-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Makkah Sites</h3>
                </div>
                <ul className="space-y-3">
                  {makkahSites.map((site) => (
                    <li key={site.name} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="font-medium text-slate-800 text-sm">{site.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{site.desc}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="bg-white rounded-2xl border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Madinah Sites</h3>
                </div>
                <ul className="space-y-3">
                  {madinahSites.map((site) => (
                    <li key={site.name} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="font-medium text-slate-800 text-sm">{site.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{site.desc}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <BookingCTA />
    </div>
  )
}
