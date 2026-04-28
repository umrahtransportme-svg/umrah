'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, ChevronDown, ChevronRight, CheckCircle2, Globe, Home, Phone, HelpCircle, Info, Layers, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlockDef { key: string; label: string; type: 'text' | 'textarea' | 'color' | 'url'; placeholder?: string }
interface SectionDef { label: string; blocks: BlockDef[] }
interface PageDef { label: string; icon: React.ElementType; sections: Record<string, SectionDef> }

const PAGES: Record<string, PageDef> = {
  home: {
    label: 'Home', icon: Home,
    sections: {
      hero: {
        label: 'Hero Section',
        blocks: [
          { key: 'badge',         label: 'Top Badge Text',     type: 'text',     placeholder: 'Trusted by UK & US families since 2018' },
          { key: 'title',         label: 'Main Headline',      type: 'textarea', placeholder: 'Your Trusted Transport Partner for Umrah' },
          { key: 'subtitle',      label: 'Sub-headline',       type: 'textarea', placeholder: 'Premium, reliable transportation for every pilgrim.' },
          { key: 'cta_primary',   label: 'Primary Button',     type: 'text',     placeholder: 'Book Your Transfer' },
          { key: 'cta_secondary', label: 'Secondary Button',   type: 'text',     placeholder: 'WhatsApp Us' },
          { key: 'card_title',    label: 'Feature Card Title', type: 'text',     placeholder: 'Why pilgrims choose us' },
          { key: 'card_sub',      label: 'Feature Card Sub',   type: 'text',     placeholder: 'The complete pilgrimage experience' },
          { key: 'badge_confirm', label: 'Floating Badge',     type: 'text',     placeholder: 'Instant Confirmation' },
        ],
      },
      stats: {
        label: 'Stats Bar',
        blocks: [
          { key: 'stat1_value', label: 'Stat 1 — Value', type: 'text', placeholder: '1,000+' },
          { key: 'stat1_label', label: 'Stat 1 — Label', type: 'text', placeholder: 'Pilgrims Served' },
          { key: 'stat2_value', label: 'Stat 2 — Value', type: 'text', placeholder: '4.9★' },
          { key: 'stat2_label', label: 'Stat 2 — Label', type: 'text', placeholder: 'Average Rating' },
          { key: 'stat3_value', label: 'Stat 3 — Value', type: 'text', placeholder: '6+' },
          { key: 'stat3_label', label: 'Stat 3 — Label', type: 'text', placeholder: 'Years Experience' },
          { key: 'stat4_value', label: 'Stat 4 — Value', type: 'text', placeholder: '24/7' },
          { key: 'stat4_label', label: 'Stat 4 — Label', type: 'text', placeholder: 'Customer Support' },
        ],
      },
      why_us: {
        label: 'Why Choose Us',
        blocks: [
          { key: 'badge',    label: 'Section Badge',    type: 'text',     placeholder: 'Why Choose Us' },
          { key: 'title',    label: 'Section Heading',  type: 'textarea', placeholder: 'The trusted choice for pilgrims worldwide' },
          { key: 'subtitle', label: 'Section Sub-text', type: 'textarea', placeholder: 'Every detail handled with care.' },
          { key: 'card1_title', label: 'Card 1 — Title', type: 'text', placeholder: 'Professional Drivers' },
          { key: 'card1_desc',  label: 'Card 1 — Desc',  type: 'textarea', placeholder: 'Vetted, licensed and trained.' },
          { key: 'card2_title', label: 'Card 2 — Title', type: 'text', placeholder: 'Flight Tracking' },
          { key: 'card2_desc',  label: 'Card 2 — Desc',  type: 'textarea', placeholder: 'We monitor your flight in real-time.' },
          { key: 'card3_title', label: 'Card 3 — Title', type: 'text', placeholder: 'Fixed Prices' },
          { key: 'card3_desc',  label: 'Card 3 — Desc',  type: 'textarea', placeholder: 'No hidden fees, no surprises.' },
          { key: 'card4_title', label: 'Card 4 — Title', type: 'text', placeholder: 'Multilingual' },
          { key: 'card4_desc',  label: 'Card 4 — Desc',  type: 'textarea', placeholder: 'English, Urdu and Arabic support.' },
          { key: 'card5_title', label: 'Card 5 — Title', type: 'text', placeholder: 'Wheelchair Support' },
          { key: 'card5_desc',  label: 'Card 5 — Desc',  type: 'textarea', placeholder: 'Full elderly and disability assistance.' },
          { key: 'card6_title', label: 'Card 6 — Title', type: 'text', placeholder: '24/7 WhatsApp' },
          { key: 'card6_desc',  label: 'Card 6 — Desc',  type: 'textarea', placeholder: 'Always reachable, instant replies.' },
        ],
      },
      how_it_works: {
        label: 'How It Works',
        blocks: [
          { key: 'badge',    label: 'Section Badge',   type: 'text',     placeholder: 'How It Works' },
          { key: 'title',    label: 'Section Heading', type: 'textarea', placeholder: 'Booking your transfer in 4 simple steps' },
          { key: 'subtitle', label: 'Section Sub',     type: 'textarea', placeholder: 'From inquiry to arrival — fast and easy.' },
          { key: 'step1_title', label: 'Step 1 — Title', type: 'text',     placeholder: 'Choose your service' },
          { key: 'step1_desc',  label: 'Step 1 — Desc',  type: 'textarea', placeholder: 'Select the service you need.' },
          { key: 'step2_title', label: 'Step 2 — Title', type: 'text',     placeholder: 'Share your details' },
          { key: 'step2_desc',  label: 'Step 2 — Desc',  type: 'textarea', placeholder: 'Provide your flight information.' },
          { key: 'step3_title', label: 'Step 3 — Title', type: 'text',     placeholder: 'Receive confirmation' },
          { key: 'step3_desc',  label: 'Step 3 — Desc',  type: 'textarea', placeholder: 'WhatsApp confirmation within minutes.' },
          { key: 'step4_title', label: 'Step 4 — Title', type: 'text',     placeholder: 'Travel with ease' },
          { key: 'step4_desc',  label: 'Step 4 — Desc',  type: 'textarea', placeholder: 'Your driver meets you and handles everything.' },
        ],
      },
      booking_cta: {
        label: 'Booking Call-to-Action',
        blocks: [
          { key: 'title',       label: 'Heading',     type: 'textarea', placeholder: 'Ready to begin your sacred journey?' },
          { key: 'subtitle',    label: 'Sub-text',    type: 'textarea', placeholder: 'Book your transfer in minutes.' },
          { key: 'button_text', label: 'Button Text', type: 'text',     placeholder: 'Book Now' },
          { key: 'phone_label', label: 'Phone Label', type: 'text',     placeholder: 'Call us' },
        ],
      },
    },
  },
  about: {
    label: 'About', icon: Info,
    sections: {
      hero: {
        label: 'Hero Section',
        blocks: [
          { key: 'badge',    label: 'Badge Text',    type: 'text',     placeholder: 'About Us' },
          { key: 'title',    label: 'Page Heading',  type: 'textarea', placeholder: 'Your trusted partner for Umrah' },
          { key: 'subtitle', label: 'Sub-heading',   type: 'textarea', placeholder: 'A family-run business serving pilgrims.' },
        ],
      },
      story: {
        label: 'Our Story',
        blocks: [
          { key: 'title',   label: 'Story Heading', type: 'text',     placeholder: 'Our Story' },
          { key: 'content', label: 'Story Text',    type: 'textarea', placeholder: 'Founded in 2018, Umrah Transport was born...' },
        ],
      },
      mission: {
        label: 'Mission & Values',
        blocks: [
          { key: 'title',   label: 'Mission Heading', type: 'text',     placeholder: 'Our Mission' },
          { key: 'content', label: 'Mission Text',    type: 'textarea', placeholder: 'To provide every pilgrim with safe, reliable transport.' },
        ],
      },
    },
  },
  contact: {
    label: 'Contact', icon: Phone,
    sections: {
      hero: {
        label: 'Hero Section',
        blocks: [
          { key: 'badge',    label: 'Badge Text',   type: 'text',     placeholder: 'Contact Us' },
          { key: 'title',    label: 'Page Heading', type: 'textarea', placeholder: 'We are here to help you' },
          { key: 'subtitle', label: 'Sub-heading',  type: 'textarea', placeholder: 'Our team is available 24/7.' },
        ],
      },
    },
  },
  faq: {
    label: 'FAQ', icon: HelpCircle,
    sections: {
      hero: {
        label: 'Hero Section',
        blocks: [
          { key: 'badge',    label: 'Badge Text',   type: 'text',     placeholder: 'FAQ' },
          { key: 'title',    label: 'Page Heading', type: 'textarea', placeholder: 'Frequently Asked Questions' },
          { key: 'subtitle', label: 'Sub-heading',  type: 'textarea', placeholder: 'Find answers to common questions.' },
        ],
      },
      items: {
        label: 'FAQ Items',
        blocks: [
          { key: 'q1', label: 'Question 1', type: 'text',     placeholder: 'How do I pay for my booking?' },
          { key: 'a1', label: 'Answer 1',   type: 'textarea', placeholder: 'Once we confirm your booking via WhatsApp...' },
          { key: 'q2', label: 'Question 2', type: 'text',     placeholder: 'What happens if my flight is delayed?' },
          { key: 'a2', label: 'Answer 2',   type: 'textarea', placeholder: 'We track all flights in real-time...' },
          { key: 'q3', label: 'Question 3', type: 'text',     placeholder: 'Can I book for a group?' },
          { key: 'a3', label: 'Answer 3',   type: 'textarea', placeholder: 'Absolutely. We have minivans...' },
          { key: 'q4', label: 'Question 4', type: 'text',     placeholder: 'Do you offer wheelchair accessible vehicles?' },
          { key: 'a4', label: 'Answer 4',   type: 'textarea', placeholder: 'Yes. We can arrange wheelchair-accessible vehicles...' },
          { key: 'q5', label: 'Question 5', type: 'text',     placeholder: 'How far in advance should I book?' },
          { key: 'a5', label: 'Answer 5',   type: 'textarea', placeholder: 'We recommend booking at least 48–72 hours in advance...' },
          { key: 'q6', label: 'Question 6 (optional)', type: 'text',     placeholder: '' },
          { key: 'a6', label: 'Answer 6 (optional)',   type: 'textarea', placeholder: '' },
        ],
      },
    },
  },
  services: {
    label: 'Services', icon: Layers,
    sections: {
      hero: {
        label: 'Services Page Hero',
        blocks: [
          { key: 'badge',    label: 'Badge Text',   type: 'text',     placeholder: 'Our Services' },
          { key: 'title',    label: 'Page Heading', type: 'textarea', placeholder: 'Everything you need for your pilgrimage' },
          { key: 'subtitle', label: 'Sub-heading',  type: 'textarea', placeholder: 'From the moment you land...' },
        ],
      },
    },
  },
  global: {
    label: 'Global / Branding', icon: Globe,
    sections: {
      nav: {
        label: 'Navigation & Logo',
        blocks: [
          { key: 'logo_line1', label: 'Logo — Line 1',  type: 'text', placeholder: 'Umrah' },
          { key: 'logo_line2', label: 'Logo — Line 2',  type: 'text', placeholder: 'Transport' },
          { key: 'tagline',    label: 'Site Tagline',   type: 'text', placeholder: 'Premium Pilgrimage Transportation' },
        ],
      },
      footer: {
        label: 'Footer',
        blocks: [
          { key: 'tagline',   label: 'Footer Tagline',   type: 'textarea', placeholder: 'Premium transportation services for Umrah pilgrims from UK, USA, Canada & Australia.' },
          { key: 'copyright', label: 'Copyright Name',   type: 'text',     placeholder: 'Umrah Transport' },
        ],
      },
      seo: {
        label: 'SEO & Meta Tags',
        blocks: [
          { key: 'home_title',       label: 'Homepage — Meta Title',       type: 'text',     placeholder: 'Umrah Transport | Premium Pilgrimage Transportation' },
          { key: 'home_description', label: 'Homepage — Meta Description', type: 'textarea', placeholder: 'Umrah Transport offers premium, reliable transportation...' },
        ],
      },
    },
  },
}

type BlockValues = Record<string, string>
type ContentStore = Record<string, Record<string, BlockValues>>

export default function CmsPage() {
  const [activePage, setActivePage] = useState('home')
  const [openSection, setOpenSection] = useState<string | null>('hero')
  const [content, setContent] = useState<ContentStore>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/content?page=${activePage}`)
    if (!res.ok) return
    const blocks: { section: string; key: string; value: string }[] = await res.json()
    const store: Record<string, BlockValues> = {}
    for (const b of blocks) {
      if (!store[b.section]) store[b.section] = {}
      store[b.section][b.key] = b.value
    }
    setContent(prev => ({ ...prev, [activePage]: store }))
  }, [activePage])

  useEffect(() => { load() }, [load])

  function get(section: string, key: string): string {
    return content[activePage]?.[section]?.[key] ?? ''
  }
  function set(section: string, key: string, value: string) {
    setContent(prev => ({
      ...prev,
      [activePage]: { ...prev[activePage], [section]: { ...(prev[activePage]?.[section] ?? {}), [key]: value } },
    }))
  }

  async function saveSection(sectionId: string) {
    const sectionKey = `${activePage}/${sectionId}`
    setSaving(sectionKey); setError('')
    const sectionDef = PAGES[activePage]?.sections[sectionId]
    if (!sectionDef) return
    const blocks = sectionDef.blocks.map((b, i) => ({ key: b.key, value: get(sectionId, b.key), type: b.type, label: b.label, sortOrder: i }))
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: activePage, section: sectionId, blocks }),
    })
    setSaving(null)
    if (res.ok) { setSaved(sectionKey); setTimeout(() => setSaved(null), 2500) }
    else setError(`Save failed (${res.status}) — please try again.`)
  }

  const pageDef = PAGES[activePage]

  return (
    <div className="flex gap-6">
      {/* Page sidebar */}
      <aside className="w-44 flex-shrink-0 space-y-1">
        {Object.entries(PAGES).map(([id, pg]) => (
          <button key={id} onClick={() => { setActivePage(id); setOpenSection('hero') }}
            className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all',
              activePage === id ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100')}>
            <pg.icon className="w-4 h-4 flex-shrink-0" />
            {pg.label}
          </button>
        ))}
      </aside>

      {/* Editor */}
      <div className="flex-1 min-w-0 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{pageDef.label} — Content Editor</h1>
          <p className="text-sm text-slate-500 mt-0.5">Edit text for each section. Changes go live instantly after saving.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {Object.entries(pageDef.sections).map(([sectionId, sectionDef]) => {
          const sectionKey = `${activePage}/${sectionId}`
          const isOpen = openSection === sectionId

          return (
            <div key={sectionId} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <button onClick={() => setOpenSection(isOpen ? null : sectionId)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left">
                <span className="font-semibold text-slate-800">{sectionDef.label}</span>
                <div className="flex items-center gap-3">
                  {saved === sectionKey && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>}
                  <span className="text-xs text-slate-400">{sectionDef.blocks.length} fields</span>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {sectionDef.blocks.map((b) => (
                      <div key={b.key} className={b.type === 'textarea' ? 'md:col-span-2' : ''}>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{b.label}</label>
                        {b.type === 'textarea' ? (
                          <textarea rows={3} value={get(sectionId, b.key)}
                            onChange={e => set(sectionId, b.key, e.target.value)}
                            placeholder={b.placeholder} className="input-field resize-y text-sm" />
                        ) : b.type === 'color' ? (
                          <div className="flex items-center gap-3">
                            <input type="color" value={get(sectionId, b.key) || '#2563eb'}
                              onChange={e => set(sectionId, b.key, e.target.value)}
                              className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                            <input type="text" value={get(sectionId, b.key)}
                              onChange={e => set(sectionId, b.key, e.target.value)}
                              placeholder={b.placeholder} className="input-field text-sm font-mono flex-1" />
                          </div>
                        ) : (
                          <input type="text" value={get(sectionId, b.key)}
                            onChange={e => set(sectionId, b.key, e.target.value)}
                            placeholder={b.placeholder} className="input-field text-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">Saves to database and revalidates the live site cache.</span>
                    <button onClick={() => saveSection(sectionId)} disabled={saving === sectionKey}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
                      {saving === sectionKey ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                        : saved === sectionKey ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
                        : <><Save className="w-4 h-4" /> Save Section</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
