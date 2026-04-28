import Link from 'next/link'
import {
  Mail,
  MapPin,
  MessageCircle,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { BUSINESS, WHATSAPP_MESSAGES } from '@/lib/config'
import { prisma } from '@/lib/prisma'

const services = [
  { label: 'Airport Transfers', href: '/services/airport-transfers' },
  { label: 'Intercity Transfers', href: '/services/intercity-transfers' },
  { label: 'Ziyarat Tours', href: '/services/ziyarat-tours' },
  { label: 'Umrah with Qari', href: '/services/special-services#umrah-qari' },
  { label: 'Elderly Assistance', href: '/services/special-services#elderly' },
]

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Book Now', href: '/book' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const locations = ['Makkah', 'Madinah', 'Jeddah Airport', 'Madinah Airport']

export default async function Footer() {
  let phone = BUSINESS.phone
  let email = BUSINESS.email
  let address = `${BUSINESS.address.locality}, ${BUSINESS.address.countryName}`
  let whatsappNumber = BUSINESS.whatsappNumber

  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ['email', 'whatsappNumber', 'address'] } },
    })
    const db = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    if (db.whatsappNumber) { phone = db.whatsappNumber; whatsappNumber = db.whatsappNumber }
    if (db.email) email = db.email
    if (db.address) address = db.address
  } catch {
    // fall back to config defaults
  }

  const waUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <div className="font-bold text-white text-sm leading-none">
                  Umrah
                </div>
                <div className="text-brand-400 text-xs font-semibold leading-none mt-0.5">
                  Transport
                </div>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Premium transportation services for Umrah pilgrims from UK, USA,
              Canada & Australia. Safe, comfortable & reliable.
            </p>

            <div className="flex items-center gap-3">
              <a
                href={BUSINESS.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                {/* Instagram icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href={BUSINESS.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                {/* Facebook icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href={BUSINESS.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
                aria-label="X (Twitter)"
              >
                {/* X / Twitter icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0 duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-sm text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0 duration-200" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                Serving
              </p>
              <div className="flex flex-wrap gap-1.5">
                {locations.map((loc) => (
                  <span
                    key={loc}
                    className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">WhatsApp (Preferred)</div>
                    <div className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      {phone}
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Email</div>
                    <div className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      {email}
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Base</div>
                    <div className="text-sm text-slate-300">
                      {address}
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-5 p-3 bg-slate-800 rounded-xl">
              <div className="text-xs text-slate-400 mb-1">Support hours</div>
              <div className="text-sm text-white font-medium">24/7 via WhatsApp</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} Umrah Transport. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
