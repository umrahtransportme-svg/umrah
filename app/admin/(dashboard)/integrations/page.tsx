'use client'

import { useState } from 'react'
import { ToggleLeft, ToggleRight, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const INTEGRATIONS = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing for card, Apple Pay, and Google Pay',
    category: 'Payments',
    connected: true,
    status: 'live',
    icon: '💳',
    docs: 'https://stripe.com/docs',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Send booking confirmations and driver updates via WhatsApp',
    category: 'Messaging',
    connected: true,
    status: 'live',
    icon: '💬',
    docs: 'https://business.whatsapp.com',
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    description: 'Route planning and distance calculation for transfers',
    category: 'Maps',
    connected: true,
    status: 'live',
    icon: '🗺️',
    docs: 'https://developers.google.com/maps',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing for promotions and newsletters',
    category: 'Marketing',
    connected: false,
    status: 'disconnected',
    icon: '📧',
    docs: 'https://mailchimp.com',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    description: 'Website traffic and conversion tracking',
    category: 'Analytics',
    connected: true,
    status: 'live',
    icon: '📊',
    docs: 'https://analytics.google.com',
  },
  {
    id: 'twilio',
    name: 'Twilio SMS',
    description: 'SMS notifications for booking updates',
    category: 'Messaging',
    connected: false,
    status: 'disconnected',
    icon: '📱',
    docs: 'https://twilio.com/docs',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automate workflows between apps',
    category: 'Automation',
    connected: false,
    status: 'disconnected',
    icon: '⚡',
    docs: 'https://zapier.com',
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    description: 'Heatmaps and user session recordings',
    category: 'Analytics',
    connected: false,
    status: 'disconnected',
    icon: '🔥',
    docs: 'https://hotjar.com',
  },
]

const categories = [...new Set(INTEGRATIONS.map((i) => i.category))]

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS)
  const [category, setCategory] = useState('all')

  function toggle(id: string) {
    setIntegrations((prev) =>
      prev.map((i) => i.id === id ? { ...i, connected: !i.connected, status: !i.connected ? 'live' : 'disconnected' } : i),
    )
  }

  const filtered = category === 'all' ? integrations : integrations.filter((i) => i.category === category)
  const connectedCount = integrations.filter((i) => i.connected).length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Connected', value: connectedCount, color: 'text-green-700' },
          { label: 'Disconnected', value: integrations.length - connectedCount, color: 'text-slate-700' },
          { label: 'Available', value: integrations.length, color: 'text-brand-700' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 flex-wrap">
        {['all', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
              category === cat ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((integration) => (
          <div key={integration.id} className={cn('card p-5 transition-opacity', !integration.connected && 'opacity-75')}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{integration.name}</h3>
                  <span className="text-xs text-slate-400">{integration.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {integration.connected
                  ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                  : <AlertCircle className="w-4 h-4 text-slate-300" />
                }
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-4">{integration.description}</p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggle(integration.id)}
                className={cn(
                  'flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors',
                  integration.connected ? 'text-brand-600 hover:bg-brand-50' : 'text-slate-500 hover:bg-slate-100',
                )}
              >
                {integration.connected ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {integration.connected ? 'Connected' : 'Connect'}
              </button>
              <a href={integration.docs} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
