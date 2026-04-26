'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const testimonials = [
  {
    id: 1,
    name: 'Mohammed Al-Farsi',
    location: 'London, United Kingdom',
    flag: '🇬🇧',
    rating: 5,
    service: 'Airport Transfer',
    review:
      'Exceptional service from start to finish. Our driver was waiting at the airport with a sign, helped with all our luggage, and got us to our hotel in Makkah safely and comfortably. The vehicle was spotless. Would highly recommend to any family planning Umrah.',
    date: 'March 2025',
    initials: 'MA',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    id: 2,
    name: 'Fatima Hassan',
    location: 'Birmingham, United Kingdom',
    flag: '🇬🇧',
    rating: 5,
    service: 'Elderly Assistance',
    review:
      'I was travelling with my 78-year-old mother and they went absolutely above and beyond. The wheelchair assistance was arranged perfectly and the carer was so patient, kind and gentle with her. Mum said it was the best Umrah she has ever done. Truly a blessed service!',
    date: 'February 2025',
    initials: 'FH',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-700',
  },
  {
    id: 3,
    name: 'Ahmed Rahman',
    location: 'New York, United States',
    flag: '🇺🇸',
    rating: 5,
    service: 'Ziyarat Tour — Madinah',
    review:
      'The Madinah Ziyarat tour was incredible. Our guide was extremely knowledgeable, spoke perfect English, and made sure we visited every important site with proper context and duas. The vehicle was comfortable and on time. Worth every penny. We will use them again next year.',
    date: 'January 2025',
    initials: 'AR',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
  },
  {
    id: 4,
    name: 'Sarah & Family',
    location: 'Toronto, Canada',
    flag: '🇨🇦',
    rating: 5,
    service: 'Intercity Transfer',
    review:
      'We travelled as a family of 6 including 3 young children and were nervous about the Makkah to Madinah journey. The van was spacious, air-conditioned and clean. The driver was so professional and patient with the kids. Even helped us with the pram! 5 stars absolutely.',
    date: 'December 2024',
    initials: 'SF',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-700',
  },
  {
    id: 5,
    name: 'Yusuf Abdullah',
    location: 'Sydney, Australia',
    flag: '🇦🇺',
    rating: 5,
    service: 'Umrah with Qari',
    review:
      'The Umrah with Qari service was life-changing. It was my first Umrah and having a proper Qari guide us through every step made it so spiritually meaningful. He explained everything in English and was incredibly patient. Communication on WhatsApp was always instant.',
    date: 'November 2024',
    initials: 'YA',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = (index: number) => {
    setDirection(index > active ? 1 : -1)
    setActive(index)
  }
  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length)
  const next = () => goTo((active + 1) % testimonials.length)

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-14">
          <span className="section-tag mb-4">Customer Reviews</span>
          <h2 className="section-heading">
            Trusted by families{' '}
            <span className="text-gradient">around the world</span>
          </h2>
          <p className="section-subheading max-w-xl mx-auto">
            Real reviews from real pilgrims. See why families from UK, USA,
            Canada & Australia choose us for their sacred journeys.
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white rounded-3xl border border-slate-100 shadow-card p-8 md:p-10">
            {/* Quote icon */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-16 h-16 text-brand-600 fill-brand-600" />
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {/* Reviewer info */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl ${testimonials[active].bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <span
                      className={`font-bold text-lg ${testimonials[active].textColor}`}
                    >
                      {testimonials[active].initials}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900">
                        {testimonials[active].name}
                      </h4>
                      <span>{testimonials[active].flag}</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      {testimonials[active].location} · {testimonials[active].date}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <StarRating rating={testimonials[active].rating} />
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                        {testimonials[active].service}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review text */}
                <blockquote className="text-slate-600 leading-relaxed text-base">
                  &ldquo;{testimonials[active].review}&rdquo;
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl border border-slate-200 hover:border-brand-200 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Review ${i + 1}`}
                  className={`rounded-full transition-all duration-200 ${
                    i === active
                      ? 'w-6 h-2 bg-brand-600'
                      : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl border border-slate-200 hover:border-brand-200 flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust summary */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 p-5 bg-brand-50 rounded-2xl border border-brand-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-700">4.9/5</div>
              <div className="text-xs text-brand-600 mt-0.5">Average rating</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-brand-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-700">500+</div>
              <div className="text-xs text-brand-600 mt-0.5">Verified reviews</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-brand-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-700">98%</div>
              <div className="text-xs text-brand-600 mt-0.5">Would recommend</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
