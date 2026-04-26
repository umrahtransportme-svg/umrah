'use client'

import { useState } from 'react'
import { ToggleLeft, ToggleRight, Plus, Zap, Clock, Mail, MessageSquare, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

const TRIGGER_ICONS: Record<string, React.ReactNode> = {
  booking_created:    <Zap className="w-4 h-4 text-brand-600" />,
  booking_confirmed:  <Zap className="w-4 h-4 text-green-600" />,
  booking_cancelled:  <Zap className="w-4 h-4 text-red-500" />,
  payment_received:   <Zap className="w-4 h-4 text-amber-500" />,
  driver_assigned:    <Zap className="w-4 h-4 text-purple-600" />,
  schedule:           <Clock className="w-4 h-4 text-slate-500" />,
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  email:     <Mail className="w-3.5 h-3.5" />,
  whatsapp:  <MessageSquare className="w-3.5 h-3.5" />,
  push:      <Bell className="w-3.5 h-3.5" />,
}

const RULES = [
  { id: 'a1', name: 'Booking Confirmation Email', trigger: 'booking_created', action: 'email', target: 'Customer', enabled: true, runs: 247, lastRun: '2 mins ago' },
  { id: 'a2', name: 'Driver Assignment WhatsApp', trigger: 'driver_assigned', action: 'whatsapp', target: 'Driver', enabled: true, runs: 189, lastRun: '15 mins ago' },
  { id: 'a3', name: 'Payment Receipt', trigger: 'payment_received', action: 'email', target: 'Customer', enabled: true, runs: 201, lastRun: '1 hour ago' },
  { id: 'a4', name: 'Cancellation Notification', trigger: 'booking_cancelled', action: 'email', target: 'Customer + Admin', enabled: true, runs: 12, lastRun: '3 days ago' },
  { id: 'a5', name: 'Weekly Summary Report', trigger: 'schedule', action: 'email', target: 'Admin', enabled: true, runs: 24, lastRun: 'Monday 08:00' },
  { id: 'a6', name: 'Review Request (24h after)', trigger: 'booking_confirmed', action: 'whatsapp', target: 'Customer', enabled: false, runs: 0, lastRun: 'Never' },
  { id: 'a7', name: 'New Booking Admin Push', trigger: 'booking_created', action: 'push', target: 'Admin', enabled: true, runs: 247, lastRun: '2 mins ago' },
]

export default function AdminAutomationPage() {
  const [rules, setRules] = useState(RULES)

  function toggle(id: string) {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  const activeCount = rules.filter((r) => r.enabled).length
  const totalRuns = rules.reduce((s, r) => s + r.runs, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Rules', value: activeCount, sub: `of ${rules.length} total` },
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
        <p className="text-sm text-slate-500">Automation rules run automatically based on triggers</p>
        <button className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Rule
        </button>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.id} className={cn('card p-4 flex items-center gap-4 transition-opacity', !rule.enabled && 'opacity-60')}>
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
              {TRIGGER_ICONS[rule.trigger]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-slate-900">{rule.name}</span>
                {!rule.enabled && <span className="badge bg-slate-100 text-slate-500 text-xs">Paused</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Trigger: <strong className="text-slate-700">{rule.trigger.replace(/_/g, ' ')}</strong></span>
                <span className="flex items-center gap-1">
                  {ACTION_ICONS[rule.action]}
                  <strong className="text-slate-700">{rule.action}</strong> → {rule.target}
                </span>
                <span>{rule.runs} runs</span>
                <span className="hidden sm:inline">Last: {rule.lastRun}</span>
              </div>
            </div>
            <button
              onClick={() => toggle(rule.id)}
              className={cn(
                'flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0',
                rule.enabled ? 'text-brand-600 hover:bg-brand-50' : 'text-slate-500 hover:bg-slate-100',
              )}
            >
              {rule.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              <span className="hidden sm:inline">{rule.enabled ? 'Active' : 'Paused'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
