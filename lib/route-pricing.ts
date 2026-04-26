import type { VehicleType } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// All prices GBP, sourced from the official pricing schedule.
// Rows with no exact data use proportional estimates (marked ≈).
// ─────────────────────────────────────────────────────────────────────────────

type Prices = Record<VehicleType, number>

function p(sedan: number, suv: number, lux: number, hiace: number, coaster: number): Prices {
  return { sedan, suv, 'luxury-suv': lux, hiace, coaster }
}

// ─── Route matrix ─────────────────────────────────────────────────────────────
// Key format: `${pickupKey}:${dropoffKey}`
const ROUTE_MATRIX: Record<string, Prices> = {

  // ── Airport → Hotel ──────────────────────────────────────────────────────
  'jeddah-airport:makkah-hotel':   p( 45.92,  76.53, 107.14,  91.84, 122.45),
  'jeddah-airport:madinah-hotel':  p(137.76, 153.06, 214.28, 183.67, 244.90),
  'jeddah-airport:jeddah-hotel':   p( 25.00,  40.00,  56.00,  50.00,  70.00), // ≈

  'madinah-airport:madinah-hotel': p( 30.61,  45.92,  64.29,  61.22,  91.84),
  'madinah-airport:makkah-hotel':  p(137.76, 153.06, 214.28, 183.67, 244.90),
  'madinah-airport:jeddah-hotel':  p(120.00, 140.00, 196.00, 165.00, 220.00), // ≈

  // ── Hotel → Airport ──────────────────────────────────────────────────────
  'makkah-hotel:jeddah-airport':   p( 45.92,  76.53, 107.14,  91.84, 122.45),
  'makkah-hotel:madinah-airport':  p(137.76, 153.06, 214.28, 183.67, 244.90),

  'madinah-hotel:madinah-airport': p( 30.61,  45.92,  64.29,  61.22,  91.84),
  'madinah-hotel:jeddah-airport':  p(137.76, 153.06, 214.28, 183.67, 244.90),

  'jeddah-hotel:jeddah-airport':   p( 25.00,  40.00,  56.00,  50.00,  70.00), // ≈
  'jeddah-hotel:madinah-airport':  p(120.00, 140.00, 196.00, 165.00, 220.00), // ≈

  // ── Intercity transfers ───────────────────────────────────────────────────
  'makkah:madinah':  p(107.14, 153.06, 214.28, 183.67, 244.90),
  'madinah:makkah':  p(107.14, 153.06, 214.28, 183.67, 244.90),
  'makkah:jeddah':   p( 55.00,  85.00, 119.00, 100.00, 135.00), // ≈
  'jeddah:makkah':   p( 55.00,  85.00, 119.00, 100.00, 135.00), // ≈
  'madinah:jeddah':  p(130.00, 160.00, 224.00, 190.00, 255.00), // ≈
  'jeddah:madinah':  p(130.00, 160.00, 224.00, 190.00, 255.00), // ≈

  // ── Ziyarat tours ────────────────────────────────────────────────────────
  'makkah-ziyarat:return-to-hotel':  p( 61.22,  76.53, 107.14,  91.84, 122.45),
  'madinah-ziyarat:return-to-hotel': p( 61.22,  76.53, 107.14,  91.84, 122.45),
  'bader-ziyarat:return-to-hotel':   p( 91.84, 107.14, 150.00, 137.76, 183.67),
}

// ─── Location normaliser ─────────────────────────────────────────────────────
const LOCATION_MAP: Record<string, string> = {
  'jeddah airport (jed)':    'jeddah-airport',
  'madinah airport (med)':   'madinah-airport',
  'hotel in makkah':         'makkah-hotel',
  'hotel in madinah':        'madinah-hotel',
  'hotel in jeddah':         'jeddah-hotel',
  'makkah':                  'makkah',
  'madinah':                 'madinah',
  'jeddah':                  'jeddah',
  'makkah (hotel)':          'makkah-hotel',
  'madinah (hotel)':         'madinah-hotel',
  'makkah ziyarat':          'makkah-ziyarat',
  'madinah ziyarat':         'madinah-ziyarat',
  'bader ziyarat':           'bader-ziyarat',
  'return to hotel':         'return-to-hotel',
  'other (specify below)':   'other',
}

export function normaliseLocation(raw: string): string {
  const key = raw.trim().toLowerCase()
  return LOCATION_MAP[key] ?? key.replace(/\s+/g, '-')
}

// ─── Public lookup ────────────────────────────────────────────────────────────
export function getRoutePrice(
  pickup: string,
  dropoff: string,
  vehicle: VehicleType,
): number | null {
  if (!pickup || !dropoff) return null
  const key = `${normaliseLocation(pickup)}:${normaliseLocation(dropoff)}`
  const route = ROUTE_MATRIX[key]
  return route ? route[vehicle] : null
}
