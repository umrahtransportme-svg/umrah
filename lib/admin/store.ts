'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Booking, Driver, Vehicle, Vendor, AdminUser, Review, BookingStatus } from './types'

// ─── Serialisable domain types (no React components) ────────────────────────

export interface AdminService {
  id: string
  name: string
  iconName: string
  enabled: boolean
  bookings: number
  revenue: number
  description: string
  pricing: { id: string; label: string; price: number }[]
  colorClass: string
}

export interface CMSPage {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  metaDescription: string
  content: string
  lastEdited: string
  section: string
}

export interface AdminIntegration {
  id: string
  name: string
  description: string
  category: string
  connected: boolean
  status: 'live' | 'disconnected' | 'error'
  icon: string
  docsUrl: string
  apiKey: string
  webhookUrl: string
  extraConfig: Record<string, string>
}

export interface AutomationRule {
  id: string
  name: string
  trigger: string
  action: string
  target: string
  enabled: boolean
  runs: number
  lastRun: string
}

export interface AdminSettings {
  businessName: string
  legalName: string
  domain: string
  founded: string
  whatsappNumber: string
  email: string
  address: string
  primaryColor: string
  stripePublishableKey: string
  stripeSecretKey: string
  stripeWebhookSecret: string
  stripeMode: 'test' | 'live'
  whatsappPhoneNumberId: string
  whatsappAccountId: string
  whatsappApiToken: string
  googleAnalyticsId: string
  notifications: Record<string, boolean>
}

// ─── Initial data ────────────────────────────────────────────────────────────

const INITIAL_SETTINGS: AdminSettings = {
  businessName: 'UmraTransport',
  legalName: 'Umra Transport Ltd',
  domain: 'www.umrahtransport.me',
  founded: '2018',
  whatsappNumber: '+44 7700 000000',
  email: 'info@umrahtransport.me',
  address: 'London, United Kingdom',
  primaryColor: '#2563eb',
  stripePublishableKey: '',
  stripeSecretKey: '',
  stripeWebhookSecret: '',
  stripeMode: 'test',
  whatsappPhoneNumberId: '',
  whatsappAccountId: '',
  whatsappApiToken: '',
  googleAnalyticsId: '',
  notifications: {
    new_booking: true,
    booking_cancelled: true,
    payment_received: true,
    new_review: true,
    driver_unassigned: false,
    weekly_reports: true,
  },
}

const INITIAL_SERVICES: AdminService[] = [
  { id: 's1', name: 'Airport Transfer', iconName: 'Plane', enabled: true, bookings: 112, revenue: 7280, description: 'Private transfers to/from Jeddah (JED) and Madinah (MED) airports.', pricing: [{ id: 'sp1', label: 'Sedan (3 pax)', price: 45 }, { id: 'sp2', label: 'SUV (6 pax)', price: 65 }, { id: 'sp3', label: 'Minivan (12 pax)', price: 85 }], colorClass: 'bg-blue-50 text-blue-600' },
  { id: 's2', name: 'Intercity Transfer', iconName: 'Car', enabled: true, bookings: 69, revenue: 6210, description: 'Private intercity transfers between Makkah, Madinah, and Jeddah.', pricing: [{ id: 'sp4', label: 'Sedan', price: 85 }, { id: 'sp5', label: 'SUV', price: 115 }, { id: 'sp6', label: 'Minivan', price: 145 }], colorClass: 'bg-purple-50 text-purple-600' },
  { id: 's3', name: 'Ziyarat Tours', iconName: 'MapPin', enabled: true, bookings: 37, revenue: 3330, description: 'Private guided tours of Islamic historical sites.', pricing: [{ id: 'sp7', label: 'Half Day', price: 75 }, { id: 'sp8', label: 'Full Day', price: 120 }], colorClass: 'bg-green-50 text-green-600' },
  { id: 's4', name: 'Umrah with Qari', iconName: 'Star', enabled: true, bookings: 20, revenue: 3600, description: 'Guided Umrah performance with a certified Qari.', pricing: [{ id: 'sp9', label: 'Per person', price: 180 }], colorClass: 'bg-amber-50 text-amber-600' },
  { id: 's5', name: 'Elderly Assistance', iconName: 'Heart', enabled: true, bookings: 9, revenue: 1030, description: 'Personal helper, wheelchair support, and Haram access assistance.', pricing: [{ id: 'sp10', label: 'Half Day (5h)', price: 85 }, { id: 'sp11', label: 'Full Day (10h)', price: 150 }], colorClass: 'bg-red-50 text-red-600' },
]

const INITIAL_PAGES: CMSPage[] = [
  { id: 'p1', title: 'Homepage', slug: '/', status: 'published', lastEdited: '2025-04-20T10:00:00Z', section: 'Core', metaDescription: 'UmraTransport — private car hire for Umrah pilgrims.', content: '' },
  { id: 'p2', title: 'Book Now', slug: '/book', status: 'published', lastEdited: '2025-04-18T14:00:00Z', section: 'Core', metaDescription: 'Book your private transfer for Umrah.', content: '' },
  { id: 'p3', title: 'Services Overview', slug: '/services', status: 'published', lastEdited: '2025-04-15T09:00:00Z', section: 'Services', metaDescription: 'Explore our full range of Umrah transport services.', content: '' },
  { id: 'p4', title: 'Airport Transfers', slug: '/services/airport-transfers', status: 'published', lastEdited: '2025-04-14T11:00:00Z', section: 'Services', metaDescription: 'Private airport transfers from JED and MED airports.', content: '' },
  { id: 'p5', title: 'Intercity Transfers', slug: '/services/intercity-transfers', status: 'published', lastEdited: '2025-04-14T11:30:00Z', section: 'Services', metaDescription: 'Private transfers between Makkah, Madinah, and Jeddah.', content: '' },
  { id: 'p6', title: 'Ziyarat Tours', slug: '/services/ziyarat-tours', status: 'published', lastEdited: '2025-04-14T12:00:00Z', section: 'Services', metaDescription: 'Private guided Ziyarat tours of Islamic sites.', content: '' },
  { id: 'p8', title: 'FAQ', slug: '/faq', status: 'published', lastEdited: '2025-04-10T08:00:00Z', section: 'Info', metaDescription: 'Frequently asked questions about UmraTransport.', content: '' },
  { id: 'p9', title: 'About Us', slug: '/about', status: 'published', lastEdited: '2025-04-08T15:00:00Z', section: 'Info', metaDescription: 'Learn about UmraTransport and our mission.', content: '' },
  { id: 'p10', title: 'Contact', slug: '/contact', status: 'published', lastEdited: '2025-04-08T15:30:00Z', section: 'Info', metaDescription: 'Get in touch with UmraTransport.', content: '' },
  { id: 'p11', title: 'Privacy Policy', slug: '/privacy', status: 'draft', lastEdited: '2025-04-01T09:00:00Z', section: 'Legal', metaDescription: 'Privacy policy for UmraTransport.', content: '' },
  { id: 'p12', title: 'Terms of Service', slug: '/terms', status: 'draft', lastEdited: '2025-04-01T09:30:00Z', section: 'Legal', metaDescription: 'Terms and conditions for UmraTransport.', content: '' },
]

const INITIAL_INTEGRATIONS: AdminIntegration[] = [
  { id: 'stripe', name: 'Stripe', description: 'Payment processing for card, Apple Pay, and Google Pay.', category: 'Payments', connected: false, status: 'disconnected', icon: '💳', docsUrl: 'https://stripe.com/docs', apiKey: '', webhookUrl: '', extraConfig: {} },
  { id: 'whatsapp', name: 'WhatsApp Business', description: 'Send booking confirmations and driver updates via WhatsApp.', category: 'Messaging', connected: false, status: 'disconnected', icon: '💬', docsUrl: 'https://business.whatsapp.com', apiKey: '', webhookUrl: '', extraConfig: { phoneNumberId: '', accountId: '' } },
  { id: 'google-maps', name: 'Google Maps', description: 'Route planning and distance calculation for transfers.', category: 'Maps', connected: false, status: 'disconnected', icon: '🗺️', docsUrl: 'https://developers.google.com/maps', apiKey: '', webhookUrl: '', extraConfig: {} },
  { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing for promotions and newsletters.', category: 'Marketing', connected: false, status: 'disconnected', icon: '📧', docsUrl: 'https://mailchimp.com', apiKey: '', webhookUrl: '', extraConfig: { listId: '' } },
  { id: 'google-analytics', name: 'Google Analytics 4', description: 'Website traffic and conversion tracking.', category: 'Analytics', connected: false, status: 'disconnected', icon: '📊', docsUrl: 'https://analytics.google.com', apiKey: '', webhookUrl: '', extraConfig: {} },
  { id: 'twilio', name: 'Twilio SMS', description: 'SMS notifications for booking updates.', category: 'Messaging', connected: false, status: 'disconnected', icon: '📱', docsUrl: 'https://twilio.com/docs', apiKey: '', webhookUrl: '', extraConfig: { accountSid: '', fromNumber: '' } },
  { id: 'zapier', name: 'Zapier', description: 'Automate workflows between apps.', category: 'Automation', connected: false, status: 'disconnected', icon: '⚡', docsUrl: 'https://zapier.com', apiKey: '', webhookUrl: '', extraConfig: {} },
  { id: 'hotjar', name: 'Hotjar', description: 'Heatmaps and user session recordings.', category: 'Analytics', connected: false, status: 'disconnected', icon: '🔥', docsUrl: 'https://hotjar.com', apiKey: '', webhookUrl: '', extraConfig: {} },
]

const INITIAL_AUTOMATION: AutomationRule[] = [
  { id: 'a1', name: 'Booking Confirmation Email', trigger: 'booking_created', action: 'email', target: 'Customer', enabled: true, runs: 247, lastRun: '2 mins ago' },
  { id: 'a2', name: 'Driver Assignment WhatsApp', trigger: 'driver_assigned', action: 'whatsapp', target: 'Driver', enabled: true, runs: 189, lastRun: '15 mins ago' },
  { id: 'a3', name: 'Payment Receipt', trigger: 'payment_received', action: 'email', target: 'Customer', enabled: true, runs: 201, lastRun: '1 hour ago' },
  { id: 'a4', name: 'Cancellation Notification', trigger: 'booking_cancelled', action: 'email', target: 'Customer + Admin', enabled: true, runs: 12, lastRun: '3 days ago' },
  { id: 'a5', name: 'Weekly Summary Report', trigger: 'schedule', action: 'email', target: 'Admin', enabled: true, runs: 24, lastRun: 'Monday 08:00' },
  { id: 'a6', name: 'Review Request (24h after)', trigger: 'booking_confirmed', action: 'whatsapp', target: 'Customer', enabled: false, runs: 0, lastRun: 'Never' },
  { id: 'a7', name: 'New Booking Admin Push', trigger: 'booking_created', action: 'push', target: 'Admin', enabled: true, runs: 247, lastRun: '2 mins ago' },
]

// ─── Store interface ─────────────────────────────────────────────────────────

interface AdminStore {
  settings: AdminSettings
  bookings: Booking[]
  drivers: Driver[]
  vehicles: Vehicle[]
  vendors: Vendor[]
  users: AdminUser[]
  reviews: Review[]
  services: AdminService[]
  pages: CMSPage[]
  integrations: AdminIntegration[]
  automationRules: AutomationRule[]

  // Settings
  updateSettings: (patch: Partial<AdminSettings>) => void
  resetSettings: () => void

  // Bookings
  updateBooking: (id: string, patch: Partial<Booking>) => void
  deleteBooking: (id: string) => void
  addBooking: (booking: Omit<Booking, 'id' | 'reference' | 'createdAt' | 'updatedAt'>) => void

  // Drivers
  updateDriver: (id: string, patch: Partial<Driver>) => void
  deleteDriver: (id: string) => void
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => void

  // Vehicles
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void
  deleteVehicle: (id: string) => void
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void

  // Vendors
  updateVendor: (id: string, patch: Partial<Vendor>) => void
  deleteVendor: (id: string) => void
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt'>) => void

  // Users
  updateUser: (id: string, patch: Partial<AdminUser>) => void
  deleteUser: (id: string) => void
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => void

  // Reviews
  updateReview: (id: string, patch: Partial<Review>) => void

  // Services
  updateService: (id: string, patch: Partial<AdminService>) => void
  deleteService: (id: string) => void
  addService: (service: Omit<AdminService, 'id'>) => void

  // Pages
  updatePage: (id: string, patch: Partial<CMSPage>) => void

  // Integrations
  updateIntegration: (id: string, patch: Partial<AdminIntegration>) => void

  // Automation
  updateAutomationRule: (id: string, patch: Partial<AutomationRule>) => void
  addAutomationRule: (rule: Omit<AutomationRule, 'id' | 'runs' | 'lastRun'>) => void
  deleteAutomationRule: (id: string) => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function bookingRef() {
  return 'BK-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      // ── Initial state ──
      settings: INITIAL_SETTINGS,
      bookings: [],           // populated from mock-data via initializer below
      drivers: [],
      vehicles: [],
      vendors: [],
      users: [],
      reviews: [],
      services: INITIAL_SERVICES,
      pages: INITIAL_PAGES,
      integrations: INITIAL_INTEGRATIONS,
      automationRules: INITIAL_AUTOMATION,

      // ── Settings ──
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      resetSettings: () => set({ settings: INITIAL_SETTINGS }),

      // ── Bookings ──
      updateBooking: (id, patch) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b,
          ),
        })),
      deleteBooking: (id) =>
        set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) })),
      addBooking: (data) =>
        set((s) => ({
          bookings: [
            {
              ...data,
              id: uid(),
              reference: bookingRef(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as Booking,
            ...s.bookings,
          ],
        })),

      // ── Drivers ──
      updateDriver: (id, patch) =>
        set((s) => ({ drivers: s.drivers.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      deleteDriver: (id) =>
        set((s) => ({ drivers: s.drivers.filter((d) => d.id !== id) })),
      addDriver: (data) =>
        set((s) => ({
          drivers: [{ ...data, id: uid(), createdAt: new Date().toISOString() } as Driver, ...s.drivers],
        })),

      // ── Vehicles ──
      updateVehicle: (id, patch) =>
        set((s) => ({ vehicles: s.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
      deleteVehicle: (id) =>
        set((s) => ({ vehicles: s.vehicles.filter((v) => v.id !== id) })),
      addVehicle: (data) =>
        set((s) => ({
          vehicles: [{ ...data, id: uid(), createdAt: new Date().toISOString() } as Vehicle, ...s.vehicles],
        })),

      // ── Vendors ──
      updateVendor: (id, patch) =>
        set((s) => ({ vendors: s.vendors.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
      deleteVendor: (id) =>
        set((s) => ({ vendors: s.vendors.filter((v) => v.id !== id) })),
      addVendor: (data) =>
        set((s) => ({
          vendors: [{ ...data, id: uid(), createdAt: new Date().toISOString() } as Vendor, ...s.vendors],
        })),

      // ── Users ──
      updateUser: (id, patch) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),
      deleteUser: (id) =>
        set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
      addUser: (data) =>
        set((s) => ({
          users: [...s.users, { ...data, id: uid(), createdAt: new Date().toISOString() } as AdminUser],
        })),

      // ── Reviews ──
      updateReview: (id, patch) =>
        set((s) => ({ reviews: s.reviews.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),

      // ── Services ──
      updateService: (id, patch) =>
        set((s) => ({ services: s.services.map((sv) => (sv.id === id ? { ...sv, ...patch } : sv)) })),
      deleteService: (id) =>
        set((s) => ({ services: s.services.filter((sv) => sv.id !== id) })),
      addService: (data) =>
        set((s) => ({ services: [...s.services, { ...data, id: uid() }] })),

      // ── Pages ──
      updatePage: (id, patch) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === id ? { ...p, ...patch, lastEdited: new Date().toISOString() } : p,
          ),
        })),

      // ── Integrations ──
      updateIntegration: (id, patch) =>
        set((s) => ({
          integrations: s.integrations.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),

      // ── Automation ──
      updateAutomationRule: (id, patch) =>
        set((s) => ({
          automationRules: s.automationRules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      addAutomationRule: (data) =>
        set((s) => ({
          automationRules: [
            ...s.automationRules,
            { ...data, id: uid(), runs: 0, lastRun: 'Never' },
          ],
        })),
      deleteAutomationRule: (id) =>
        set((s) => ({ automationRules: s.automationRules.filter((r) => r.id !== id) })),
    }),
    {
      name: 'umratransport-admin-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

// ─── Hydration helper — seed mock data into an empty store ──────────────────
// Call once in the admin layout to populate data on first visit.

export function seedAdminStore() {
  const { bookings, drivers, vehicles, vendors, users, reviews } = useAdminStore.getState()
  if (bookings.length > 0) return   // already seeded

  // Lazy import to keep store tree-shakeable
  import('./mock-data').then(
    ({ MOCK_BOOKINGS, MOCK_DRIVERS, MOCK_VEHICLES, MOCK_VENDORS, MOCK_USERS, MOCK_REVIEWS }) => {
      useAdminStore.setState({ bookings: MOCK_BOOKINGS, drivers: MOCK_DRIVERS, vehicles: MOCK_VEHICLES, vendors: MOCK_VENDORS, users: MOCK_USERS, reviews: MOCK_REVIEWS })
    },
  )
}
