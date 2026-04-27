'use client'

import { useState } from 'react'
import { ExternalLink, CheckCircle2, AlertCircle, Save, Eye, EyeOff, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdminModal from '@/components/admin/ui/Modal'
import { useAdminStore } from '@/lib/admin/store'
import type { AdminIntegration } from '@/lib/admin/store'

const categories = ['Payments', 'Messaging', 'Maps', 'Marketing', 'Analytics', 'Automation']

export default function AdminIntegrationsPage() {
  const { integrations, updateIntegration } = useAdminStore()
  const [category, setCategory] = useState('all')
  const [configModal, setConfigModal] = useState<AdminIntegration | null>(null)
  const [form, setForm] = useState<Partial<AdminIntegration>>({})
  const [showKey, setShowKey] = useState(false)

  const filtered = category === 'all' ? integrations : integrations.filter((i) => i.category === category)
  const connectedCount = integrations.filter((i) => i.connected).length

  function openConfig(integration: AdminIntegration) {
    setForm({ ...integration })
    setShowKey(false)
    setConfigModal(integration)
  }

  function saveConfig() {
    if (!configModal) return
    updateIntegration(configModal.id, { ...form, connected: !!(form.apiKey?.trim()), status: form.apiKey?.trim() ? 'live' : 'disconnected' })
    setConfigModal(null)
  }

  function disconnect(id: string) {
    updateIntegration(id, { connected: false, status: 'disconnected', apiKey: '', webhookUrl: '' })
  }

  const EXTRA_FIELDS: Record<string, { key: string; label: string; placeholder?: string }[]> = {
    whatsapp: [
      { key: 'phoneNumberId', label: 'Phone Number ID', placeholder: '1234567890123456' },
      { key: 'accountId', label: 'WhatsApp Business Account ID', placeholder: '1234567890123456' },
    ],
    twilio: [
      { key: 'accountSid', label: 'Account SID', placeholder: 'ACxxxxxxxx' },
      { key: 'fromNumber', label: 'From Number', placeholder: '+1 555 000 0000' },
    ],
    mailchimp: [
      { key: 'listId', label: 'Audience / List ID', placeholder: 'abc123def4' },
    ],
  }

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
          <button key={cat} onClick={() => setCategory(cat)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', category === cat ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((integration) => (
          <div key={integration.id} className={cn('card p-5 transition-opacity', !integration.connected && 'opacity-80')}>
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
              {integration.connected
                ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                : <AlertCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />}
            </div>
            <p className="text-xs text-slate-500 mb-4">{integration.description}</p>
            <div className="flex items-center justify-between gap-2">
              <button onClick={() => openConfig(integration)}
                className={cn('flex-1 inline-flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors', integration.connected ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-brand-600 text-white hover:bg-brand-700')}>
                {integration.connected ? <><CheckCircle2 className="w-3.5 h-3.5" /> Configured</> : 'Connect'}
              </button>
              {integration.connected && (
                <button onClick={() => disconnect(integration.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Disconnect">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Config modal */}
      {configModal && (
        <AdminModal open onClose={() => setConfigModal(null)} title={`Configure — ${configModal.name}`} size="md"
          footer={<>
            <button onClick={() => setConfigModal(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={saveConfig} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"><Save className="w-3.5 h-3.5" /> Save & Connect</button>
          </>}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span className="text-2xl">{configModal.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{configModal.name}</p>
                <p className="text-xs text-slate-500">{configModal.description}</p>
              </div>
            </div>

            <div>
              <label className="label">API Key / Access Token</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={form.apiKey || ''}
                  onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                  className="input text-sm font-mono pr-10"
                  placeholder="Paste your API key here..."
                />
                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {EXTRA_FIELDS[configModal.id]?.map((field) => (
              <div key={field.key}>
                <label className="label">{field.label}</label>
                <input type="text"
                  value={form.extraConfig?.[field.key] || ''}
                  onChange={(e) => setForm((f) => ({ ...f, extraConfig: { ...f.extraConfig, [field.key]: e.target.value } }))}
                  className="input text-sm font-mono"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <div>
              <label className="label">Webhook URL (optional)</label>
              <input type="url" value={form.webhookUrl || ''} onChange={(e) => setForm((f) => ({ ...f, webhookUrl: e.target.value }))} className="input text-sm font-mono" placeholder="https://..." />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
              Keys are stored securely in your browser. For server-side use, also add them to your Vercel environment variables.
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  )
}
