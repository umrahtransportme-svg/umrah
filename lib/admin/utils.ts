import type { BookingStatus, PaymentStatus, ServiceType, VehicleType, UserRole } from './types'

export function formatCurrency(amount: number, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function generateReference() {
  return `BK-${Date.now().toString(36).toUpperCase()}`
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  airport_transfer: 'Airport Transfer',
  intercity_transfer: 'Intercity Transfer',
  ziyarat_tour: 'Ziyarat Tour',
  umrah_with_qari: 'Umrah with Qari',
  elderly_assistance: 'Elderly Assistance',
}

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  minivan: 'Minivan',
}

export const STATUS_COLORS: Record<BookingStatus, { bg: string; text: string; dot: string }> = {
  pending:     { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500' },
  confirmed:   { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  in_progress: { bg: 'bg-purple-50',  text: 'text-purple-700', dot: 'bg-purple-500' },
  completed:   { bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
  cancelled:   { bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
  refunded:    { bg: 'bg-slate-50',   text: 'text-slate-700',  dot: 'bg-slate-400' },
}

export const PAYMENT_COLORS: Record<PaymentStatus, { bg: string; text: string }> = {
  unpaid:   { bg: 'bg-red-50',    text: 'text-red-700' },
  paid:     { bg: 'bg-green-50',  text: 'text-green-700' },
  partial:  { bg: 'bg-amber-50',  text: 'text-amber-700' },
  refunded: { bg: 'bg-slate-50',  text: 'text-slate-700' },
}

export const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  super_admin: { bg: 'bg-purple-50', text: 'text-purple-700' },
  admin:       { bg: 'bg-blue-50',   text: 'text-blue-700' },
  vendor:      { bg: 'bg-amber-50',  text: 'text-amber-700' },
  staff:       { bg: 'bg-green-50',  text: 'text-green-700' },
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  vendor: 'Vendor',
  staff: 'Staff',
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const start = (page - 1) * perPage
  return {
    data: items.slice(start, start + perPage),
    total: items.length,
    totalPages: Math.ceil(items.length / perPage),
    page,
    perPage,
  }
}
