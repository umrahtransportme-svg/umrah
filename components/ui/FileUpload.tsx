'use client'

import { useRef, useState } from 'react'
import { Upload, X, FileText, Image as ImageIcon, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value?: string | null
  fileName?: string | null
  onChange: (data: string | null, name: string | null) => void
  accept?: string
  label: string
  preview?: boolean
  maxMB?: number
  className?: string
}

export default function FileUpload({ value, fileName, onChange, accept = '*', label, preview = false, maxMB = 2, className }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  function handleFile(file: File) {
    setError(null)
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File too large. Max ${maxMB}MB.`)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => onChange(e.target?.result as string, file.name)
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const isImage = value?.startsWith('data:image')

  return (
    <div className={cn('space-y-1', className)}>
      <label className="block text-xs font-semibold text-slate-700">{label}</label>

      {value ? (
        <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            {isImage ? <ImageIcon className="w-4 h-4 text-green-600" /> : <FileText className="w-4 h-4 text-green-600" />}
          </div>
          <span className="text-xs text-green-800 font-medium flex-1 truncate">{fileName || 'Uploaded'}</span>
          <div className="flex gap-1">
            {isImage && preview && (
              <button type="button" onClick={() => setShowPreview(true)}
                className="p-1 rounded-lg text-green-600 hover:bg-green-100 transition-colors">
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
            <button type="button" onClick={() => onChange(null, null)}
              className="p-1 rounded-lg text-green-600 hover:bg-red-100 hover:text-red-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-1.5 p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-colors"
        >
          <Upload className="w-5 h-5 text-slate-400" />
          <span className="text-xs text-slate-500 text-center">Click or drop file<br /><span className="text-slate-400">Max {maxMB}MB</span></span>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />

      {showPreview && value && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowPreview(false)}>
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPreview(false)} className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <X className="w-4 h-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}
