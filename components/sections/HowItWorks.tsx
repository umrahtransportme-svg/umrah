import { ClipboardList, MessageCircle, Car, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection'
import type { ContentMap } from '@/lib/content'

export default function HowItWorks({ content = {} }: { content?: ContentMap }) {
  const heading = content.heading ?? 'Book your transfer in'
  const heading_highlight = content.heading_highlight ?? '3 simple steps'
  const subheading = content.subheading ?? 'We have made booking as easy as possible so you can focus on what matters — your pilgrimage.'
  const cta_label = content.cta_label ?? 'Start Your Booking'

  const steps = [
    { step: '01', icon: ClipboardList, title: content.step1_title ?? 'Choose Your Service', description: content.step1_desc ?? 'Select from our range of services — airport transfer, intercity travel, Ziyarat tour or guided Umrah. Fill in your journey details in minutes.', color: 'bg-brand-600' },
    { step: '02', icon: MessageCircle, title: content.step2_title ?? 'Instant Confirmation', description: content.step2_desc ?? 'Receive immediate booking confirmation via WhatsApp and email. Our team reviews your booking and confirms availability within minutes.', color: 'bg-brand-700' },
    { step: '03', icon: Car, title: content.step3_title ?? 'Enjoy Your Journey', description: content.step3_desc ?? 'Your professional driver will be there on time, ready to provide a safe and comfortable journey to your destination.', color: 'bg-brand-800' },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-14">
          <span className="section-tag mb-4">How It Works</span>
          <h2 className="section-heading">
            {heading}{' '}
            <span className="text-gradient">{heading_highlight}</span>
          </h2>
          <p className="section-subheading max-w-xl mx-auto">
            {subheading}
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

          {steps.map((step, index) => (
            <StaggerItem key={step.step}>
              <div className="flex flex-col items-center text-center relative">
                {/* Step number bubble */}
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-brand`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-brand-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-700">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.3} className="text-center mt-12">
          <Link
            href="/book"
            className="btn-primary text-base px-8 py-4 rounded-2xl"
          >
            {cta_label}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
