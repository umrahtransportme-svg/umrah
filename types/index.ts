export type ServiceType =
  | 'airport-transfer'
  | 'intercity-transfer'
  | 'ziyarat-tour'
  | 'umrah-with-qari'
  | 'elderly-assistance'

export interface CartItem {
  cartId: string
  serviceType: ServiceType
  serviceLabel: string
  pickupLocation: string
  dropoffLocation: string
  travelDate: string
  travelTime: string
  passengers: number
  luggage: number
  vehicleType: VehicleType
  price: number
  hours?: number          // elderly-assistance only
  specialRequests?: string
}

export type VehicleType =
  | 'sedan'       // 1–3 passengers  — Toyota Corolla, Hyundai Sonata
  | 'suv'         // 4–6 passengers  — Hyundai Staria, Hyundai H1
  | 'luxury-suv'  // 4–6 passengers  — GMC Yukon, Toyota Land Cruiser
  | 'hiace'       // 7–10 passengers — Toyota Hiace
  | 'coaster'     // 11–16 passengers — Toyota Coaster

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface BookingFormData {
  serviceType: ServiceType
  pickupLocation: string
  dropoffLocation: string
  travelDate: string
  travelTime: string
  passengers: number
  vehicleType: VehicleType
  fullName: string
  whatsappNumber: string
  country: string
  email: string
  specialRequests?: string
}

export interface Booking extends BookingFormData {
  id: string
  bookingRef: string
  status: BookingStatus
  createdAt: string
  estimatedPrice: number
}

export interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  review: string
  service: string
  date: string
  initials: string
}

export interface Service {
  id: ServiceType
  title: string
  description: string
  icon: string
  price: string
  features: string[]
  href: string
}

export interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export interface UserProfile {
  phone?: string
  country?: string
}

export interface SavedBooking {
  bookingRef: string
  services: string[]
  total: number
  bookedAt: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  customerName: string
  itemCount: number
}
