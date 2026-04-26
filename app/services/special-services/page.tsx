import type { Metadata } from 'next'
import Link from 'next/link'
import { Star, Heart, CheckCircle, ArrowRight, BookOpen } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import BookingCTA from '@/components/sections/BookingCTA'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Umrah with Qari & Elderly Assistance | Umrah Transport',
  description:
    'Guided Umrah with a certified Qari (from £180) and compassionate elderly & disabled assistance (from £85). English, Urdu & Arabic. Perfect for first-time pilgrims and those needing extra support.',
  alternates: { canonical: '/services/special-services' },
  openGraph: {
    title: 'Umrah with Qari & Elderly Assistance | Umrah Transport',
    description:
      'Step-by-step guided Umrah with a certified Qari, plus wheelchair and personal helper services for elderly pilgrims.',
  },
}

export default function SpecialServicesPage() {
  return (
    <div className="pt-16">
      <div className="bg-hero border-b border-slate-100">
        <div className="container-custom py-16 md:py-20 text-center">
          <AnimatedSection>
            <span className="section-tag mb-4">Special Services</span>
            <h1 className="section-heading mb-4">
              Premium care for{' '}
              <span className="text-gradient">every pilgrim</span>
            </h1>
            <p className="section-subheading max-w-2xl mx-auto">
              Specialised services designed for those who need extra guidance,
              support or care during their sacred journey.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Umrah with Qari */}
      <section id="umrah-qari" className="section-padding scroll-mt-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <span className="section-tag">Guided Umrah</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Umrah with Qualified Qari
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Performing Umrah correctly and spiritually is the dream of every
                Muslim. Our Umrah with Qari service pairs you with a certified
                Islamic scholar who will guide you through every ritual — from
                the intention (niyyah) and Tawaf to Sa'i and completion.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                Whether it is your first Umrah or you want to perfect your
                performance, our Qari will ensure a meaningful, spiritually
                enriching experience in the language you are most comfortable in.
              </p>
              <Link href="/book?service=umrah-with-qari" className="btn-primary">
                <BookOpen className="w-4 h-4" />
                Book Umrah with Qari
                <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white">
                <div className="text-3xl font-bold mb-1">
                  From {formatPrice(180)}
                </div>
                <div className="text-brand-200 text-sm mb-6">Per person · Private session</div>

                <h4 className="text-white font-semibold mb-4">What is included:</h4>
                <ul className="space-y-3 mb-8">
                  {[
                    'Step-by-step Umrah guidance from start to finish',
                    'Certified & qualified Qari (Islamic scholar)',
                    'Available in English, Urdu & Arabic',
                    'Correct pronunciation of duas & prayers',
                    'Transportation to & from Masjid al-Haram',
                    'Private session (1–4 people)',
                    'Flexible timing (morning/evening)',
                    'Suitable for first-timers & experienced pilgrims',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-200 flex-shrink-0 mt-0.5" />
                      <span className="text-brand-100 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-white/10 rounded-2xl p-4 text-sm text-brand-100">
                  <strong className="text-white">Multilingual:</strong> Our
                  Qaris speak English, Urdu and Arabic — so every instruction is
                  clear and understood.
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-slate-100 h-px mx-auto max-w-7xl" />

      {/* Elderly Assistance */}
      <section id="elderly" className="section-padding scroll-mt-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left" className="order-2 lg:order-1">
              <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  From {formatPrice(85)}
                </div>
                <div className="text-slate-500 text-sm mb-6">Per session · Half-day or full-day</div>

                <h4 className="text-slate-800 font-semibold mb-4">Our assistance includes:</h4>
                <ul className="space-y-3 mb-8">
                  {[
                    'Dedicated personal helper (trained & respectful)',
                    'Wheelchair & mobility aid support',
                    'Hotel to Haram transport (return)',
                    'Assistance entering & exiting Masjid al-Haram',
                    'Tawaf & Sa\'i support (wheelchair Tawaf available)',
                    'Prayer area guidance & positioning',
                    'Wudu assistance if required',
                    'Emergency & medical coordination support',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-4 border border-rose-100 text-center">
                    <div className="text-xl font-bold text-brand-600">{formatPrice(85)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Half-day (5 hrs)</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-rose-100 text-center">
                    <div className="text-xl font-bold text-brand-600">{formatPrice(150)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Full-day (10 hrs)</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" className="order-1 lg:order-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <span className="section-tag">Elderly & Disabled</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Compassionate Care for Elderly Pilgrims
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Every pilgrim deserves to perform Umrah with dignity and ease.
                Our elderly and disabled assistance service provides a trained
                personal helper who stays by your side throughout the entire
                journey — from your hotel room to the Haram and back.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                Our helpers are patient, respectful and experienced in
                supporting pilgrims with mobility limitations, ensuring a
                peaceful and comfortable Umrah experience for your loved ones.
              </p>
              <Link href="/book?service=elderly-assistance" className="btn-primary">
                <Heart className="w-4 h-4" />
                Book Assistance
                <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <BookingCTA />
    </div>
  )
}
