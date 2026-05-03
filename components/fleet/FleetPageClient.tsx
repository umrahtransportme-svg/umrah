'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Users, Briefcase, Wind, Check, Star, ChevronRight, Car } from 'lucide-react'
import { FLEET_CATEGORIES } from '@/lib/fleet-data'
import { useCurrency } from '@/lib/currency-context'
import type { FleetCategory, FleetVehicle } from '@/lib/fleet-data'

function VehicleImage({ src, alt, accent }: { src: string; alt: string; accent: string }) {
  const [errored, setErrored] = useState(false)

  if (!errored) {
    return (
      <div className="relative w-full h-52 overflow-hidden rounded-t-2xl">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setErrored(true)}
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
    )
  }

  return (
    <div className={`w-full h-52 rounded-t-2xl bg-gradient-to-br ${accent} flex flex-col items-center justify-center gap-3`}>
      {/* Car silhouette SVG */}
      <svg viewBox="0 0 120 50" className="w-32 opacity-30 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M108 28H12C9.8 28 8 29.8 8 32v6c0 2.2 1.8 4 4 4h4.2c.9 2.3 3.1 4 5.8 4s4.9-1.7 5.8-4h64.4c.9 2.3 3.1 4 5.8 4s4.9-1.7 5.8-4H108c2.2 0 4-1.8 4-4v-6c0-2.2-1.8-4-4-4z"/>
        <path d="M100 28l-8-14c-.8-1.3-2.2-2-3.7-2H32c-1.5 0-2.9.7-3.7 2L20 28h80z" opacity=".8"/>
        <circle cx="22" cy="42" r="4" opacity=".9"/>
        <circle cx="98" cy="42" r="4" opacity=".9"/>
      </svg>
      <span className="text-white/70 text-sm font-medium">{alt}</span>
    </div>
  )
}

function VehicleCard({ vehicle, accent, airportPrice, format }: { vehicle: FleetVehicle; accent: string; airportPrice: number; format: (n: number) => string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <VehicleImage src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} accent={accent} />
        {vehicle.tag && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold rounded-full shadow-sm">
            {vehicle.tag}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{vehicle.make}</p>
          <h3 className="text-lg font-bold text-slate-900">{vehicle.model}</h3>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-500" />
            <span>{vehicle.capacity} pax</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-brand-500" />
            <span>{vehicle.luggage} bags</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-brand-500" />
            <span>A/C</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-1 mb-5">
          {vehicle.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
              <Check className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Airport transfer from</p>
            <p className="text-xl font-bold text-slate-900">{format(airportPrice)}</p>
          </div>
          <Link
            href="/book"
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Book
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function CategorySection({ category, format }: { category: FleetCategory; format: (n: number) => string }) {
  return (
    <section className="mb-16">
      {/* Category header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.accentColor} flex items-center justify-center`}>
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{category.label}</h2>
              <p className="text-sm text-brand-600 font-semibold">{category.capacity}</p>
            </div>
          </div>
          <p className="text-slate-500 max-w-xl text-sm leading-relaxed">{category.description}</p>
        </div>

        {/* Price pills */}
        <div className="flex gap-3 flex-shrink-0">
          <div className="text-center px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 mb-0.5">Airport transfer</p>
            <p className="font-bold text-slate-900">{format(category.airportPrice)}</p>
          </div>
          <div className="text-center px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 mb-0.5">Intercity</p>
            <p className="font-bold text-slate-900">{format(category.intercityPrice)}</p>
          </div>
        </div>
      </div>

      {/* Vehicles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
        {category.vehicles.map((v) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            accent={category.accentColor}
            airportPrice={category.airportPrice}
            format={format}
          />
        ))}
      </div>
    </section>
  )
}

export default function FleetPageClient() {
  const { format } = useCurrency()
  return (
    <div className="pt-16 min-h-screen">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white">
        <div className="container-custom py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
              Our Fleet
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Premium Vehicles for<br />
              <span className="text-brand-400">Every Group Size</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              From intimate sedan transfers to full-group Coaster buses — every vehicle is air-conditioned,
              professionally maintained and driven by our vetted, uniformed drivers.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              {[
                { icon: '🚗', text: '5 vehicle categories' },
                { icon: '🌡️', text: 'All A/C — always' },
                { icon: '👔', text: 'Uniformed drivers' },
                { icon: '🛡️', text: 'Fully insured fleet' },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2">
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick-jump category tabs */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {FLEET_CATEGORIES.map((cat) => (
              <a
                key={cat.vehicleType}
                href={`#${cat.vehicleType}`}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors whitespace-nowrap"
              >
                {cat.label}
                <span className="ml-1.5 text-xs text-slate-400">{cat.capacity.split(' ')[0]}–{cat.capacity.split('–')[1]?.trim().split(' ')[0]} pax</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet sections */}
      <div className="container-custom py-14">
        {FLEET_CATEGORIES.map((cat) => (
          <div key={cat.vehicleType} id={cat.vehicleType}>
            <CategorySection category={cat} format={format} />
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-3xl p-8 md:p-10 text-white text-center">
          <Star className="w-8 h-8 mx-auto mb-4 text-brand-200" />
          <h2 className="text-2xl font-bold mb-2">Can't decide? Let us help.</h2>
          <p className="text-brand-100 mb-6 max-w-md mx-auto">
            Tell us your group size and journey and we'll recommend the right vehicle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/book" className="px-8 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors">
              Book Online
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '447456938750'}?text=Hi%2C%20I%27d%20like%20help%20choosing%20a%20vehicle%20for%20my%20Umrah%20trip`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-brand-500/30 hover:bg-brand-500/50 text-white font-bold rounded-xl border border-white/20 transition-colors"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
