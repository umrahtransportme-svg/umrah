import {
  Globe,
  Shield,
  Clock,
  HeartHandshake,
  Star,
  Smartphone,
} from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'

const reasons = [
  {
    icon: Globe,
    title: 'Multilingual Drivers',
    description:
      'Our professional drivers speak English, Urdu & Arabic — ensuring clear communication throughout your journey.',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Star,
    title: 'Trusted by UK & US Families',
    description:
      'Over 1,000 pilgrim families from the UK, USA, Canada & Australia trust us for their sacred journeys each year.',
    color: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description:
      'We are available around the clock via WhatsApp. Flight delays, last-minute changes — we handle everything.',
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Shield,
    title: 'Safe & Reliable',
    description:
      'All vehicles are fully insured and regularly maintained. Our drivers are licensed, vetted and professionally trained.',
    color: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: HeartHandshake,
    title: 'Personalised Care',
    description:
      'Every pilgrim is different. We tailor our service to your needs — elderly care, family groups, solo travelers.',
    color: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    icon: Smartphone,
    title: 'Instant Confirmation',
    description:
      'Book online or via WhatsApp and receive instant booking confirmation with all journey details.',
    color: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
]

const countriesTrusted = ['🇬🇧 United Kingdom', '🇺🇸 United States', '🇨🇦 Canada', '🇦🇺 Australia', '🇪🇺 Europe']

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-section-alt">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-14">
          <span className="section-tag mb-4">Why Choose Us</span>
          <h2 className="section-heading">
            The pilgrims&#39; choice for{' '}
            <span className="text-gradient">reliable transport</span>
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            We understand that your pilgrimage is one of the most important
            journeys of your life. That is why we go above and beyond to make
            every moment comfortable, safe and meaningful.
          </p>

          {/* Countries trust bar */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {countriesTrusted.map((country) => (
              <span
                key={country}
                className="px-3 py-1.5 bg-white rounded-full text-sm text-slate-600 font-medium border border-slate-200 shadow-sm"
              >
                {country}
              </span>
            ))}
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <StaggerItem key={reason.title}>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-brand-100 card-lift h-full">
                <div
                  className={`w-11 h-11 rounded-xl ${reason.color} flex items-center justify-center mb-4`}
                >
                  <reason.icon className={`w-5 h-5 ${reason.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
