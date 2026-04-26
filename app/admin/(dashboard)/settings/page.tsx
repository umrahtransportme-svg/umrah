'use client'

import { useState } from 'react'
import { Save, Globe, Phone, Mail, Bell, Shield, Palette } from 'lucide-react'

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'branding', label: 'Branding', icon: Palette },
]

export default function AdminSettingsPage() {
  const [tab, setTab] = useState('general')
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-900">Business Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {[{ label: 'Business Name', value: 'UmraTransport' }, { label: 'Legal Name', value: 'Umra Transport Ltd' }, { label: 'Domain', value: 'www.umratransport.me' }, { label: 'Founded', value: '2018' }].map((f) => (
              <div key={f.label}><label className="label">{f.label}</label><input type="text" defaultValue={f.value} className="input text-sm" /></div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-5">
            <h3 className="font-semibold text-slate-900 mb-4">Contact Details</h3>
            <div className="space-y-3">
              <div><label className="label">WhatsApp Number</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" defaultValue="+44 7700 000000" className="input pl-9 text-sm" /></div></div>
              <div><label className="label">Email Address</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="email" defaultValue="info@umratransport.me" className="input pl-9 text-sm" /></div></div>
              <div><label className="label">Business Address</label><input type="text" defaultValue="London, United Kingdom" className="input text-sm" /></div>
            </div>
          </div>
          <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"><Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save Changes'}</button>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-900">Notification Preferences</h2>
          <div className="space-y-3">
            {[{ label: 'New booking received', sub: 'Email + WhatsApp notification', checked: true }, { label: 'Booking cancelled', sub: 'Email notification', checked: true }, { label: 'Payment received', sub: 'Email notification', checked: true }, { label: 'New review posted', sub: 'Email notification', checked: true }, { label: 'Driver unassigned', sub: 'WhatsApp alert', checked: false }, { label: 'Weekly reports', sub: 'Every Monday morning', checked: true }].map((n) => (
              <label key={n.label} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div><div className="text-sm font-medium text-slate-900">{n.label}</div><div className="text-xs text-slate-500">{n.sub}</div></div>
                <input type="checkbox" defaultChecked={n.checked} className="w-4 h-4 accent-brand-600" />
              </label>
            ))}
          </div>
          <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"><Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save'}</button>
        </div>
      )}

      {tab === 'security' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-900">Security Settings</h2>
          <div className="space-y-4">
            <div><label className="label">Current Password</label><input type="password" placeholder="••••••••" className="input text-sm" /></div>
            <div><label className="label">New Password</label><input type="password" placeholder="••••••••" className="input text-sm" /></div>
            <div><label className="label">Confirm New Password</label><input type="password" placeholder="••••••••" className="input text-sm" /></div>
          </div>
          <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"><Save className="w-4 h-4" />{saved ? 'Saved!' : 'Update Password'}</button>
        </div>
      )}

      {tab === 'branding' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-slate-900">Branding</h2>
          <div className="space-y-4">
            <div><label className="label">Primary Color</label><div className="flex items-center gap-3"><input type="color" defaultValue="#2563eb" className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" /><input type="text" defaultValue="#2563eb" className="input text-sm font-mono w-32" /></div></div>
            <div><label className="label">Logo (upload)</label><div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-brand-400 transition-colors cursor-pointer"><div className="text-slate-400 text-sm">Click to upload or drag and drop</div><div className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max 2MB)</div></div></div>
          </div>
          <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors"><Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save Changes'}</button>
        </div>
      )}
    </div>
  )
}
