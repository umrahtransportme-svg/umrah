'use client'

import { useState } from 'react'
import { Edit2, Eye, FileText, Globe, ChevronRight, Save } from 'lucide-react'
import AdminModal from '@/components/admin/ui/Modal'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/admin/utils'
import { useAdminStore } from '@/lib/admin/store'
import type { CMSPage } from '@/lib/admin/store'

const sections = ['Core', 'Services', 'Info', 'Legal']

export default function AdminCMSPage() {
  const { pages, updatePage, settings } = useAdminStore()
  const [editPage, setEditPage] = useState<CMSPage | null>(null)
  const [form, setForm] = useState<Partial<CMSPage>>({})

  function openEdit(p: CMSPage) {
    setForm({ ...p })
    setEditPage(p)
  }

  function save() {
    if (!editPage) return
    updatePage(editPage.id, form)
    setEditPage(null)
  }

  const domain = settings.domain || 'www.umrahtransport.me'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage website pages and content</p>
        <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
          <Globe className="w-3.5 h-3.5" /> View Website
        </a>
      </div>

      {sections.map((section) => {
        const sectionPages = pages.filter((p) => p.section === section)
        if (!sectionPages.length) return null
        return (
          <div key={section} className="card overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{section} Pages</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {sectionPages.map((page) => (
                <div key={page.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                  <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 text-sm">{page.title}</span>
                      <span className={cn('badge text-xs', page.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700')}>
                        {page.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="text-xs text-slate-400 font-mono">{page.slug}</code>
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                      <span className="text-xs text-slate-400">Edited {formatDate(page.lastEdited)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a href={`https://${domain}${page.slug}`} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => openEdit(page)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {editPage && (
        <AdminModal open onClose={() => setEditPage(null)} title={`Edit — ${editPage.title}`} size="lg"
          footer={<>
            <button onClick={() => setEditPage(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={save} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors"><Save className="w-3.5 h-3.5" /> Save Changes</button>
          </>}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Page Title</label>
                <input type="text" value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="label">Status</label>
                <select value={form.status || 'published'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CMSPage['status'] }))} className="input text-sm">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">URL Slug</label>
              <input type="text" value={form.slug || ''} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="input font-mono text-sm" placeholder="/page-slug" />
            </div>
            <div>
              <label className="label">Meta Description</label>
              <textarea rows={2} value={form.metaDescription || ''} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} className="input resize-none" placeholder="SEO meta description (155 characters max)..." />
            </div>
            <div>
              <label className="label">Page Notes / Content Brief</label>
              <textarea rows={4} value={form.content || ''} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="input resize-none text-sm" placeholder="Add notes about this page's content..." />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500">
              To edit the full page content, open the corresponding file in <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">app/</code> and redeploy — or connect a headless CMS (Sanity, Contentful) for live editing.
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  )
}
