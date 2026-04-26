import type { UserProfile, SavedBooking } from '@/types'

function profileKey(email: string) {
  return `ut_profile_${email}`
}
function bookingsKey(email: string) {
  return `ut_bookings_${email}`
}

export function getProfile(email: string): UserProfile {
  try {
    const raw = localStorage.getItem(profileKey(email))
    return raw ? (JSON.parse(raw) as UserProfile) : {}
  } catch {
    return {}
  }
}

export function saveProfile(email: string, data: UserProfile): void {
  try {
    const existing = getProfile(email)
    localStorage.setItem(profileKey(email), JSON.stringify({ ...existing, ...data }))
  } catch { /* noop */ }
}

export function getBookings(email: string): SavedBooking[] {
  try {
    const raw = localStorage.getItem(bookingsKey(email))
    return raw ? (JSON.parse(raw) as SavedBooking[]) : []
  } catch {
    return []
  }
}

export function saveBooking(email: string, booking: SavedBooking): void {
  try {
    const existing = getBookings(email)
    const alreadySaved = existing.some((b) => b.bookingRef === booking.bookingRef)
    if (!alreadySaved) {
      localStorage.setItem(bookingsKey(email), JSON.stringify([booking, ...existing]))
    }
  } catch { /* noop */ }
}
