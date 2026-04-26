'use client'

import { useState } from 'react'
import { Plane, Car, MapPin, Star, Heart, Edit2, ToggleLeft, ToggleRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/admin/utils'

const SERVICES = [
  { id: 's1', name: 'Airport Transfer', icon: Plane, enabled: true, bookings: 112, revenue: 7280, description: 'Private transfers to/from Jeddah (JED) and Madinah (MED) airports.', pricing: [{ label: 'Sedan (3 pax)', price: 45 }, { label: 'SUV (6 pax)', price: 65 }, { label: 'Minivan (12 pax)', price: 85 }], color: 'bg-blue-50 text-blue-600' },
  { id: 's2', name: 'Intercity Transfer', icon: Car, enabled: true, bookings: 69, revenue: 6210, description: 'Private intercity transfers between Makkah, Madinah, and Jeddah.', pricing: [{ label: 'Sedan', price: 85 }, { label: 'SUV', price: 115 }, { label: 'Minivan', price: 145 }], color: 'bg-purple-50 text-purple-600' },
  { id: 's3', name: 'Ziyarat Tours', icon: MapPin, enabled: true, bookings: 37, revenue: 3330, description: 'Private guided tours of Islamic historical sites.', pricing: [{ label: 'Half Day', price: 75 }, { label: 'Full Day', price: 120 }], color: 'bg-green-50 text-green-600' },
  { id: 's4', name: 'Umrah with Qari', icon: Star, enabled: true, bookings: 20, revenue: 3600, description: 'Guided Umrah performance with a certified Qari.', pricing: [{ label: 'Per person', price: 180 }], color: 'bg-amber-50 text-amber-600' },
  { id: 's5', name: 'Elderly Assistance', icon: Heart, enabled: true, bookings: 9, revenue: 1030, description: 'Personal helper, wheelchair support, and Haram access assistance.', pricing: [{ label: 'Half Day (5h)', price: 85 }, { label: 'Full Day (10h)', price: 150 }], color: 'bg-red-50 text-red-600' },
]

export default function AdminServicesPage() {
  const [services, setServices] = useState(SERVICES)

  function toggle(id: string) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage services shown on the public website</p>
        <button className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"><Plus className="w-3.5 h-3.5" /> Add Service</button>
      </div>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className={cn('card p-5 transition-opacity', !service.enabled && 'opacity-60')}>
            <div className="flex items-start gap-4">
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', service.color)}><service.icon className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900">{service.name}</h3>
                  {!service.enabled && <span className="badge bg-slate-100 text-slate-500 text-xs">Disabled</span>}
                </div>
                <p className="text-sm text-slate-500 mb-3">{service.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {service.pricing.map((p) => (<span key={p.label} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700">{p.label}: <strong>{formatCurrency(p.price)}</strong></span>))}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span><strong className="text-slate-700">{service.bookings}</strong> bookings</span>
                  <span><strong className="text-slate-700">{formatCurrency(service.revenue)}</strong> revenue</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="inline-flex items-center gap-1 px-2 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-medium rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => toggle(service.id)} className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors', service.enabled ? 'text-brand-600 hover:bg-brand-50' : 'text-slate-500 hover:bg-slate-100')}>
                  {service.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {service.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
