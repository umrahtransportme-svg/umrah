export const BUSINESS = {
  name: 'Umrah Transport',
  legalName: 'Umrah Transport Ltd',
  tagline: 'Premium Pilgrimage Transportation — Makkah, Madinah & Jeddah',
  description:
    'Umrah Transport provides premium, reliable transportation services for Muslim pilgrims performing Umrah. We serve families from the UK, USA, Canada and Australia with airport transfers, intercity travel, Ziyarat tours and guided Umrah in Makkah, Madinah and Jeddah.',
  url: 'https://www.umrahtransport.me',
  domain: 'umrahtransport.me',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '447456938750',
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+44 7456 938750',
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'info@umrahtransport.me',
  address: {
    locality: 'London',
    country: 'GB',
    countryName: 'United Kingdom',
  },
  founded: '2018',
  rating: { value: '4.9', count: '500' },
  languages: ['English', 'Urdu', 'Arabic'],
  serviceAreas: ['Makkah', 'Madinah', 'Jeddah'],
  marketsServed: ['United Kingdom', 'United States', 'Canada', 'Australia', 'Europe'],
  socials: {
    instagram: 'https://instagram.com/umrahtransport',
    facebook: 'https://facebook.com/umrahtransport',
    twitter: 'https://twitter.com/umrahtransport',
  },
}

export const WHATSAPP_MESSAGES = {
  general:
    'Hello! I would like to enquire about your Umrah transportation services.',
  booking: (service: string) =>
    `Hello! I would like to book a *${service}* with Umrah Transport. Please confirm availability.`,
  quote: (details: string) =>
    `Hello Umrah Transport! I would like a quote for the following:\n\n${details}`,
}

export const PRICING = {
  airportTransfer: {
    sedan:      45,
    suv:        65,
    'luxury-suv': 95,
    hiace:      120,
    coaster:    180,
  },
  intercityTransfer: {
    sedan:      85,
    suv:        115,
    'luxury-suv': 155,
    hiace:      180,
    coaster:    280,
  },
  ziyaratTour: {
    halfDay: 75,
    fullDay: 120,
  },
  umrahWithQari: 180,
  elderlyAssistance: {
    hourlyRate: 20,
    minHours: 4,
    fullDayHours: 10,
    fullDayRate: 150,
  },
}

export const SEO = {
  siteName: 'Umrah Transport',
  defaultTitle:
    'Umrah Transport | Premium Pilgrimage Transportation — Makkah, Madinah & Jeddah',
  titleTemplate: '%s | Umrah Transport',
  defaultDescription:
    'Umrah Transport offers premium, reliable transportation for Umrah pilgrims from UK, USA, Canada & Australia. Airport transfers, intercity travel, Ziyarat tours & guided Umrah in Makkah, Madinah & Jeddah. Book online in minutes.',
  keywords: [
    'umrah transport',
    'umrah transportation',
    'umrah transfers',
    'makkah airport transfer',
    'jeddah airport to makkah',
    'madinah airport transfer',
    'makkah madinah transport',
    'umrah car hire',
    'pilgrimage transport',
    'ziyarat tour makkah',
    'ziyarat tour madinah',
    'umrah with qari',
    'umrah guide service',
    'elderly umrah assistance',
    'umrah transport uk',
    'umrah transport usa',
    'umrah transport canada',
    'umrah transport australia',
    'hajj transport service',
    'islamic tour guide makkah',
  ],
}
