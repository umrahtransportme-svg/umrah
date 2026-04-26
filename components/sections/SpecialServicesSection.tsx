import Link from 'next/link'
import { Star, Heart, CheckCircle, ArrowRight, BookOpen } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { formatPrice } from '@/lib/utils'

export default function SpecialServicesSection() {
  return (
    <section className="section-padding bg-section-alt">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-14">
          <span className="section-tag mb-4">Premium Services</span>
          <h2 className="section-heading">
            Designed for{' '}
            <span className="text-gradient">every pilgrim</span>
          </h2>
          <p className="section-subheading max-w-2xl mx-auto">
            We offer specialised services for pilgrims who need extra guidance
            or care — because everyone deserves a meaningful Umrah experience.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Umrah with Qari */}
          <AnimatedSection direction="left">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
                  <Star className="w-7 h-7 text-white fill-white/40" />
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  Most Requested
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-3">Umrah with Qari</h3>
              <p className="text-brand-100 leading-relaxed mb-6">
                Experience a deeply meaningful Umrah with a qualified Qari
                guiding you every step of the way. Perfect for first-time
                pilgrims who want to perform Umrah correctly and spiritually.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Step-by-step Umrah guidance',
                  'Qualified & certified Qari',
                  'English, Urdu & Arabic available',
                  'Private or small group sessions',
                  'Includes transport to/from Haram',
                  'Ideal for first-time pilgrims',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-200 flex-shrink-0" />
                    <span className="text-brand-100 text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-5 border-t border-white/20">
                <div>
                  <span className="text-brand-200 text-sm">Starting from</span>
                  <div className="text-3xl font-bold mt-0.5">
                    {formatPrice(180)}
                  </div>
                </div>
                <Link
                  href="/services/special-services#umrah-qari"
                  className="flex items-center gap-2 bg-white text-brand-700 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-brand-50 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Book Now
                </Link>
              </div>
            </div>
          </AnimatedSection>

          {/* Elderly & Disabled */}
          <AnimatedSection direction="right">
            <div className="bg-white rounded-3xl p-8 border border-rose-100 h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-rose-500 fill-rose-200" />
                </div>
                <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-semibold border border-rose-100">
                  Care & Comfort
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Elderly & Disabled Assistance
              </h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                We provide compassionate, professional support for elderly or
                disabled pilgrims — from wheelchair assistance to a dedicated
                personal helper throughout your Umrah journey.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Dedicated personal helper',
                  'Wheelchair & mobility support',
                  'Haram entry/exit assistance',
                  'Door-to-door service',
                  'Half-day or full-day booking',
                  'Priority comfort throughout',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-sm">Starting from</span>
                  <div className="text-3xl font-bold text-slate-900 mt-0.5">
                    {formatPrice(85)}
                  </div>
                </div>
                <Link
                  href="/services/special-services#elderly"
                  className="flex items-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors shadow-brand"
                >
                  <Heart className="w-4 h-4" />
                  Book Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
