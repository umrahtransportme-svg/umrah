import type { VehicleType } from '@/types'

// ─── Capacity definitions ─────────────────────────────────────────────────────

export const VEHICLE_CAPACITY: Record<
  VehicleType,
  { passengers: number; luggage: number; label: string; example: string }
> = {
  sedan:        { passengers: 3,  luggage: 3,  label: 'Sedan',       example: 'Toyota Corolla / Hyundai Sonata'   },
  suv:          { passengers: 6,  luggage: 6,  label: 'SUV / MPV',   example: 'Hyundai Staria / H1'               },
  'luxury-suv': { passengers: 6,  luggage: 6,  label: 'Luxury SUV',  example: 'GMC Yukon / Land Cruiser'          },
  hiace:        { passengers: 12, luggage: 10, label: 'Hiace',       example: 'Toyota Hiace High Roof'            },
  coaster:      { passengers: 16, luggage: 14, label: 'Coaster Bus', example: 'Toyota Coaster EX'                },
}

// Vehicle order from smallest to largest (used for auto-recommendation)
const RECOMMENDATION_ORDER: VehicleType[] = ['sedan', 'suv', 'hiace', 'coaster']

// ─── Public helpers ───────────────────────────────────────────────────────────

export function recommendVehicle(passengers: number, luggage: number): VehicleType {
  for (const v of RECOMMENDATION_ORDER) {
    const cap = VEHICLE_CAPACITY[v]
    if (passengers <= cap.passengers && luggage <= cap.luggage) return v
  }
  return 'coaster'
}

export function isVehicleValid(
  vehicleType: VehicleType,
  passengers: number,
  luggage: number,
): boolean {
  const cap = VEHICLE_CAPACITY[vehicleType]
  return passengers <= cap.passengers && luggage <= cap.luggage
}

export function getCapacityMessage(
  vehicleType: VehicleType,
  passengers: number,
  luggage: number,
): string | null {
  const cap = VEHICLE_CAPACITY[vehicleType]
  const paxOver = passengers > cap.passengers
  const bagOver = luggage  > cap.luggage

  if (paxOver && bagOver) {
    return `${cap.label} holds max ${cap.passengers} passengers & ${cap.luggage} bags`
  }
  if (paxOver) return `${cap.label} holds max ${cap.passengers} passengers`
  if (bagOver) return `${cap.label} holds max ${cap.luggage} bags`
  return null
}
