'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  MessageSquare, Search, AlertCircle, CheckCircle, Clock,
  ChevronDown, Send, Trash2, Eye, Flag, RefreshCw, X,
  User, Mail, Phone, Calendar, Tag, FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Complaint {
  id: string
  userId: string
  bookingRef: string | null
  category: string
  subject: string
  message: string
  status: string
  priority: string
  response: string | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
  user: { name: string | null; email: string; phone?: string | null }
}

const STATUS_TABS = [
  { label: 'All',         value: 'all' },
  { label: 'Open',        value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved',    value: 'resolved' },
  { label: 'Closed',      value: 'closed' },
]

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  open:        { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400',  label: 'Open' },
  in_progress: { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400',   label: 'In Progress' },
  resolved:    { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400',  label: 'Resolved' },
  closed:      { bg: 'bg-slate-100', text: 'text-slate-600',  dot: 'bg-slate-400',  label: 'Closed' },
}

const PRIORITY_STYLE: Record<string, { bg: string; text: string }> = {
  normal: { bg: 'bg-slate-100', text: 'text-slate-600' },
  urgent: { bg: 'bg-red-50',   text: 'text-red-600' },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.open
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', s.bg, s.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = PRIORITY_STYLE[priority] ?? PRIORITY_STYLE.normal
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold', p.bg, p.text)}>
      {priority === 'urgent' && <AlertCircle className="w-3 h-3" />}
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

const PER_PAGE = 15

export default function AdminComplaintsPage() {
  const [complaints, setComplaints]     = useState<Complaint[]>([])
  const [total, setTotal]               = useState(0)
  const [page, setPage]                 = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch]             = useState('')
  const [loading, setLoading]           = useState(true)
  const [selected, setSelected]         = useState<Complaint | null>(null)
  const [replyText, setReplyText]       = useState('')
  const [newStatus, setNewStatus]       = useState('')
  const [newPriority, setNewPriority]   = useState('')
  const [saving, setSaving]             = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Complaint | null>(null)

  // Stats
  const [stats, setStats] = useState({ open: 0, urgent: 0, inProgress: 0, resolved: 0 })

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PER_PAGE),
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    })
    const res = await fetch(`/api/admin/complaints?${params}`)
    if (res.ok) {
      const d = await res.json()
      setComplaints(d.data)
      setTotal(d.total)
    }
    setLoading(false)
  }, [page, statusFilter])

  async function loadStats() {
    const [openR, urgentR, ipR, resolvedR] = await Promise.all([
      fetch('/api/admin/complaints?status=open&limit=1'),
      fetch('/api/admin/complaints?priority=urgent&limit=1'),
      fetch('/api/admin/complaints?status=in_progress&limit=1'),
      fetch('/api/admin/complaints?status=resolved&limit=1'),
    ])
    const [o, u, ip, r] = await Promise.all([openR.json(), urgentR.json(), ipR.json(), resolvedR.json()])
    setStats({ open: o.total, urgent: u.total, inProgress: ip.total, resolved: r.total })
  }

  useEffect(() => { load() }, [load])
  useEffect(() => { loadStats() }, [])

  // Client-side search filter
  const filtered = search.trim()
    ? complaints.filter(c =>
        c.subject.toLowerCase().includes(search.toLowerCase()) ||
        c.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.user.email.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase()) ||
        (c.bookingRef ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : complaints

  function openDetail(c: Complaint) {
    setSelected(c)
    setReplyText(c.response ?? '')
    setNewStatus(c.status)
    setNewPriority(c.priority)
  }

  async function saveResponse(markResolved = false) {
    if (!selected) return
    setSaving(true)
    const body: Record<string, unknown> = {
      status: newStatus,
      priority: newPriority,
    }
    if (replyText.trim()) {
      body.response = replyText.trim()
    }
    if (markResolved) {
      body.status = 'resolved'
      body.markResolved = true
    }

    const res = await fetch(`/api/admin/complaints/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      await load()
      await loadStats()
      setSelected(null)
    }
    setSaving(false)
  }

  async function deleteComplaint(id: string) {
    await fetch(`/api/admin/complaints/${id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    setSelected(null)
    await load()
    await loadStats()
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-6">

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open',        value: stats.open,       icon: MessageSquare, color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Urgent',      value: stats.urgent,     icon: AlertCircle,   color: 'text-red-600',    bg: 'bg-red-50' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock,         color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Resolved',    value: stats.resolved,   icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', s.bg)}>
              <s.icon className={cn('w-5 h-5', s.color)} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by subject, name, email, booking ref…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          {/* Status tabs */}
          <div className="flex gap-1 bg-slate-50 rounded-xl p-1">
            {STATUS_TABS.map(t => (
              <button
                key={t.value}
                onClick={() => { setStatusFilter(t.value); setPage(1) }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                  statusFilter === t.value
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button onClick={() => { load(); loadStats() }} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
            <MessageSquare className="w-8 h-8 opacity-30" />
            <p className="text-sm font-medium">No complaints found</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Complaint</span>
              <span>Customer</span>
              <span>Status</span>
              <span>Priority</span>
              <span>Date</span>
            </div>

            <div className="divide-y divide-slate-50">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openDetail(c)}
                  className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:gap-4 md:items-center space-y-2 md:space-y-0">
                    {/* Subject */}
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        {c.priority === 'urgent' && <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                        <span className="font-semibold text-sm text-slate-900 truncate">{c.subject}</span>
                      </div>
                      <span className="text-xs text-slate-400">{c.category}</span>
                      {c.bookingRef && (
                        <span className="ml-2 text-xs text-brand-600 font-mono">{c.bookingRef}</span>
                      )}
                    </div>
                    {/* Customer */}
                    <div className="text-sm text-slate-600">
                      <div className="font-medium truncate">{c.user.name ?? '—'}</div>
                      <div className="text-xs text-slate-400 truncate">{c.user.email}</div>
                    </div>
                    {/* Status */}
                    <div><StatusBadge status={c.status} /></div>
                    {/* Priority */}
                    <div><PriorityBadge priority={c.priority} /></div>
                    {/* Date */}
                    <div className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{total} total complaints</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
              Previous
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 font-semibold">
              {page} / {totalPages}
            </span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {/* ── Detail modal ──────────────────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-start gap-3 p-6 border-b border-slate-100">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <StatusBadge status={selected.status} />
                  <PriorityBadge priority={selected.priority} />
                  {selected.bookingRef && (
                    <span className="text-xs font-mono bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                      {selected.bookingRef}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{selected.subject}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  <Tag className="w-3 h-3 inline mr-1" />{selected.category} ·{' '}
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {new Date(selected.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* Customer info */}
              <div className="bg-slate-50 rounded-2xl p-4 grid sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-slate-400">Customer</div>
                    <div className="font-semibold text-slate-800">{selected.user.name ?? 'Unknown'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-slate-400">Email</div>
                    <a href={`mailto:${selected.user.email}`} className="font-medium text-brand-600 hover:underline text-xs break-all">
                      {selected.user.email}
                    </a>
                  </div>
                </div>
                {selected.user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-slate-400">Phone</div>
                      <a href={`tel:${selected.user.phone}`} className="font-medium text-slate-800 text-xs">
                        {selected.user.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">Customer Message</span>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              {/* Previous response */}
              {selected.response && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-slate-700">Previous Response</span>
                    {selected.resolvedAt && (
                      <span className="text-xs text-slate-400">
                        · Resolved {new Date(selected.resolvedAt).toLocaleDateString('en-GB')}
                      </span>
                    )}
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selected.response}
                  </div>
                </div>
              )}

              {/* Update status + priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Status</label>
                  <div className="relative">
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                      className="w-full appearance-none border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Priority</label>
                  <div className="relative">
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value)}
                      className="w-full appearance-none border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Reply box */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  {selected.response ? 'Update Response' : 'Write Response'}
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response to the customer here…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => saveResponse(false)}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>

                {selected.status !== 'resolved' && (
                  <button
                    onClick={() => saveResponse(true)}
                    disabled={saving || !replyText.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Respond &amp; Resolve
                  </button>
                )}

                <button
                  onClick={() => setConfirmDelete(selected)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ─────────────────────────────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Complaint?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              This will permanently delete this complaint and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={() => deleteComplaint(confirmDelete.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
