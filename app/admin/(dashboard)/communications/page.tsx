'use client'

import { useState } from 'react'
import { Send, Mail, MessageSquare, Phone, Search, Filter, CheckCheck, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/admin/utils'

const MESSAGES = [
  { id: 'c1', customer: 'Mohammed Al-Rashid', channel: 'whatsapp', subject: 'Driver location update', preview: 'Your driver Ahmed will arrive in 10 minutes at Terminal 2.', status: 'delivered', time: '2025-04-20T14:32:00Z', booking: 'UT-2025-0247' },
  { id: 'c2', customer: 'Sarah Johnson', channel: 'email', subject: 'Booking Confirmation - UT-2025-0246', preview: 'Thank you for booking with UmraTransport. Your transfer from...', status: 'delivered', time: '2025-04-20T13:15:00Z', booking: 'UT-2025-0246' },
  { id: 'c3', customer: 'Ahmed Hassan', channel: 'email', subject: 'Receipt for your booking', preview: 'Payment of £85 received for Airport Transfer on 22 Apr 2025.', status: 'delivered', time: '2025-04-20T11:00:00Z', booking: 'UT-2025-0245' },
  { id: 'c4', customer: 'Fatima Malik', channel: 'whatsapp', subject: 'Booking reminder', preview: 'Reminder: Your Ziyarat Tour is tomorrow at 09:00 AM.', status: 'read', time: '2025-04-19T18:00:00Z', booking: 'UT-2025-0244' },
  { id: 'c5', customer: 'Omar Sheikh', channel: 'phone', subject: 'Inbound call', preview: 'Customer called to enquire about group pricing.', status: 'missed', time: '2025-04-19T10:20:00Z', booking: '' },
  { id: 'c6', customer: 'Aisha Rahman', channel: 'email', subject: 'Cancellation confirmation', preview: 'Your booking UT-2025-0240 has been cancelled. Refund...', status: 'bounced', time: '2025-04-18T14:00:00Z', booking: 'UT-2025-0240' },
  { id: 'c7', customer: 'Yusuf Al-Amin', channel: 'whatsapp', subject: 'Review request', preview: 'We hope you enjoyed your Umrah journey! Share your experience...', status: 'delivered', time: '2025-04-17T20:00:00Z', booking: 'UT-2025-0238' },
]

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  whatsapp: <MessageSquare className="w-3.5 h-3.5 text-green-600" />,
  email:    <Mail className="w-3.5 h-3.5 text-blue-600" />,
  phone:    <Phone className="w-3.5 h-3.5 text-purple-600" />,
}

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  email:    'Email',
  phone:    'Phone',
}

const STATUS_STYLE: Record<string, string> = {
  delivered: 'bg-green-50 text-green-700',
  read:      'bg-blue-50 text-blue-700',
  missed:    'bg-red-50 text-red-700',
  bounced:   'bg-amber-50 text-amber-700',
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  delivered: <CheckCheck className="w-3 h-3" />,
  read:      <CheckCheck className="w-3 h-3" />,
  missed:    <AlertCircle className="w-3 h-3" />,
  bounced:   <AlertCircle className="w-3 h-3" />,
}

export default function AdminCommunicationsPage() {
  const [search, setSearch] = useState('')
  const [channelFilter, setChannelFilter] = useState('all')
  const [composing, setComposing] = useState(false)

  const filtered = MESSAGES.filter((m) => {
    const matchSearch = m.customer.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())
    const matchChannel = channelFilter === 'all' || m.channel === channelFilter
    return matchSearch && matchChannel
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Sent today', value: 14, icon: <Send className="w-4 h-4 text-brand-600" />, bg: 'bg-brand-50' },
          { label: 'WhatsApp', value: 8, icon: <MessageSquare className="w-4 h-4 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Email', value: 6, icon: <Mail className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Missed calls', value: 1, icon: <Phone className="w-4 h-4 text-red-500" />, bg: 'bg-red-50' },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', s.bg)}>{s.icon}</div>
            <div>
              <div className="text-lg font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 text-sm" />
        </div>
        <div className="flex gap-1">
          <Filter className="w-4 h-4 text-slate-400 self-center" />
          {['all', 'email', 'whatsapp', 'phone'].map((ch) => (
            <button key={ch} onClick={() => setChannelFilter(ch)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', channelFilter === ch ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
              {ch}
            </button>
          ))}
        </div>
        <button onClick={() => setComposing(true)} className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
          <Send className="w-3.5 h-3.5" /> Compose
        </button>
      </div>

      {composing && (
        <div className="card p-5 border-brand-200 border-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">New Message</h3>
            <button onClick={() => setComposing(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Recipient</label><input type="text" placeholder="Customer name or booking ref..." className="input text-sm" /></div>
            <div>
              <label className="label">Channel</label>
              <select className="input text-sm">
                <option>WhatsApp</option>
                <option>Email</option>
              </select>
            </div>
          </div>
          <div><label className="label">Subject (email only)</label><input type="text" placeholder="Subject line..." className="input text-sm" /></div>
          <div><label className="label">Message</label><textarea rows={4} placeholder="Type your message..." className="input resize-none text-sm" /></div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setComposing(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"><Send className="w-3.5 h-3.5" /> Send</button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="divide-y divide-slate-50">
          {filtered.map((msg) => (
            <div key={msg.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
                {msg.customer[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-slate-900">{msg.customer}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    {CHANNEL_ICONS[msg.channel]} {CHANNEL_LABELS[msg.channel]}
                  </span>
                  {msg.booking && <span className="text-xs font-mono text-slate-400">{msg.booking}</span>}
                </div>
                <p className="text-xs font-medium text-slate-700">{msg.subject}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{msg.preview}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(msg.time)}</span>
                <span className={cn('badge text-xs flex items-center gap-1', STATUS_STYLE[msg.status])}>
                  {STATUS_ICONS[msg.status]} {msg.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
