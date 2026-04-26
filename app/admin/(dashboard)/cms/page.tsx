'use client'

import { useState } from 'react'
import { Edit2, Eye, FileText, Globe, ChevronRight } from 'lucide-react'
import AdminModal from '@/components/admin/ui/Modal'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/admin/utils'

const PAGES = [
  { id: 'p1', title: 'Homepage', slug: '/', status: 'published', lastEdited: '2025-04-20T10:00:00Z', section: 'Core' },
  { id: 'p2', title: 'Book Now', slug: '/book', status: 'published', lastEdited: '2025-04-18T14:00:00Z', section: 'Core' },
  { id: 'p3', title: 'Services Overview', slug: '/services', status: 'published', lastEdited: '2025-04-15T09:00:00Z', section: 'Services' },
  { id: 'p4', title: 'Airport Transfers', slug: '/services/airport-transfers', status: 'published', lastEdited: '2025-04-14T11:00:00Z', section: 'Services' },
  { id: 'p5', title: 'Intercity Transfers', slug: '/services/intercity-transfers', status: 'published', lastEdited: '2025-04-14T11:30:00Z', section: 'Services' },
  { id: 'p6', title: 'Ziyarat Tours', slug: '/services/ziyarat-tours', status: 'published', lastEdited: '2025-04-14T12:00:00Z', section: 'Services' },
  { id: 'p8', title: 'FAQ', slug: '/faq', status: 'published', lastEdited: '2025-04-10T08:00:00Z', section: 'Info' },
  { id: 'p9', title: 'About Us', slug: '/about', status: 'published', lastEdited: '2025-04-08T15:00:00Z', section: 'Info' },
  { id: 'p10', title: 'Contact', slug: '/contact', status: 'published', lastEdited: '2025-04-08T15:30:00Z', section: 'Info' },
  { id: 'p11', title: 'Privacy Policy', slug: '/privacy', status: 'draft', lastEdited: '2025-04-01T09:00:00Z', section: 'Legal' },
  { id: 'p12', title: 'Terms of Service', slug: '/terms', status: 'draft', lastEdited: '2025-04-01T09:30:00Z', section: 'Legal' },
]

const sections = [...new Set(PAGES.map((p) => p.section))]

export default function AdminCMSPage() {
  const [editPage, setEditPage] = useState<typeof PAGES[0] | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage website pages and content</p>
        <a href="https://www.umrahtransport.me" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
          <Globe className="w-3.5 h-3.5" /> View Website
        </a>
      </div>
      {sections.map((section) => (
        <div key={section} className="card overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100"><h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{section} Pages</h3></div>
          <div className="divide-y divide-slate-50">
            {PAGES.filter((p) => p.section === section).map((page) => (
              <div key={page.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 text-sm">{page.title}</span>
                    <span className={cn('badge text-xs', page.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700')}>{page.status}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <code className="text-xs text-slate-400 font-mono">{page.slug}</code>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="text-xs text-slate-400">Edited {formatDate(page.lastEdited)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a href={`https://www.umrahtransport.me${page.slug}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"><Eye className="w-3.5 h-3.5" /></a>
                  <button onClick={() => setEditPage(page)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {editPage && (
        <AdminModal open={!!editPage} onClose={() => setEditPage(null)} title={`Edit — ${editPage.title}`} size="lg"
          footer={<><button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setEditPage(null)}>Cancel</button><button className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">Save Changes</button></>}
        >
          <div className="space-y-4">
            <div><label className="label">Page Title</label><input type="text" defaultValue={editPage.title} className="input" /></div>
            <div><label className="label">URL Slug</label><input type="text" defaultValue={editPage.slug} className="input font-mono text-sm" /></div>
            <div><label className="label">Meta Description</label><textarea rows={3} className="input resize-none" placeholder="SEO meta description..." /></div>
            <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-500 text-center">Full content editor — connect to Sanity, Contentful, or custom CMS</div>
          </div>
        </AdminModal>
      )}
    </div>
  )
}
