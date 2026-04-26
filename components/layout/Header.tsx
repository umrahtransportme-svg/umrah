'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, ChevronDown, Plane, Car, MapPin, Star, Heart,
  MessageCircle, Calendar, ShoppingCart, User, LogOut, Gauge,
  DollarSign, Check,
} from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { WHATSAPP_MESSAGES } from '@/lib/config'
import { useCart } from '@/lib/cart-context'
import CartDrawer from '@/components/booking/CartDrawer'
import { useCurrency } from '@/lib/currency-context'
import { CURRENCIES } from '@/lib/currency'

const services = [
  { label: 'Airport Transfers',  href: '/services/airport-transfers',           icon: Plane,  desc: 'Jeddah & Madinah airports'    },
  { label: 'Intercity Transfers', href: '/services/intercity-transfers',        icon: Car,    desc: 'Makkah · Madinah · Jeddah'    },
  { label: 'Ziyarat Tours',       href: '/services/ziyarat-tours',              icon: MapPin, desc: 'Religious site visits'         },
  { label: 'Umrah with Qari',     href: '/services/special-services#umrah-qari',icon: Star,   desc: 'Guided Umrah experience'      },
  { label: 'Elderly Assistance',  href: '/services/special-services#elderly',   icon: Heart,  desc: 'Personal care & support'      },
]

// ─── Reusable dropdown wrapper ────────────────────────────────────────────────

function HeaderDropdown({
  trigger,
  children,
  open,
  onClose,
  align = 'right',
}: {
  trigger: React.ReactNode
  children: React.ReactNode
  open: boolean
  onClose: () => void
  align?: 'left' | 'right' | 'center'
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [onClose])

  const alignClass = align === 'right' ? 'right-0' : align === 'left' ? 'left-0' : 'left-1/2 -translate-x-1/2'

  return (
    <div className="relative" ref={ref}>
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={cn('absolute top-full mt-2 z-50 bg-white rounded-2xl shadow-card-hover border border-slate-100 overflow-hidden', alignClass)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Currency selector ────────────────────────────────────────────────────────

function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)

  return (
    <HeaderDropdown
      open={open}
      onClose={() => setOpen(false)}
      align="right"
      trigger={
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Select currency"
        >
          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-base leading-none">{currency.flag}</span>
          <span className="hidden lg:inline text-xs font-semibold">{currency.code}</span>
          <ChevronDown className={cn('w-3 h-3 text-slate-400 transition-transform', open && 'rotate-180')} />
        </button>
      }
    >
      <div className="p-3 w-80">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-1 mb-2">Select Currency</p>
        <div className="space-y-0.5 max-h-80 overflow-y-auto">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); setOpen(false) }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left',
                currency.code === c.code
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <span className="text-xl leading-none w-7 text-center flex-shrink-0">{c.flag}</span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold">{c.code}</span>
                <span className="text-slate-400 ml-1.5 text-xs">{c.name}</span>
              </div>
              <span className="text-slate-500 font-mono text-xs flex-shrink-0">{c.symbol}</span>
              {currency.code === c.code && <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 text-center pt-2 mt-1 border-t border-slate-100">
          Prices converted from GBP · Indicative rates
        </p>
      </div>
    </HeaderDropdown>
  )
}

// ─── Main header ──────────────────────────────────────────────────────────────

export default function Header() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [cartOpen, setCartOpen]       = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileCurrOpen, setMobileCurrOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { count } = useCart()
  const { data: session } = useSession()
  const { currency, setCurrency } = useCurrency()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setServicesOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isHome    = pathname === '/'
  const headerBg  = scrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'
  const textColor = scrolled || !isHome ? 'text-slate-700' : 'text-slate-800'

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-40 transition-all duration-300', headerBg)}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand transition-transform duration-200 group-hover:scale-105">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <div className="font-bold text-slate-900 text-sm leading-none">Umrah</div>
              <div className="text-brand-600 text-xs font-semibold leading-none mt-0.5">Transport</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className={cn('nav-link px-3 py-2 rounded-lg text-sm font-medium transition-colors', pathname === '/' ? 'text-brand-600' : `${textColor} hover:text-brand-600`)}>
              Home
            </Link>

            {/* Services dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button className={cn('flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors', pathname.startsWith('/services') ? 'text-brand-600' : `${textColor} hover:text-brand-600`)}>
                Services
                <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', servicesOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-card-hover border border-slate-100 p-2 overflow-hidden"
                  >
                    {services.map((item) => (
                      <Link key={item.href} href={item.href} className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand-50 group transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center flex-shrink-0 transition-colors">
                          <item.icon className="w-4 h-4 text-brand-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800 group-hover:text-brand-700 transition-colors">{item.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex gap-1">
                      <Link href="/services" className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                        All services →
                      </Link>
                      <Link href="/fleet" className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-slate-600 hover:text-brand-700 transition-colors border-l border-slate-100">
                        <Gauge className="w-3.5 h-3.5" /> Our Fleet →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/fleet"    className={cn('nav-link px-3 py-2 rounded-lg text-sm font-medium transition-colors', pathname === '/fleet'   ? 'text-brand-600' : `${textColor} hover:text-brand-600`)}>Fleet</Link>
            <Link href="/about"    className={cn('nav-link px-3 py-2 rounded-lg text-sm font-medium transition-colors', pathname === '/about'   ? 'text-brand-600' : `${textColor} hover:text-brand-600`)}>About Us</Link>
            <Link href="/faq"      className={cn('nav-link px-3 py-2 rounded-lg text-sm font-medium transition-colors', pathname === '/faq'     ? 'text-brand-600' : `${textColor} hover:text-brand-600`)}>FAQ</Link>
            <Link href="/contact"  className={cn('nav-link px-3 py-2 rounded-lg text-sm font-medium transition-colors', pathname === '/contact' ? 'text-brand-600' : `${textColor} hover:text-brand-600`)}>Contact</Link>
          </nav>

          {/* Desktop right: lang · currency · whatsapp · cart · user · CTA */}
          <div className="hidden md:flex items-center gap-1">
            {/* Currency selector */}
            <div className="mr-1">
              <CurrencySelector />
            </div>

            <a href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">WhatsApp</span>
            </a>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors" aria-label="View cart">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white rounded-full text-xs font-bold flex items-center justify-center leading-none">{count}</span>
              )}
            </button>

            {/* User */}
            {session?.user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen((o) => !o)} className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors" aria-label="Account menu">
                  {session.user.image ? (
                    <Image src={session.user.image} alt={session.user.name || 'User'} width={32} height={32} className="rounded-full ring-2 ring-brand-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">{(session.user.name || 'U')[0]}</div>
                  )}
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-slate-100 p-2 overflow-hidden z-50"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="text-sm font-semibold text-slate-800 truncate">{session.user.name}</div>
                        <div className="text-xs text-slate-400 truncate">{session.user.email}</div>
                      </div>
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors">
                        <User className="w-4 h-4" /> My Account
                      </Link>
                      <button onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={() => signIn('google', { callbackUrl: '/account' })} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                <User className="w-4 h-4" /> Sign In
              </button>
            )}

            <Link href="/book" className="btn-primary text-sm px-5 py-2.5 ml-1">Book Now</Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors" aria-label="View cart">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white rounded-full text-xs font-bold flex items-center justify-center leading-none">{count}</span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Toggle menu">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="container-custom py-4 space-y-1">

              {/* Currency picker — mobile */}
              <div className="px-1 pb-3 border-b border-slate-100 mb-1">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1"><DollarSign className="w-3 h-3" />Currency</p>
                <div className="relative">
                  <button onClick={() => setMobileCurrOpen((o) => !o)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <span className="flex items-center gap-2"><span className="text-lg">{currency.flag}</span><span className="font-semibold text-xs">{currency.code}</span><span className="text-xs text-slate-400">{currency.name}</span></span>
                    <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', mobileCurrOpen && 'rotate-180')} />
                  </button>
                  {mobileCurrOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-card-hover z-50 max-h-48 overflow-y-auto">
                      {CURRENCIES.map((c) => (
                        <button key={c.code} onClick={() => { setCurrency(c.code); setMobileCurrOpen(false) }}
                          className={cn('w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors', currency.code === c.code ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50')}>
                          <span className="text-base">{c.flag}</span>
                          <span className="font-semibold text-xs">{c.code}</span>
                          <span className="text-xs text-slate-400 truncate">{c.name}</span>
                          {currency.code === c.code && <Check className="w-3 h-3 text-brand-600 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Nav links */}
              <Link href="/"       className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors">Home</Link>
              <div className="px-3 py-2.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Services</div>
                {services.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2.5 py-2 text-slate-600 hover:text-brand-600 transition-colors">
                    <item.icon className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
              <Link href="/fleet"   className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors">Fleet</Link>
              <Link href="/about"   className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors">About Us</Link>
              <Link href="/faq"     className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors">FAQ</Link>
              <Link href="/contact" className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors">Contact</Link>

              {/* Mobile auth */}
              {session?.user ? (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-brand-50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {session.user.image ? (
                      <Image src={session.user.image} alt={session.user.name || 'User'} width={28} height={28} className="rounded-full flex-shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-brand-200 flex items-center justify-center text-brand-800 font-bold text-xs flex-shrink-0">{(session.user.name || 'U')[0]}</div>
                    )}
                    <span className="text-sm font-medium text-brand-800 truncate">{session.user.name}</span>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Link href="/account" className="px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100 rounded-lg transition-colors">My Account</Link>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors">Sign Out</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => signIn('google', { callbackUrl: '/account' })} className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                  <User className="w-4 h-4" /> Sign In with Google
                </button>
              )}

              <div className="flex gap-3 pt-3 pb-2 border-t border-slate-100 mt-3">
                <a href={getWhatsAppUrl(WHATSAPP_MESSAGES.general)} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <Link href="/book" className="flex-1 flex items-center justify-center btn-primary text-sm py-3">
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}
