import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import JsonLd from '@/components/seo/JsonLd'
import { organizationSchema, websiteSchema } from '@/lib/seo'
import { SEO, BUSINESS } from '@/lib/config'
import { CartProvider } from '@/lib/cart-context'
import SessionProvider from '@/components/auth/SessionProvider'
import { CurrencyProvider } from '@/lib/currency-context'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),

  title: {
    default: SEO.defaultTitle,
    template: SEO.titleTemplate,
  },
  description: SEO.defaultDescription,
  keywords: SEO.keywords,
  authors: [{ name: BUSINESS.name, url: BUSINESS.url }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  category: 'Transportation',

  // ── Canonical & alternates ──────────────────────────────────────────────────
  alternates: {
    canonical: '/',
  },

  // ── Open Graph ──────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    alternateLocale: ['en_US', 'en_CA', 'en_AU'],
    url: BUSINESS.url,
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    siteName: BUSINESS.name,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Umrah Transport — Premium Pilgrimage Transportation',
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@umrahtransport',
    creator: '@umrahtransport',
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: ['/og-image.jpg'],
  },

  // ── Robots ──────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── App / PWA ────────────────────────────────────────────────────────────────
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },

  // ── Verification (add your real codes after connecting Search Console) ───────
  verification: {
    google: 'ADD_YOUR_GOOGLE_VERIFICATION_CODE',
    // bing: 'ADD_YOUR_BING_VERIFICATION_CODE',
  },

  // ── Other ────────────────────────────────────────────────────────────────────
  other: {
    'msapplication-TileColor': '#2563eb',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Global structured data — organisation & website always present */}
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body>
        <SessionProvider>
          <CurrencyProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
            </CartProvider>
          </CurrencyProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
