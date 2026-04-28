import Link from 'next/link'
import { Plane, Car, MapPin, Star, Heart, Wrench, ArrowRight, ChevronRight } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { formatPrice } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

const ICON_MAP: Record<string, React.ElementType> = { Plane, Car, MapPin, Star, Heart, Wrench }

const SERVICE_META: Record<string, { href: string; features: string[]; badge: string | null; accent: string }> = {
  'Airport Transfer':    { href: '/services/airport-transfers',   features: ['Meet & Greet service', 'Flight tracking', 'All airports covered'],       badge: 'Most Popular', accent: 'border-blue-100' },
  'Intercity Transfer':  { href: '/services/intercity-transfers', features: ['Private vehicle', 'All route options', 'Door-to-door service'],            badge: null,           accent: 'border-violet-100' },
  'Ziyarat Tours':       { href: '/services/ziyarat-tours',       features: ['Licensed guide', 'Makkah & Madinah', 'Half/Full day'],                     badge: null,           accent: 'border-emerald-100' },
  'Umrah with Qari':     { href: '/services/special-services#umrah-qari', features: ['Qualified Qari guide', 'EN / UR / AR', 'Ideal for beginners'],     badge: 'Premium',      accent: 'border-amber-100' },
  'Elderly Assistance':  { href: '/services/special-services#elderly',    features: ['Wheelchair support', 'Personal helper', '10-hr or daily booking'], badge: null,           accent: 'border-rose-100' },
}

function getStartingPrice(pricing: unknown): number {
  if (!Array.isArray(pricing) || pricing.length === 0) return 0
  return Math.min(...pricing.map((p: { price: number }) => p.price))
}

export default async function ServicesSection() {
  const services = await prisma.service.findMany({
    where: { enabled: true },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
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

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = ICON_MAP[service.iconName] || Wrench
            const meta = SERVICE_META[service.name] ?? { href: '/book', features: [], badge: null, accent: 'border-slate-100' }
            const startingFrom = getStartingPrice(service.pricing)
            const [bgColor, textColor] = service.colorClass.split(' ')

            return (
              <StaggerItem key={service.id}>
                <Link
                  href={meta.href}
                  className={`group relative flex flex-col h-full bg-white rounded-2xl border ${meta.accent} hover:border-brand-200 p-6 card-lift transition-all duration-300 hover:shadow-card-hover`}
                >
                  {meta.badge && (
                    <span className="absolute top-4 right-4 px-2.5 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full">
                      {meta.badge}
                    </span>
                  )}

                  <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-6 h-6 ${textColor}`} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">{service.description}</p>

                  {meta.features.length > 0 && (
                    <ul className="space-y-1.5 mb-5">
                      {meta.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                          <ChevronRight className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400">From</span>
                      <span className="text-lg font-bold text-brand-600 ml-1">
                        {formatPrice(startingFrom)}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        <AnimatedSection delay={0.3} className="text-center mt-10">
          <Link href="/book" className="btn-primary text-base px-8 py-4 rounded-2xl">
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
