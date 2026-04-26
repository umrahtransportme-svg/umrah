export type UserRole = 'super_admin' | 'admin' | 'vendor' | 'staff'

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'unpaid' | 'paid' | 'partial' | 'refunded'

export type VehicleType = 'sedan' | 'suv' | 'minivan'

export type ServiceType =
  | 'airport_transfer'
  | 'intercity_transfer'
  | 'ziyarat_tour'
  | 'umrah_with_qari'
  | 'elderly_assistance'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  lastLogin?: string
  createdAt: string
  isActive: boolean
}

export interface Booking {
  id: string
  reference: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCountry: string
  serviceType: ServiceType
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  pickupTime: string
  passengers: number
  vehicleType: VehicleType
  specialRequests?: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  currency: string
  driverId?: string
  vehicleId?: string
  vendorId?: string
  assignedBy?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  whatsapp?: string
  licenseNumber: string
  licenseExpiry: string
  nationality: string
  languages: string[]
  vehicleId?: string
  vendorId?: string
  rating: number
  totalTrips: number
  status: 'available' | 'on_trip' | 'off_duty' | 'suspended'
  isActive: boolean
  avatar?: string
  createdAt: string
}

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  type: VehicleType
  capacity: number
  plateNumber: string
  color: string
  driverId?: string
  vendorId?: string
  status: 'available' | 'in_use' | 'maintenance' | 'retired'
  insuranceExpiry: string
  lastService: string
  mileage: number
  isActive: boolean
  createdAt: string
}

export interface Vendor {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  city: string
  country: string
  vehicles: number
  drivers: number
  rating: number
  commissionRate: number
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
}

export interface Payment {
  id: string
  bookingId: string
  bookingReference: string
  customerName: string
  amount: number
  currency: string
  method: 'bank_transfer' | 'card' | 'cash' | 'stripe'
  status: PaymentStatus
  stripePaymentId?: string
  notes?: string
  createdAt: string
}

export interface Review {
  id: string
  bookingId: string
  bookingReference: string
  customerName: string
  customerCountry: string
  serviceType: ServiceType
  rating: number
  title: string
  body: string
  driverRating?: number
  vehicleRating?: number
  reply?: string
  repliedAt?: string
  isPublished: boolean
  createdAt: string
}

export interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  activeDrivers: number
  pendingBookings: number
  bookingsChange: number
  revenueChange: number
  driversChange: number
  pendingChange: number
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  bookings: number
}

export interface ServiceBreakdown {
  name: string
  value: number
  color: string
}

export interface ActivityItem {
  id: string
  type: 'booking' | 'payment' | 'driver' | 'review' | 'system'
  title: string
  description: string
  time: string
  icon?: string
}
