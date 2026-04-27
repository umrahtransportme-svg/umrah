'use client'

import { useState } from 'react'
import { ToggleLeft, ToggleRight, Plus, Zap, Clock, Mail, MessageSquare, Bell, Trash2, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import AdminModal from '@/components/admin/ui/Modal'
import { useAdminStore } from '@/lib/admin/store'
import type { AutomationRule } from '@/lib/admin/store'

const TRIGGER_ICONS: Record<string, React.ReactNode> = {
  booking_created:   <Zap className="w-4 h-4 text-brand-600" />,
  booking_confirmed: <Zap className="w-4 h-4 text-green-600" />,
  booking_cancelled: <Zap className="w-4 h-4 text-red-500" />,
  payment_received:  <Zap className="w-4 h-4 text-amber-500" />,
  driver_assigned:   <Zap className="w-4 h-4 text-purple-600" />,
  schedule:          <Clock className="w-4 h-4 text-slate-500" />,
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  email:    <Mail className="w-3.5 h-3.5" />,
  whatsapp: <MessageSquare className="w-3.5 h-3.5" />,
  push:     <Bell className="w-3.5 h-3.5" />,
}

const BLANK: Omit<AutomationRule, 'id' | 'runs' | 'lastRun'> = {
  name: '', trigger: 'booking_created', action: 'email', target: 'Customer', enabled: true,
}

export default function AdminAutomationPage() {
  const { automationRules, updateAutomationRule, addAutomationRule, deleteAutomationRule } = useAdminStore()
  const [modal, setModal] = useState<'add' | 'delete' | null>(null)
  const [selected, setSelected] = useState<AutomationRule | null>(null)
  const [form, setForm] = useState(BLANK)

  function save() {
    addAutomationRule(form)
    setModal(null)
  }

  const activeCount = automationRules.filter((r) => r.enabled).length
  const totalRuns = automationRules.reduce((s, r) => s + r.runs, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Rules', value: activeCount, sub: `of ${automationRules.length} total` },
          { label: 'Total Runs', value: totalRuns, sub: 'all time' },
          { label: 'Success Rate', value: '99.6%', sub: 'last 30 days' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs font-medium text-slate-700 mt-0.5">{s.label}</div>
            <div className="text-xs text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Rules run automatically based on triggers</p>
        <button onClick={() => { setForm(BLANK); setModal('add') }}
          className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Rule
        </button>
      </div>

      <div className="space-y-2">
        {automationRules.map((rule) => (
          <div key={rule.id} className={cn('card p-4 flex items-center gap-4 transition-opacity', !rule.enabled && 'opacity-60')}>
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
              {TRIGGER_ICONS[rule.trigger] || <Zap className="w-4 h-4 text-slate-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-slate-900">{rule.name}</span>
                {!rule.enabled && <span className="badge bg-slate-100 text-slate-500 text-xs">Paused</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span>Trigger: <strong className="text-slate-700">{rule.trigger.replace(/_/g, ' ')}</strong></span>
                <span className="flex items-center gap-1">{ACTION_ICONS[rule.action]}<strong className="text-slate-700">{rule.action}</strong> → {rule.target}</span>
                <span>{rule.runs} runs · Last: {rule.lastRun}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => updateAutomationRule(rule.id, { enabled: !rule.enabled })}
                className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors', rule.enabled ? 'text-brand-600 hover:bg-brand-50' : 'text-slate-500 hover:bg-slate-100')}>
                {rule.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                <span className="hidden sm:inline">{rule.enabled ? 'Active' : 'Paused'}</span>
              </button>
              <button onClick={() => { setSelected(rule); setModal('delete') }}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add rule modal */}
      {modal === 'add' && (
        <AdminModal open onClose={() => setModal(null)} title="Add Automation Rule" size="md"
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={save} disabled={!form.name.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"><Save className="w-3.5 h-3.5" /> Save Rule</button>
          </>}>
          <div className="space-y-4">
            <div>
              <label className="label">Rule Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input text-sm" placeholder="e.g. Booking Confirmation Email" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Trigger</label>
                <select value={form.trigger} onChange={(e) => setForm((f) => ({ ...f, trigger: e.target.value }))} className="input text-sm">
                  {['booking_created', 'booking_confirmed', 'booking_cancelled', 'payment_received', 'driver_assigned', 'schedule'].map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Action</label>
                <select value={form.action} onChange={(e) => setForm((f) => ({ ...f, action: e.target.value }))} className="input text-sm">
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Target</label>
              <select value={form.target} onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))} className="input text-sm">
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
                <option value="Driver">Driver</option>
                <option value="Customer + Admin">Customer + Admin</option>
              </select>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete confirm */}
      {modal === 'delete' && selected && (
        <AdminModal open onClose={() => setModal(null)} title="Delete Rule" size="sm"
          footer={<>
            <button onClick={() => setModal(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={() => { deleteAutomationRule(selected.id); setModal(null) }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">Delete</button>
          </>}>
          <p className="text-sm text-slate-600">Delete rule <strong>{selected.name}</strong>? This cannot be undone.</p>
        </AdminModal>
      )}
    </div>
  )
}
