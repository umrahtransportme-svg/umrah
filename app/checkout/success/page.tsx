'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CheckCircle, MessageCircle, Home, Mail } from 'lucide-react'
import { BUSINESS } from '@/lib/config'
import { saveBooking } from '@/lib/user-storage'

function SuccessInner() {
  const params = useSearchParams()
  const ref = params.get('ref') || 'UT-XXXXXX'
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.email || !params.get('ref')) return
    saveBooking(session.user.email, {
      bookingRef: ref,
      services: [],
      total: 0,
      bookedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending',
      customerName: session.user.name || '',
      itemCount: 1,
    })
  }, [session, ref, params])

  const whatsAppMsg = encodeURIComponent(
    `Assalamu Alaikum, I have just completed my payment. Booking reference: ${ref}. Please confirm my booking. JazakAllah Khayran.`
  )

  return (
    <div className="pt-16 min-h-screen bg-section-alt flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-10 text-center max-w-lg w-full">
        {/* Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 mb-5">
          Your booking has been confirmed and payment received. Our team will contact you on WhatsApp within minutes.
        </p>

        {/* Ref */}
        <div className="bg-brand-50 border border-brand-100 rounded-2xl py-3 px-6 mb-6 inline-block">
          <div className="text-xs text-brand-600 mb-0.5">Booking Reference</div>
          <div className="text-2xl font-bold font-mono text-brand-700">{ref}</div>
        </div>

        {/* What's next */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left space-y-3">
          <p className="text-sm font-semibold text-slate-700">What happens next?</p>
          {[
            { icon: Mail,           text: 'A confirmation email has been sent to you' },
            { icon: MessageCircle,  text: 'Our team will WhatsApp you within minutes with full details and your driver\'s contact' },
            { icon: CheckCircle,    text: 'Your driver will be assigned and confirmed 24h before pickup' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <s.icon className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
              {s.text}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/${BUSINESS.whatsappNumber}?text=${whatsAppMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 justify-center py-3"
          >
            <MessageCircle className="w-4 h-4" />
            Message Us on WhatsApp
          </a>
          <Link href="/" className="btn-secondary flex-1 justify-center py-3">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          Need help? Email us at{' '}
          <a href={`mailto:${BUSINESS.email}`} className="text-brand-600 hover:underline">{BUSINESS.email}</a>
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  )
}
