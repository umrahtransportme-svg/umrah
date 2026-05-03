'use client'

import { useState } from 'react'
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Send,
} from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { WHATSAPP_MESSAGES } from '@/lib/config'

interface Props {
  phone: string
  email: string
  address: string
  whatsappNumber: string
}

export default function ContactClient({ phone, email, address, whatsappNumber }: Props) {
  const waUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp (Preferred)',
      detail: phone,
      sub: 'Fastest response — usually within 5 minutes',
      color: 'text-[#25D366]',
      bg: 'bg-[#25D366]/10',
      action: 'Chat on WhatsApp',
      href: waUrl,
      external: true,
    },
    {
      icon: Mail,
      title: 'Email',
      detail: email,
      sub: 'Response within 2–4 hours',
      color: 'text-brand-600',
      bg: 'bg-brand-50',
      action: 'Send Email',
      href: `mailto:${email}`,
      external: false,
    },
    {
      icon: Phone,
      title: 'Phone',
      detail: phone,
      sub: 'Available daily 8am–10pm (KSA time)',
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      action: 'Call Us',
      href: `tel:${phone}`,
      external: false,
    },
  ]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="bg-hero border-b border-slate-100">
        <div className="container-custom py-14 md:py-18 text-center">
          <AnimatedSection>
            <span className="section-tag mb-4">Contact Us</span>
            <h1 className="section-heading mb-4">
              We are here to{' '}
              <span className="text-gradient">help you</span>
            </h1>
            <p className="section-subheading max-w-xl mx-auto">
              Have a question or need a custom quote? Our team is available 24/7
              via WhatsApp, email and phone.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact methods */}
            <AnimatedSection direction="left">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Get in touch
              </h2>

              <div className="space-y-4 mb-8">
                {contactMethods.map((method) => (
                  <div
                    key={method.title}
                    className="flex items-start gap-4 bg-white rounded-2xl border border-slate-100 p-5 card-lift"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl ${method.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <method.icon className={`w-5 h-5 ${method.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {method.title}
                      </h3>
                      <div className="text-slate-700 font-medium mt-0.5 truncate">
                        {method.detail}
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        {method.sub}
                      </div>
                    </div>
                    <a
                      href={method.href}
                      target={method.external ? '_blank' : undefined}
                      rel={method.external ? 'noopener noreferrer' : undefined}
                      className="flex-shrink-0 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-semibold rounded-lg transition-colors"
                    >
                      {method.action}
                    </a>
                  </div>
                ))}
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span className="text-sm font-semibold text-slate-800">
                      Support Hours
                    </span>
                  </div>
                  <div className="text-slate-600 text-sm">
                    WhatsApp: 24/7
                    <br />
                    Phone: 8am–10pm KSA
                    <br />
                    Email: 24/7
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    <span className="text-sm font-semibold text-slate-800">
                      {address ? 'Office Address' : 'Service Area'}
                    </span>
                  </div>
                  <div className="text-slate-600 text-sm">
                    {address ? (
                      address
                    ) : (
                      <>
                        Makkah
                        <br />
                        Madinah
                        <br />
                        Jeddah & Airports
                      </>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact form */}
            <AnimatedSection direction="right">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Message sent!
                    </h3>
                    <p className="text-slate-500 text-sm">
                      We will get back to you within 2–4 hours. For urgent
                      enquiries, please use WhatsApp.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                      Send us a message
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">
                      Fill in the form and we will respond promptly
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label-field">Your Name</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Full name"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="label-field">WhatsApp Number</label>
                          <input
                            type="tel"
                            value={formData.whatsapp}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                whatsapp: e.target.value,
                              })
                            }
                            placeholder="+44 7456 938750"
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label-field">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="your@email.com"
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="label-field">Subject</label>
                        <select
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                          className="input-field"
                        >
                          <option value="">Select a topic...</option>
                          <option>Booking enquiry</option>
                          <option>Custom group quote</option>
                          <option>Pricing information</option>
                          <option>Existing booking query</option>
                          <option>General question</option>
                          <option>Feedback or complaint</option>
                        </select>
                      </div>

                      <div>
                        <label className="label-field">Message</label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          placeholder="How can we help you?"
                          className="input-field resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3.5"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Send Message
                          </span>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ quick answers */}
      <section className="section-padding bg-section-alt">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Frequently asked questions
            </h2>
          </AnimatedSection>
          <div className="max-w-3xl mx-auto grid gap-4">
            {[
              {
                q: 'How do I pay for my booking?',
                a: 'Once we confirm your booking via WhatsApp, you can pay via bank transfer, card, or cash in SAR/GBP/USD/CAD. Payment is made before the journey.',
              },
              {
                q: 'What happens if my flight is delayed?',
                a: 'We track all flights in real-time. If your flight is delayed, your driver will wait at no extra charge (up to 60 minutes). We will contact you via WhatsApp.',
              },
              {
                q: 'Can I book for a group?',
                a: 'Absolutely. We have minivans for up to 12 passengers and can arrange multiple vehicles for larger groups. Contact us for group rates.',
              },
              {
                q: 'Do you offer wheelchair accessible vehicles?',
                a: 'Yes. We can arrange wheelchair-accessible vehicles and provide dedicated helpers for elderly or disabled pilgrims. Please mention this when booking.',
              },
              {
                q: 'How far in advance should I book?',
                a: 'We recommend booking at least 48–72 hours in advance, especially during peak Umrah seasons (Ramadan, school holidays). Last-minute bookings are subject to availability.',
              },
            ].map((faq) => (
              <AnimatedSection key={faq.q}>
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm">
                    {faq.q}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
