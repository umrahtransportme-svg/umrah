'use client'

import { useState } from 'react'
import { Upload, Image as ImageIcon, FileText, Film, Trash2, Download, Search, Grid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/admin/utils'

const MEDIA = [
  { id: 'm1', name: 'hero-makkah.jpg', type: 'image', size: '420 KB', url: '/media/hero-makkah.jpg', uploaded: '2025-04-20T10:00:00Z', dimensions: '1920×1080' },
  { id: 'm2', name: 'madinah-skyline.jpg', type: 'image', size: '380 KB', url: '/media/madinah-skyline.jpg', uploaded: '2025-04-19T14:00:00Z', dimensions: '1920×1080' },
  { id: 'm3', name: 'airport-transfer.jpg', type: 'image', size: '290 KB', url: '/media/airport-transfer.jpg', uploaded: '2025-04-18T09:00:00Z', dimensions: '1200×800' },
  { id: 'm4', name: 'toyota-hiace.jpg', type: 'image', size: '210 KB', url: '/media/toyota-hiace.jpg', uploaded: '2025-04-17T11:00:00Z', dimensions: '1200×800' },
  { id: 'm5', name: 'terms-conditions.pdf', type: 'pdf', size: '85 KB', url: '/media/terms.pdf', uploaded: '2025-04-10T08:00:00Z', dimensions: '' },
  { id: 'm6', name: 'privacy-policy.pdf', type: 'pdf', size: '72 KB', url: '/media/privacy.pdf', uploaded: '2025-04-10T08:30:00Z', dimensions: '' },
  { id: 'm7', name: 'logo-white.svg', type: 'image', size: '8 KB', url: '/media/logo-white.svg', uploaded: '2025-04-01T10:00:00Z', dimensions: 'Vector' },
  { id: 'm8', name: 'logo-dark.svg', type: 'image', size: '8 KB', url: '/media/logo-dark.svg', uploaded: '2025-04-01T10:05:00Z', dimensions: 'Vector' },
  { id: 'm9', name: 'promo-video.mp4', type: 'video', size: '12 MB', url: '/media/promo.mp4', uploaded: '2025-03-20T15:00:00Z', dimensions: '1920×1080' },
]

const FILE_ICONS: Record<string, React.ReactNode> = {
  image: <ImageIcon className="w-5 h-5 text-blue-500" />,
  pdf: <FileText className="w-5 h-5 text-red-500" />,
  video: <Film className="w-5 h-5 text-purple-500" />,
}

const TYPE_COLORS: Record<string, string> = {
  image: 'bg-blue-50 text-blue-700',
  pdf:   'bg-red-50 text-red-700',
  video: 'bg-purple-50 text-purple-700',
}

export default function AdminMediaPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = MEDIA.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || m.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-sm"
          />
        </div>
        <div className="flex gap-1">
          {['all', 'image', 'pdf', 'video'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
                typeFilter === t ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          <button onClick={() => setView('grid')} className={cn('p-1.5 rounded-md transition-colors', view === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}>
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setView('list')} className={cn('p-1.5 rounded-md transition-colors', view === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}>
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
        <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer">
          <Upload className="w-3.5 h-3.5" /> Upload
          <input type="file" className="hidden" multiple accept="image/*,video/*,.pdf" />
        </label>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((file) => (
            <div key={file.id} className="card group overflow-hidden">
              <div className="h-28 bg-slate-100 flex items-center justify-center">
                {file.type === 'image' ? (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {FILE_ICONS[file.type]}
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-slate-900 truncate">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{file.size}</p>
                <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={cn('badge text-xs', TYPE_COLORS[file.type])}>{file.type}</span>
                  <button className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">File</th>
                <th className="table-th hidden md:table-cell">Type</th>
                <th className="table-th hidden sm:table-cell">Size</th>
                <th className="table-th hidden lg:table-cell">Uploaded</th>
                <th className="table-th w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-2.5">
                      {FILE_ICONS[file.type]}
                      <span className="text-xs font-medium text-slate-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="table-td hidden md:table-cell">
                    <span className={cn('badge text-xs capitalize', TYPE_COLORS[file.type])}>{file.type}</span>
                  </td>
                  <td className="table-td hidden sm:table-cell"><span className="text-xs text-slate-600">{file.size}</span></td>
                  <td className="table-td hidden lg:table-cell"><span className="text-xs text-slate-400">{formatDate(file.uploaded)}</span></td>
                  <td className="table-td">
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded text-slate-400 hover:text-brand-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-400 text-right">{filtered.length} files</p>
    </div>
  )
}
