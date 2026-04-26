import Link from 'next/link'
import { ArrowRight, MessageCircle, Phone } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { WHATSAPP_MESSAGES, BUSINESS } from '@/lib/config'

export default function BookingCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
      <div className="absolute inset-0 pattern-dots opacity-5" />

      <div className="container-custom relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            Ready to book your{' '}
            <span className="text-brand-200">Umrah transport?</span>
          </h2>
          <p className="text-brand-100 text-lg leading-relaxed mb-10">
            Join over 1,000 pilgrims who trust us for their sacred journeys.
            Book online in minutes or chat with our team on WhatsApp for a
            personalised quote.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold text-base rounded-2xl hover:bg-brand-50 transition-all duration-200 shadow-lg"
            >
              Book Online Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-base rounded-2xl border border-white/20 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Contact strip */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-brand-200 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href={`tel:${BUSINESS.phone}`} className="hover:text-white transition-colors">
                {BUSINESS.phone}
              </a>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-brand-400 rounded-full" />
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>Available 24/7 via WhatsApp</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-brand-400 rounded-full" />
            <div>No hidden fees · Instant confirmation</div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
