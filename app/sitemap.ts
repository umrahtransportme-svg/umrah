import type { MetadataRoute } from 'next'
import { BUSINESS } from '@/lib/config'

const BASE = BUSINESS.url

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    // ── Core pages ──────────────────────────────────────────────────────────
    {
      url: BASE,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/book`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },

    // ── Services ─────────────────────────────────────────────────────────────
    {
      url: `${BASE}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE}/services/airport-transfers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE}/services/intercity-transfers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE}/services/ziyarat-tours`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE}/services/special-services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },

    // ── Information pages ────────────────────────────────────────────────────
    {
      url: `${BASE}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/about`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${BASE}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ]
}
