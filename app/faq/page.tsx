import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/seo'
import { BUSINESS } from '@/lib/config'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { WHATSAPP_MESSAGES } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Umrah Transport FAQ | Common Questions Answered',
  description:
    'Answers to the most common questions about Umrah transport — pricing, booking, airport transfers, Makkah–Madinah travel, Ziyarat tours, elderly support and more.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Umrah Transport FAQ | Umrah Transport',
    description:
      'Everything you need to know about booking Umrah transport — pricing, vehicles, airports, special services and more.',
    url: `${BUSINESS.url}/faq`,
  },
}

const faqs = [
  {
    category: 'Booking & Payment',
    questions: [
      {
        q: 'How do I book Umrah transport?',
        a: 'You can book online via our 4-step booking form at umrahtransport.me/book, or contact us directly via WhatsApp for a personalised quote. Once you submit your booking details, our team will confirm availability and pricing within minutes.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'We recommend booking at least 48–72 hours in advance. During peak seasons — particularly Ramadan, school holidays and Hajj season — we recommend booking 1–2 weeks ahead as availability is limited. Last-minute bookings (under 24 hours) may be possible subject to availability.',
      },
      {
        q: 'How do I pay for my Umrah transport?',
        a: 'Once your booking is confirmed via WhatsApp, payment can be made by bank transfer, card payment, or cash in SAR, GBP, USD, CAD or AUD. No payment is taken until we have confirmed your booking and you are happy to proceed.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellations made more than 48 hours before the scheduled pickup are free of charge. Cancellations within 48 hours may be subject to a cancellation fee. Please contact us via WhatsApp as soon as possible if your plans change.',
      },
      {
        q: 'Do you offer group discounts?',
        a: 'Yes. For groups of 10 or more passengers, or for customers booking multiple services, please contact us directly via WhatsApp or email for a customised group rate.',
      },
    ],
  },
  {
    category: 'Airport Transfers',
    questions: [
      {
        q: 'Which airports do you serve?',
        a: 'We serve Jeddah King Abdulaziz International Airport (IATA code: JED) and Madinah Prince Mohammad bin Abdulaziz Airport (IATA code: MED). We cover both arrivals and departures.',
      },
      {
        q: 'How much does a transfer from Jeddah Airport to Makkah cost?',
        a: 'A private transfer from Jeddah Airport (JED) to Makkah costs from £45 for a sedan (up to 3 passengers), £65 for an SUV (up to 6 passengers) or £85 for a minivan (up to 12 passengers). All transfers include meet & greet, flight tracking and luggage assistance.',
      },
      {
        q: 'How long does it take to get from Jeddah Airport to Makkah?',
        a: 'The journey from Jeddah King Abdulaziz International Airport (JED) to Makkah takes approximately 60–90 minutes depending on traffic. Non-Muslims are not permitted to enter the city of Makkah — all our drivers are Muslim and familiar with the relevant routes.',
      },
      {
        q: 'What happens if my flight is delayed?',
        a: 'We track all flights in real-time. If your flight is delayed, your driver will wait at no extra charge for up to 60 minutes. For delays beyond 60 minutes, a small additional waiting fee may apply, which we will confirm with you via WhatsApp before charging.',
      },
      {
        q: 'Will my driver have a name board?',
        a: 'Yes. Your driver will be waiting at the arrivals hall with a board clearly displaying your name. You will also receive your driver\'s name and contact number via WhatsApp before your flight lands.',
      },
    ],
  },
  {
    category: 'Intercity Travel',
    questions: [
      {
        q: 'How long does the Makkah to Madinah transfer take?',
        a: 'The Makkah to Madinah journey by private car takes approximately 4.5 to 5 hours (around 450 km). The route is via the Haramain Expressway. We can arrange comfort stops along the way on request.',
      },
      {
        q: 'Do you offer shared taxis for Makkah to Madinah?',
        a: 'No. All Umrah Transport intercity transfers are fully private. You will not share the vehicle with other passengers. This ensures privacy, comfort and flexibility on your schedule.',
      },
      {
        q: 'Can we make stops during an intercity transfer?',
        a: 'Yes. For intercity transfers, you can request comfort stops (e.g. for prayer, refreshments or a rest break) along the route. Please mention this at the time of booking so your driver is prepared.',
      },
      {
        q: 'What intercity routes do you cover?',
        a: 'We cover: Makkah to Madinah, Madinah to Makkah, Makkah to Jeddah, Jeddah to Makkah, Madinah to Jeddah, and Jeddah to Madinah. Custom routes are also available on request.',
      },
    ],
  },
  {
    category: 'Ziyarat Tours',
    questions: [
      {
        q: 'What Islamic sites do you visit on the Makkah Ziyarat tour?',
        a: "The Makkah Ziyarat tour visits key historical Islamic sites including: Masjid al-Aisha (Miqat), Jabal al-Noor (Cave of Hira), Jabal Thawr, Jannat al-Mu'alla cemetery, Masjid al-Jinn, Mina and Muzdalifah. The exact sites covered depend on whether you book a half-day or full-day tour.",
      },
      {
        q: 'What Islamic sites do you visit on the Madinah Ziyarat tour?',
        a: "The Madinah Ziyarat tour includes: Masjid Quba (the first mosque in Islam), Masjid Qiblatain, Masjid al-Jumuah, Uhud Mountain and the graves of the martyrs, Jannat al-Baqi' cemetery, the Seven Mosques (Masajid as-Sab'a) and Masjid Ghamama.",
      },
      {
        q: 'Are the Ziyarat guides multilingual?',
        a: 'Yes. Our Ziyarat guides speak English, Urdu and Arabic, ensuring clear explanations of the historical and Islamic significance of each site for pilgrims from the UK, USA, Canada and Australia.',
      },
      {
        q: 'Can I book a private Ziyarat tour for just my family?',
        a: 'Yes. All our Ziyarat tours are fully private — just you and your family or group, with your own guide and vehicle. We do not run shared or group tours with strangers.',
      },
    ],
  },
  {
    category: 'Special Services',
    questions: [
      {
        q: 'What is the Umrah with Qari service?',
        a: "The Umrah with Qari service provides a certified Islamic scholar (Qari) who guides you through every step of Umrah — from making the intention (niyyah) and entering Ihram, through Tawaf (circling the Ka'bah), Sa'i (walking between Safa and Marwa), and completing the Umrah. The guide ensures correct recitation of duas and prayers throughout. Available in English, Urdu and Arabic.",
      },
      {
        q: 'Is the Umrah with Qari suitable for first-time pilgrims?',
        a: 'Yes — it is specifically designed for first-time pilgrims. Many experienced pilgrims also book this service to deepen the spiritual quality of their Umrah performance. The Qari is patient, thorough and will answer all questions throughout.',
      },
      {
        q: 'What support do you provide for elderly or disabled pilgrims?',
        a: 'Our elderly and disabled assistance service includes: a dedicated personal helper (trained and respectful), wheelchair and mobility support, transport from hotel to Masjid al-Haram and back, assistance entering and exiting the Haram, support during Tawaf (wheelchair Tawaf is available on the ground floor), and prayer area guidance. Half-day (5 hours) from £85, full-day (10 hours) from £150.',
      },
      {
        q: 'Can female pilgrims request a female helper?',
        a: 'Yes. Please specify when booking if you require a female personal helper for our elderly assistance service. We will do our best to accommodate this request, subject to availability.',
      },
    ],
  },
  {
    category: 'Vehicles & Safety',
    questions: [
      {
        q: 'What vehicles do you use?',
        a: 'We use late-model, well-maintained vehicles including: Sedan (Toyota Camry or similar, up to 3 passengers), SUV (Toyota Land Cruiser or similar, up to 6 passengers) and Minivan (Toyota HiAce or similar, up to 12 passengers). All vehicles are air-conditioned and regularly inspected.',
      },
      {
        q: 'Are your drivers vetted and licensed?',
        a: 'Yes. All Umrah Transport drivers are: licensed Saudi drivers with valid permits, professionally trained and experienced on pilgrimage routes, Muslim and knowledgeable about the needs of pilgrims, vetted with background checks, and equipped to communicate in English, Urdu and/or Arabic.',
      },
      {
        q: 'Are your vehicles insured?',
        a: 'Yes. All vehicles operated by Umrah Transport are fully insured for passenger transport in Saudi Arabia. We carry comprehensive coverage for all journeys.',
      },
      {
        q: 'Do you provide child seats?',
        a: 'Yes. Child seats are available on request. Please specify the age and weight of your child when booking so we can ensure the correct seat is provided.',
      },
    ],
  },
]

const fullFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((cat) =>
    cat.questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }))
  ),
}

export default function FaqPage() {
  return (
    <>
      <JsonLd data={fullFaqSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: BUSINESS.url },
          { name: 'FAQ', url: `${BUSINESS.url}/faq` },
        ])}
      />

      <div className="pt-16">
        {/* Hero */}
        <div className="bg-hero border-b border-slate-100">
          <div className="container-custom py-14 md:py-18 text-center">
            <AnimatedSection>
              <span className="section-tag mb-4">FAQ</span>
              <h1 className="section-heading mb-4">
                Frequently asked{' '}
                <span className="text-gradient">questions</span>
              </h1>
              <p className="section-subheading max-w-2xl mx-auto">
                Everything you need to know about booking Umrah transport
                with us. Can&apos;t find your answer? Chat with us on WhatsApp
                — we reply within minutes.
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* FAQ content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto space-y-14">
              {faqs.map((category) => (
                <AnimatedSection key={category.category}>
                  <h2 className="text-xl font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100">
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((item) => (
                      <details
                        key={item.q}
                        className="group bg-white rounded-2xl border border-slate-100 overflow-hidden"
                      >
                        <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-semibold text-slate-900 text-sm hover:text-brand-600 transition-colors">
                          {item.q}
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 group-open:bg-brand-100 flex items-center justify-center transition-colors text-slate-500 group-open:text-brand-600 text-xs font-bold leading-none">
                            <span className="group-open:hidden">+</span>
                            <span className="hidden group-open:inline">−</span>
                          </span>
                        </summary>
                        <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                          {item.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Still have questions CTA */}
            <AnimatedSection className="mt-16 max-w-2xl mx-auto">
              <div className="bg-brand-50 border border-brand-100 rounded-3xl p-8 text-center">
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Still have a question?
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                  Our team is available 24/7 via WhatsApp and typically
                  responds within 5 minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp
                  </a>
                  <Link href="/book" className="btn-secondary">
                    Book Online
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </>
  )
}
