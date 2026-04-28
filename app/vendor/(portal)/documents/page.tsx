'use client'

import { useState, useEffect, useCallback } from 'react'
import { FileText, Upload, CheckCircle2, Clock, AlertTriangle, RefreshCw, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import FileUpload from '@/components/ui/FileUpload'

type VendorDoc = {
  id: string; docType: string; label: string; fileName: string | null
  status: string; expiryDate: string | null; createdAt: string; fileData: string | null
}

const DOC_TYPES = [
  { type: 'trade_license',    label: 'Trade License',          required: true,  desc: 'Company trade or business license' },
  { type: 'company_insurance', label: 'Company Insurance',     required: true,  desc: 'Public liability or fleet insurance' },
  { type: 'bank_letter',      label: 'Bank Letter',            required: true,  desc: 'Bank confirmation letter for payouts' },
  { type: 'vat_certificate',  label: 'VAT Certificate',        required: false, desc: 'If your company is VAT registered' },
  { type: 'fleet_insurance',  label: 'Fleet Insurance',        required: false, desc: 'Comprehensive fleet insurance policy' },
  { type: 'operator_license', label: "Operator's Licence",     required: false, desc: 'Transport operator licence (if applicable)' },
]

const STATUS_STYLE = {
  pending:  { label: 'Under Review', bg: 'bg-amber-50',  text: 'text-amber-700',  icon: Clock },
  verified: { label: 'Verified',     bg: 'bg-green-50',  text: 'text-green-700',  icon: CheckCircle2 },
  expired:  { label: 'Expired',      bg: 'bg-red-50',    text: 'text-red-700',    icon: AlertTriangle },
  rejected: { label: 'Rejected',     bg: 'bg-red-50',    text: 'text-red-700',    icon: AlertTriangle },
}

export default function VendorDocumentsPage() {
  const [docs, setDocs] = useState<VendorDoc[]>([])
  const [uploads, setUploads] = useState<Record<string, { data: string | null; name: string | null; expiry: string }>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    const r = await fetch('/api/vendor/documents')
    if (r.ok) setDocs(await r.json())
  }, [])
  useEffect(() => { load() }, [load])

  function getDoc(type: string) { return docs.find(d => d.docType === type) }

  function setUpload(type: string, data: string | null, name: string | null) {
    setUploads(u => ({ ...u, [type]: { data, name, expiry: u[type]?.expiry || '' } }))
  }
  function setExpiry(type: string, expiry: string) {
    setUploads(u => ({ ...u, [type]: { ...u[type], expiry } }))
  }

  async function uploadDoc(type: string, label: string) {
    const up = uploads[type]
    if (!up?.data) return
    setSaving(type)
    await fetch('/api/vendor/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docType: type, label, fileData: up.data, fileName: up.name, expiryDate: up.expiry || null }),
    })
    await load()
    setUploads(u => { const n = { ...u }; delete n[type]; return n })
    setSaving(null)
  }

  async function removeDoc(id: string) {
    await fetch('/api/vendor/documents', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    await load()
  }

  const uploadedCount = DOC_TYPES.filter(dt => getDoc(dt.type)).length
  const requiredCount = DOC_TYPES.filter(dt => dt.required).length
  const requiredDone = DOC_TYPES.filter(dt => dt.required && getDoc(dt.type)).length

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Company Documents</h1>
        <p className="text-xs text-slate-500 mt-0.5">{uploadedCount} of {DOC_TYPES.length} uploaded · {requiredDone}/{requiredCount} required</p>
      </div>

      {requiredDone < requiredCount && (
        <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Please upload all <strong>required</strong> documents to complete your verification. Your account will be reviewed within 1–2 business days.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DOC_TYPES.map(({ type, label, required, desc }) => {
          const existing = getDoc(type)
          const up = uploads[type]
          const s = existing ? (STATUS_STYLE[existing.status as keyof typeof STATUS_STYLE] || STATUS_STYLE.pending) : null
          const StatusIcon = s?.icon

          return (
            <div key={type} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', existing ? 'bg-green-50' : 'bg-slate-50')}>
                    <FileText className={cn('w-5 h-5', existing ? 'text-green-600' : 'text-slate-400')} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
                    {required && <span className="text-xs text-red-500">Required</span>}
                  </div>
                </div>
                {s && StatusIcon && (
                  <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', s.bg, s.text)}>
                    <StatusIcon className="w-3 h-3" />{s.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">{desc}</p>

              {existing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="truncate">{existing.fileName || 'Uploaded'}</span>
                    {existing.expiryDate && <span className="text-slate-400 flex-shrink-0 ml-2">Exp: {new Date(existing.expiryDate).toLocaleDateString('en-GB')}</span>}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setUploads(u => ({ ...u, [type]: { data: null, name: null, expiry: existing.expiryDate || '' } }))}
                      className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded-lg transition-colors">
                      <RefreshCw className="w-3 h-3" /> Replace
                    </button>
                    <button onClick={() => removeDoc(existing.id)} className="w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Replace mode */}
                  {up && up.data === null && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <FileUpload label="New file" value={up.data} fileName={up.name} accept=".pdf,.jpg,.jpeg,.png" onChange={(d, n) => setUpload(type, d, n)} />
                      {up.data && (
                        <div className="flex gap-1.5">
                          <input type="date" className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg" value={up.expiry} onChange={e => setExpiry(type, e.target.value)} placeholder="Expiry date" />
                          <button onClick={() => uploadDoc(type, label)} disabled={saving === type} className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg disabled:opacity-60">
                            {saving === type ? '…' : <Upload className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <FileUpload label="Upload document" value={up?.data} fileName={up?.name} accept=".pdf,.jpg,.jpeg,.png" onChange={(d, n) => setUpload(type, d, n)} />
                  {up?.data && (
                    <div className="flex gap-1.5">
                      <input type="date" className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg" value={up.expiry} onChange={e => setExpiry(type, e.target.value)} placeholder="Expiry (optional)" />
                      <button onClick={() => uploadDoc(type, label)} disabled={saving === type} className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg disabled:opacity-60">
                        {saving === type ? 'Uploading…' : <><Upload className="w-3 h-3" /> Upload</>}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
