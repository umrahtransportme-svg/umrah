'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  MessageCircle,
  Shield,
  Star,
  Clock,
  CheckCircle,
  Plane,
  Users,
} from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { WHATSAPP_MESSAGES } from '@/lib/config'

const trustBadges = [
  { icon: Star, text: '4.9/5 Rating', sub: '500+ reviews' },
  { icon: Shield, text: 'Fully Insured', sub: 'Licensed operators' },
  { icon: Clock, text: '24/7 Support', sub: 'Always available' },
  { icon: Users, text: '1,000+ Pilgrims', sub: 'Served annually' },
]

const highlights = [
  { icon: CheckCircle, text: 'Meet & Greet at airport' },
  { icon: CheckCircle, text: 'Professional, vetted drivers' },
  { icon: CheckCircle, text: 'Multilingual service (EN/UR/AR)' },
  { icon: CheckCircle, text: 'Wheelchair & elderly support' },
  { icon: CheckCircle, text: 'Instant WhatsApp confirmation' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
  },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero pt-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pattern-dots opacity-30" />
      <div className="absolute top-24 right-0 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-12 left-0 w-72 h-72 bg-blue-50/60 rounded-full blur-3xl" />

      <div className="container-custom relative z-10 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex mb-6">
              <span className="section-tag">
                <Star className="w-3.5 h-3.5 text-brand-600 fill-brand-500" />
                Trusted by UK & US families since 2018
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-5"
            >
              Your Trusted{' '}
              <span className="block mt-1">Transport Partner</span>
              <span className="block text-gradient mt-1">
                for Umrah{' '}
                <span className="font-arabic" style={{ fontFamily: 'serif' }}>
                  سفر
                </span>
              </span>
            </motion.h1>

            {/* Sub headline */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Premium, reliable transportation for every pilgrim. From airport
              arrivals to sacred Ziyarat tours — we handle every journey with
              care and professionalism.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10"
            >
              <Link href="/book" className="btn-primary text-base px-8 py-4 rounded-2xl">
                Book Your Transfer
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-200 text-slate-700 hover:text-brand-600 font-semibold text-base transition-all duration-200 shadow-sm hover:shadow-card"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
            </motion.div>

            {/* Trust badges row */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {trustBadges.map((badge) => (
                <div
                  key={badge.text}
                  className="flex flex-col items-center lg:items-start gap-0.5 p-3 bg-white rounded-xl border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <badge.icon className="w-4 h-4 text-brand-600" />
                    <span className="text-sm font-semibold text-slate-800">
                      {badge.text}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 ml-5 lg:ml-5.5">
                    {badge.sub}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Feature card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white rounded-3xl shadow-card-hover border border-slate-100 p-8 relative z-10"
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      Why pilgrims choose us
                    </h3>
                    <p className="text-slate-500 text-sm mt-0.5">
                      The complete pilgrimage experience
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-brand-600" />
                  </div>
                </div>

                {/* Highlights list */}
                <ul className="space-y-3 mb-6">
                  {highlights.map((item) => (
                    <li key={item.text} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-brand-500 flex-shrink-0" />
                      <span className="text-slate-700 text-sm font-medium">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-100">
                  {[
                    { value: '1000+', label: 'Pilgrims' },
                    { value: '6+', label: 'Years' },
                    { value: '4.9★', label: 'Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-xl font-bold text-brand-600">
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Background blob */}
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-brand-100/60 rounded-full -z-10" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-sky-100/60 rounded-full -z-10" />

              {/* Floating mini badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-card border border-slate-100 px-4 py-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Instant Confirmation
                  </div>
                  <div className="text-xs text-slate-400">via WhatsApp</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 bg-slate-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
