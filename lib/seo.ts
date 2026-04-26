import { BUSINESS, PRICING } from './config'

const BASE = BUSINESS.url

// ─── Reusable Organisation node ──────────────────────────────────────────────
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['TravelAgency', 'Organization'],
  '@id': `${BASE}/#organization`,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  url: BASE,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${BASE}/og-image.jpg`,
  description: BUSINESS.description,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.address.locality,
    addressCountry: BUSINESS.address.country,
  },
  areaServed: BUSINESS.serviceAreas.map((city) => ({
    '@type': 'City',
    name: city,
  })),
  knowsLanguage: ['en', 'ur', 'ar'],
  foundingDate: BUSINESS.founded,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: BUSINESS.rating.value,
    reviewCount: BUSINESS.rating.count,
    bestRating: '5',
    worstRating: '1',
  },
  priceRange: '££',
  currenciesAccepted: 'GBP, USD, CAD, AUD, SAR',
  paymentAccepted: 'Cash, Credit Card, Bank Transfer, WhatsApp Pay',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  sameAs: Object.values(BUSINESS.socials),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Umrah Transportation Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Airport Transfers',
          description:
            'Professional meet & greet transfers from Jeddah (JED) and Madinah (MED) airports to hotels in Makkah, Madinah and Jeddah.',
          serviceType: 'Airport Transfer',
          provider: { '@id': `${BASE}/#organization` },
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: PRICING.airportTransfer.sedan,
          priceCurrency: 'GBP',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Intercity Transfers',
          description:
            'Private transfers between Makkah, Madinah and Jeddah. Sedan, SUV or minivan options available.',
          serviceType: 'Private Car Transfer',
          provider: { '@id': `${BASE}/#organization` },
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: PRICING.intercityTransfer.sedan,
          priceCurrency: 'GBP',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Ziyarat Tours',
          description:
            'Guided tours to historic Islamic sites in Makkah and Madinah with multilingual guides.',
          serviceType: 'Religious Tour',
          provider: { '@id': `${BASE}/#organization` },
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: PRICING.ziyaratTour.halfDay,
          priceCurrency: 'GBP',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Umrah with Qari',
          description:
            'Step-by-step guided Umrah experience with a certified Qari. Available in English, Urdu and Arabic.',
          serviceType: 'Religious Guidance Service',
          provider: { '@id': `${BASE}/#organization` },
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: PRICING.umrahWithQari,
          priceCurrency: 'GBP',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Elderly & Disabled Assistance',
          description:
            'Wheelchair support and dedicated personal helper for elderly or disabled pilgrims during Umrah.',
          serviceType: 'Accessibility Assistance',
          provider: { '@id': `${BASE}/#organization` },
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: PRICING.elderlyAssistance.hourlyRate * PRICING.elderlyAssistance.minHours,
          priceCurrency: 'GBP',
        },
      },
    ],
  },
}

// ─── WebSite schema with SearchAction ────────────────────────────────────────
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE}/#website`,
  name: BUSINESS.name,
  url: BASE,
  description: BUSINESS.description,
  publisher: { '@id': `${BASE}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE}/services?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// ─── Reviews schema ───────────────────────────────────────────────────────────
export const reviewsSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Umrah Transport Services',
  brand: { '@id': `${BASE}/#organization` },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '500',
    bestRating: '5',
  },
  review: [
    {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'Mohammed Al-Farsi' },
      reviewBody:
        'Exceptional service from start to finish. The driver was waiting at Jeddah airport with a name board, helped with all luggage, and got us to our hotel in Makkah safely.',
      datePublished: '2025-03-01',
    },
    {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'Fatima Hassan' },
      reviewBody:
        'I was travelling with my elderly mother and they went above and beyond. The wheelchair assistance was perfectly arranged and the carer was so patient and kind.',
      datePublished: '2025-02-14',
    },
    {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'Ahmed Rahman' },
      reviewBody:
        'The Madinah Ziyarat tour was incredible. Our guide was extremely knowledgeable and spoke perfect English. Worth every penny.',
      datePublished: '2025-01-20',
    },
  ],
}

// ─── FAQ schema ───────────────────────────────────────────────────────────────
export const homepageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What Umrah transport services do you offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Umrah Transport offers five core services: airport transfers (from Jeddah JED and Madinah MED airports), intercity transfers (between Makkah, Madinah and Jeddah), Ziyarat tours (guided visits to historic Islamic sites), Umrah with Qari (step-by-step guided Umrah with a certified Qari), and elderly/disabled assistance (personal helper and wheelchair support). All services operate 24/7 and are available to pilgrims from the UK, USA, Canada and Australia.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does an Umrah airport transfer cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Umrah airport transfers start from £45 for a sedan (up to 3 passengers), £65 for an SUV (up to 6 passengers) and £85 for a minivan (up to 12 passengers). These prices cover transfers from Jeddah King Abdulaziz International Airport (JED) or Madinah Airport (MED) to hotels in Makkah, Madinah or Jeddah. All transfers include meet & greet, flight tracking and luggage assistance.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get from Jeddah airport to Makkah for Umrah?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The easiest way to travel from Jeddah Airport (JED) to Makkah is via a private airport transfer with Umrah Transport. The journey takes approximately 60–90 minutes. Your driver will meet you at arrivals with a name board and assist with your luggage. You can book online in minutes at umrahtransport.me or contact us via WhatsApp for an instant quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you support elderly or disabled pilgrims during Umrah?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Umrah Transport provides dedicated elderly and disabled assistance including a personal helper, wheelchair support, assistance entering and exiting Masjid al-Haram, and door-to-door service. We offer half-day (5-hour) bookings from £85 and full-day (10-hour) bookings from £150.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get a guided Umrah with a Qari in English?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Our "Umrah with Qari" service pairs you with a certified Qari who guides you through every step of Umrah — from Ihram intention to Tawaf, Sa\'i and completion. The service is available in English, Urdu and Arabic and is ideal for first-time pilgrims. Pricing starts from £180 per session.',
      },
    },
  ],
}

// ─── Breadcrumb builder ───────────────────────────────────────────────────────
export function breadcrumbSchema(
  crumbs: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

// ─── Service page schema builder ─────────────────────────────────────────────
export function serviceSchema({
  name,
  description,
  url,
  minPrice,
  serviceType,
}: {
  name: string
  description: string
  url: string
  minPrice: number
  serviceType: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    serviceType,
    provider: { '@id': `${BASE}/#organization` },
    areaServed: BUSINESS.serviceAreas.map((city) => ({
      '@type': 'City',
      name: city,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${name} Pricing`,
      itemListElement: [
        {
          '@type': 'Offer',
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice,
            priceCurrency: 'GBP',
          },
          availability: 'https://schema.org/InStock',
          url,
        },
      ],
    },
  }
}
