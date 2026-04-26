import type { VehicleType } from '@/types'
import { PRICING } from './config'

export interface FleetVehicle {
  id: string
  make: string
  model: string
  image: string          // path under /fleet/
  capacity: number
  luggage: number        // bags
  ac: boolean
  features: string[]
  tag?: string           // e.g. "Most Popular"
}

export interface FleetCategory {
  vehicleType: VehicleType
  label: string
  capacity: string
  description: string
  accentColor: string    // tailwind bg class for the photo placeholder
  airportPrice: number
  intercityPrice: number
  vehicles: FleetVehicle[]
}

export const FLEET_CATEGORIES: FleetCategory[] = [
  {
    vehicleType: 'sedan',
    label: 'Sedan',
    capacity: '1 – 3 Passengers',
    description: 'Comfortable and fuel-efficient saloon cars — ideal for solo travellers, couples or small families who travel light.',
    accentColor: 'from-blue-600 to-blue-800',
    airportPrice: PRICING.airportTransfer.sedan,
    intercityPrice: PRICING.intercityTransfer.sedan,
    vehicles: [
      {
        id: 'corolla',
        make: 'Toyota',
        model: 'Corolla',
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Toyota_Corolla_Sedan.jpg',
        capacity: 3,
        luggage: 3,
        ac: true,
        tag: 'Most Popular',
        features: ['Leather seats', 'USB charging', 'Spacious boot', 'Excellent fuel economy'],
      },
      {
        id: 'sonata',
        make: 'Hyundai',
        model: 'Sonata',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/2020_Hyundai_Sonata_SEL_%28Quartz_White%29%2C_rear_right.jpg',
        capacity: 3,
        luggage: 3,
        ac: true,
        features: ['Premium interior', 'Wireless charging', 'Apple CarPlay', 'Extra legroom'],
      },
    ],
  },
  {
    vehicleType: 'suv',
    label: 'MPV / SUV',
    capacity: '4 – 6 Passengers',
    description: 'Spacious multi-purpose vehicles with easy sliding-door access — perfect for families, elderly passengers or groups with extra luggage.',
    accentColor: 'from-violet-600 to-violet-800',
    airportPrice: PRICING.airportTransfer.suv,
    intercityPrice: PRICING.intercityTransfer.suv,
    vehicles: [
      {
        id: 'staria',
        make: 'Hyundai',
        model: 'Staria',
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/2021_Hyundai_Staria_S.jpg',
        capacity: 6,
        luggage: 6,
        ac: true,
        tag: 'Best for Families',
        features: ['Sliding rear doors', 'Captain seats', 'Panoramic roof', 'Privacy glass'],
      },
      {
        id: 'h1',
        make: 'Hyundai',
        model: 'H1 Grand Starex',
        image: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Hyundai_Grand_Starex_VIP_rear.jpg',
        capacity: 8,
        luggage: 8,
        ac: true,
        features: ['8 seats', 'Rear A/C', 'Large cargo area', 'Smooth highway ride'],
      },
    ],
  },
  {
    vehicleType: 'luxury-suv',
    label: 'Luxury SUV',
    capacity: '4 – 6 Passengers',
    description: 'Premium full-size SUVs offering executive-class comfort, advanced technology and commanding road presence for a first-class experience.',
    accentColor: 'from-amber-600 to-yellow-700',
    airportPrice: PRICING.airportTransfer['luxury-suv'],
    intercityPrice: PRICING.intercityTransfer['luxury-suv'],
    vehicles: [
      {
        id: 'gmc',
        make: 'GMC',
        model: 'Yukon / Suburban',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/29/01-06_GMC_Yukon_XL_Denali.jpg',
        capacity: 6,
        luggage: 8,
        ac: true,
        tag: 'Premium',
        features: ['Heated/ventilated seats', 'Tri-zone climate control', 'Bose sound system', '360° cameras'],
      },
      {
        id: 'landcruiser',
        make: 'Toyota',
        model: 'Land Cruiser 300',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/59/2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_02.png',
        capacity: 6,
        luggage: 8,
        ac: true,
        tag: 'VIP',
        features: ['Iconic 4x4', 'Multi-terrain select', 'Ventilated massage seats', 'Head-up display'],
      },
    ],
  },
  {
    vehicleType: 'hiace',
    label: 'Hiace Van',
    capacity: '7 – 10 Passengers',
    description: 'Toyota\'s legendary high-roof van — the backbone of group transfers in Makkah and Madinah for decades. Spacious, reliable and practical.',
    accentColor: 'from-emerald-600 to-emerald-800',
    airportPrice: PRICING.airportTransfer.hiace,
    intercityPrice: PRICING.intercityTransfer.hiace,
    vehicles: [
      {
        id: 'hiace-standard',
        make: 'Toyota',
        model: 'Hiace High Roof',
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/1989_Toyota_HiAce_9-seater_minibus_%28LH51%29%2C_rear_right.jpg',
        capacity: 10,
        luggage: 10,
        ac: true,
        tag: 'Group Favourite',
        features: ['High roof — full standing height', 'Individual reading lights', 'Dual rear A/C units', 'Overhead luggage racks'],
      },
      {
        id: 'hiace-gl',
        make: 'Toyota',
        model: 'Hiace GL Commuter',
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/1989_Toyota_HiAce_9-seater_minibus_%28LH51%29%2C_rear_right.jpg',
        capacity: 13,
        luggage: 10,
        ac: true,
        features: ['13 passenger seats', 'USB power at every row', 'Curtained windows', 'Extra-wide sliding door'],
      },
    ],
  },
  {
    vehicleType: 'coaster',
    label: 'Coaster Bus',
    capacity: '11 – 16 Passengers',
    description: 'Toyota\'s iconic mini-coach — purpose-built for large pilgrim groups, tour groups and Ziyarat trips requiring professional-grade transport.',
    accentColor: 'from-rose-600 to-rose-800',
    airportPrice: PRICING.airportTransfer.coaster,
    intercityPrice: PRICING.intercityTransfer.coaster,
    vehicles: [
      {
        id: 'coaster-standard',
        make: 'Toyota',
        model: 'Coaster EX',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Toyota_Coaster_GX_XZB70_rear.jpg',
        capacity: 16,
        luggage: 16,
        ac: true,
        tag: 'Large Groups',
        features: ['Reclining seats', 'Central A/C system', 'Under-floor luggage bay', 'PA / microphone system'],
      },
      {
        id: 'coaster-luxury',
        make: 'Toyota',
        model: 'Coaster Luxury',
        image: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Toyota_Coaster_GX_XZB70_rear.jpg',
        capacity: 14,
        luggage: 14,
        ac: true,
        features: ['14 VIP seats', 'Fridge & refreshments', 'Individual screens', 'Wide centre aisle'],
      },
    ],
  },
]
