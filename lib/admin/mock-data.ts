import type {
  Booking, Driver, Vehicle, Vendor, Payment, Review,
  DashboardStats, RevenueDataPoint, ServiceBreakdown, ActivityItem, AdminUser,
} from './types'

export const MOCK_USERS: AdminUser[] = [
  { id: 'u1', name: 'Ahmed Al-Rashid', email: 'admin@umratransport.me', role: 'super_admin', phone: '+44 7700 111111', lastLogin: '2025-04-25T08:30:00Z', createdAt: '2024-01-01T00:00:00Z', isActive: true },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah@umratransport.me', role: 'admin', phone: '+44 7700 222222', lastLogin: '2025-04-24T14:00:00Z', createdAt: '2024-03-15T00:00:00Z', isActive: true },
  { id: 'u3', name: 'Khalid Vendor', email: 'khalid@makkahcabs.com', role: 'vendor', phone: '+966 50 333 3333', lastLogin: '2025-04-23T10:00:00Z', createdAt: '2024-06-01T00:00:00Z', isActive: true },
  { id: 'u4', name: 'Omar Staff', email: 'omar@umratransport.me', role: 'staff', phone: '+44 7700 444444', lastLogin: '2025-04-20T09:00:00Z', createdAt: '2024-09-01T00:00:00Z', isActive: false },
]

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', companyName: 'Makkah Cabs', contactName: 'Khalid Al-Fahad', email: 'khalid@makkahcabs.com', phone: '+966 50 111 1111', city: 'Makkah', country: 'Saudi Arabia', vehicles: 8, drivers: 10, rating: 4.8, commissionRate: 15, status: 'active', createdAt: '2024-01-15T00:00:00Z' },
  { id: 'v2', companyName: 'Madinah Transport', contactName: 'Ibrahim Hassan', email: 'ibrahim@madinahtransport.sa', phone: '+966 50 222 2222', city: 'Madinah', country: 'Saudi Arabia', vehicles: 6, drivers: 7, rating: 4.7, commissionRate: 15, status: 'active', createdAt: '2024-02-01T00:00:00Z' },
  { id: 'v3', companyName: 'Jeddah Airport Transfers', contactName: 'Mohammed Bakr', email: 'mo@jedtransfers.sa', phone: '+966 50 333 3333', city: 'Jeddah', country: 'Saudi Arabia', vehicles: 12, drivers: 14, rating: 4.6, commissionRate: 12, status: 'active', createdAt: '2024-03-01T00:00:00Z' },
  { id: 'v4', companyName: 'Al-Noor Rides', contactName: 'Faisal Noor', email: 'faisal@alnoor.sa', phone: '+966 50 444 4444', city: 'Makkah', country: 'Saudi Arabia', vehicles: 4, drivers: 5, rating: 4.5, commissionRate: 18, status: 'inactive', createdAt: '2024-04-01T00:00:00Z' },
]

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'vh1', make: 'Toyota', model: 'Camry', year: 2023, type: 'sedan', capacity: 3, plateNumber: 'ABC-1234', color: 'White', driverId: 'd1', vendorId: 'v1', status: 'in_use', insuranceExpiry: '2026-01-01', lastService: '2025-01-15', mileage: 45200, isActive: true, createdAt: '2024-01-20T00:00:00Z' },
  { id: 'vh2', make: 'Toyota', model: 'Land Cruiser', year: 2022, type: 'suv', capacity: 6, plateNumber: 'DEF-5678', color: 'Black', driverId: 'd2', vendorId: 'v1', status: 'available', insuranceExpiry: '2026-03-01', lastService: '2025-02-10', mileage: 62100, isActive: true, createdAt: '2024-01-25T00:00:00Z' },
  { id: 'vh3', make: 'Toyota', model: 'HiAce', year: 2023, type: 'minivan', capacity: 12, plateNumber: 'GHI-9012', color: 'White', driverId: 'd3', vendorId: 'v2', status: 'available', insuranceExpiry: '2025-12-01', lastService: '2025-03-05', mileage: 38900, isActive: true, createdAt: '2024-02-10T00:00:00Z' },
  { id: 'vh4', make: 'Toyota', model: 'Camry', year: 2021, type: 'sedan', capacity: 3, plateNumber: 'JKL-3456', color: 'Silver', vendorId: 'v3', status: 'maintenance', insuranceExpiry: '2025-09-01', lastService: '2024-12-20', mileage: 81500, isActive: true, createdAt: '2024-03-15T00:00:00Z' },
  { id: 'vh5', make: 'Toyota', model: 'Land Cruiser', year: 2024, type: 'suv', capacity: 6, plateNumber: 'MNO-7890', color: 'White', driverId: 'd4', vendorId: 'v3', status: 'available', insuranceExpiry: '2027-02-01', lastService: '2025-04-01', mileage: 12300, isActive: true, createdAt: '2024-04-20T00:00:00Z' },
]

export const MOCK_DRIVERS: Driver[] = [
  { id: 'd1', name: 'Yusuf Al-Amri', email: 'yusuf@driver.sa', phone: '+966 55 111 1111', whatsapp: '+966 55 111 1111', licenseNumber: 'SA-DL-001234', licenseExpiry: '2027-05-01', nationality: 'Saudi', languages: ['Arabic', 'English'], vehicleId: 'vh1', vendorId: 'v1', rating: 4.9, totalTrips: 312, status: 'on_trip', isActive: true, createdAt: '2024-01-20T00:00:00Z' },
  { id: 'd2', name: 'Hassan Malik', email: 'hassan@driver.sa', phone: '+966 55 222 2222', licenseNumber: 'SA-DL-002345', licenseExpiry: '2026-08-01', nationality: 'Pakistani', languages: ['Urdu', 'Arabic', 'English'], vehicleId: 'vh2', vendorId: 'v1', rating: 4.8, totalTrips: 245, status: 'available', isActive: true, createdAt: '2024-02-01T00:00:00Z' },
  { id: 'd3', name: 'Bilal Khan', email: 'bilal@driver.sa', phone: '+966 55 333 3333', licenseNumber: 'SA-DL-003456', licenseExpiry: '2026-11-01', nationality: 'Pakistani', languages: ['Urdu', 'English'], vehicleId: 'vh3', vendorId: 'v2', rating: 4.7, totalTrips: 189, status: 'available', isActive: true, createdAt: '2024-02-15T00:00:00Z' },
  { id: 'd4', name: 'Ahmed Qureshi', email: 'ahmed@driver.sa', phone: '+966 55 444 4444', licenseNumber: 'SA-DL-004567', licenseExpiry: '2025-12-01', nationality: 'Pakistani', languages: ['Urdu', 'Arabic'], vehicleId: 'vh5', vendorId: 'v3', rating: 4.6, totalTrips: 134, status: 'off_duty', isActive: true, createdAt: '2024-03-01T00:00:00Z' },
  { id: 'd5', name: 'Omar Ibrahim', email: 'omar@driver.sa', phone: '+966 55 555 5555', licenseNumber: 'SA-DL-005678', licenseExpiry: '2026-04-01', nationality: 'Egyptian', languages: ['Arabic', 'English'], rating: 4.5, totalTrips: 78, status: 'suspended', isActive: false, createdAt: '2024-04-10T00:00:00Z' },
]

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', reference: 'BK-M5A2X8', customerName: 'Mohammed Riaz', customerEmail: 'mo.riaz@email.com', customerPhone: '+44 7911 000001', customerCountry: 'United Kingdom', serviceType: 'airport_transfer', pickupLocation: 'Jeddah Airport (JED)', dropoffLocation: 'Makkah - Al Aziziyah', pickupDate: '2025-04-26', pickupTime: '14:00', passengers: 4, vehicleType: 'suv', status: 'confirmed', paymentStatus: 'paid', totalAmount: 65, currency: 'GBP', driverId: 'd2', vehicleId: 'vh2', vendorId: 'v1', createdAt: '2025-04-20T10:00:00Z', updatedAt: '2025-04-20T10:30:00Z' },
  { id: 'b2', reference: 'BK-N7B3Y9', customerName: 'Fatima Al-Sayed', customerEmail: 'fatima@email.com', customerPhone: '+1 212 555 0101', customerCountry: 'United States', serviceType: 'intercity_transfer', pickupLocation: 'Makkah - Haram', dropoffLocation: 'Madinah - Haram', pickupDate: '2025-04-27', pickupTime: '08:00', passengers: 6, vehicleType: 'minivan', status: 'pending', paymentStatus: 'unpaid', totalAmount: 145, currency: 'GBP', createdAt: '2025-04-21T14:00:00Z', updatedAt: '2025-04-21T14:00:00Z' },
  { id: 'b3', reference: 'BK-P8C4Z0', customerName: 'Aisha Patel', customerEmail: 'aisha.p@email.com', customerPhone: '+61 400 000 001', customerCountry: 'Australia', serviceType: 'ziyarat_tour', pickupLocation: 'Makkah Hotel', dropoffLocation: 'Makkah Hotel', pickupDate: '2025-04-28', pickupTime: '09:00', passengers: 3, vehicleType: 'sedan', status: 'confirmed', paymentStatus: 'paid', totalAmount: 75, currency: 'GBP', driverId: 'd1', vehicleId: 'vh1', vendorId: 'v1', createdAt: '2025-04-22T09:00:00Z', updatedAt: '2025-04-22T09:45:00Z' },
  { id: 'b4', reference: 'BK-Q9D5A1', customerName: 'Tariq Mahmood', customerEmail: 'tariq@email.com', customerPhone: '+1 416 555 0102', customerCountry: 'Canada', serviceType: 'umrah_with_qari', pickupLocation: 'Makkah Hotel', dropoffLocation: 'Masjid al-Haram', pickupDate: '2025-04-25', pickupTime: '22:00', passengers: 2, vehicleType: 'sedan', status: 'in_progress', paymentStatus: 'paid', totalAmount: 180, currency: 'GBP', driverId: 'd1', vehicleId: 'vh1', vendorId: 'v1', createdAt: '2025-04-23T11:00:00Z', updatedAt: '2025-04-25T21:50:00Z' },
  { id: 'b5', reference: 'BK-R0E6B2', customerName: 'Zainab Hussein', customerEmail: 'zainab@email.com', customerPhone: '+44 7911 000005', customerCountry: 'United Kingdom', serviceType: 'elderly_assistance', pickupLocation: 'Makkah Hotel', dropoffLocation: 'Masjid al-Haram', pickupDate: '2025-04-29', pickupTime: '10:00', passengers: 1, vehicleType: 'sedan', status: 'confirmed', paymentStatus: 'partial', totalAmount: 150, currency: 'GBP', vendorId: 'v2', createdAt: '2025-04-23T15:00:00Z', updatedAt: '2025-04-23T15:30:00Z' },
  { id: 'b6', reference: 'BK-S1F7C3', customerName: 'Ibrahim Ali', customerEmail: 'ibrahim.ali@email.com', customerPhone: '+44 7911 000006', customerCountry: 'United Kingdom', serviceType: 'airport_transfer', pickupLocation: 'Madinah Airport (MED)', dropoffLocation: 'Madinah - Haram District', pickupDate: '2025-04-24', pickupTime: '18:30', passengers: 5, vehicleType: 'suv', status: 'completed', paymentStatus: 'paid', totalAmount: 65, currency: 'GBP', driverId: 'd3', vehicleId: 'vh3', vendorId: 'v2', createdAt: '2025-04-18T12:00:00Z', updatedAt: '2025-04-24T19:30:00Z' },
  { id: 'b7', reference: 'BK-T2G8D4', customerName: 'Nadia Rahman', customerEmail: 'nadia@email.com', customerPhone: '+1 647 555 0103', customerCountry: 'Canada', serviceType: 'intercity_transfer', pickupLocation: 'Madinah - Haram', dropoffLocation: 'Makkah - Haram', pickupDate: '2025-04-23', pickupTime: '06:00', passengers: 2, vehicleType: 'sedan', status: 'completed', paymentStatus: 'paid', totalAmount: 85, currency: 'GBP', driverId: 'd4', vehicleId: 'vh5', vendorId: 'v3', createdAt: '2025-04-17T10:00:00Z', updatedAt: '2025-04-23T11:30:00Z' },
  { id: 'b8', reference: 'BK-U3H9E5', customerName: 'Khalid Ansari', customerEmail: 'khalid.a@email.com', customerPhone: '+44 7911 000008', customerCountry: 'United Kingdom', serviceType: 'airport_transfer', pickupLocation: 'Jeddah Airport (JED)', dropoffLocation: 'Makkah - Al Aziziyah', pickupDate: '2025-04-22', pickupTime: '22:00', passengers: 8, vehicleType: 'minivan', status: 'completed', paymentStatus: 'paid', totalAmount: 85, currency: 'GBP', driverId: 'd3', vehicleId: 'vh3', vendorId: 'v2', createdAt: '2025-04-16T08:00:00Z', updatedAt: '2025-04-22T23:30:00Z' },
  { id: 'b9', reference: 'BK-V4I0F6', customerName: 'Sara Hussain', customerEmail: 'sara.h@email.com', customerPhone: '+61 400 000 009', customerCountry: 'Australia', serviceType: 'ziyarat_tour', pickupLocation: 'Madinah Hotel', dropoffLocation: 'Madinah Hotel', pickupDate: '2025-04-21', pickupTime: '08:00', passengers: 4, vehicleType: 'suv', status: 'cancelled', paymentStatus: 'refunded', totalAmount: 120, currency: 'GBP', createdAt: '2025-04-15T14:00:00Z', updatedAt: '2025-04-19T10:00:00Z' },
  { id: 'b10', reference: 'BK-W5J1G7', customerName: 'Abdul Karim', customerEmail: 'abdul.k@email.com', customerPhone: '+44 7911 000010', customerCountry: 'United Kingdom', serviceType: 'airport_transfer', pickupLocation: 'Makkah Hotel', dropoffLocation: 'Jeddah Airport (JED)', pickupDate: '2025-04-30', pickupTime: '06:00', passengers: 3, vehicleType: 'sedan', status: 'confirmed', paymentStatus: 'unpaid', totalAmount: 45, currency: 'GBP', createdAt: '2025-04-24T16:00:00Z', updatedAt: '2025-04-24T16:00:00Z' },
]

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', bookingId: 'b1', bookingReference: 'BK-M5A2X8', customerName: 'Mohammed Riaz', amount: 65, currency: 'GBP', method: 'bank_transfer', status: 'paid', createdAt: '2025-04-20T10:30:00Z' },
  { id: 'p2', bookingId: 'b3', bookingReference: 'BK-P8C4Z0', customerName: 'Aisha Patel', amount: 75, currency: 'GBP', method: 'card', status: 'paid', createdAt: '2025-04-22T09:45:00Z' },
  { id: 'p3', bookingId: 'b4', bookingReference: 'BK-Q9D5A1', customerName: 'Tariq Mahmood', amount: 180, currency: 'GBP', method: 'stripe', status: 'paid', stripePaymentId: 'pi_3OhfG82eZvKYlo2C1234abcd', createdAt: '2025-04-23T11:30:00Z' },
  { id: 'p4', bookingId: 'b5', bookingReference: 'BK-R0E6B2', customerName: 'Zainab Hussein', amount: 75, currency: 'GBP', method: 'cash', status: 'paid', notes: 'Partial cash payment, £75 of £150', createdAt: '2025-04-23T16:00:00Z' },
  { id: 'p5', bookingId: 'b6', bookingReference: 'BK-S1F7C3', customerName: 'Ibrahim Ali', amount: 65, currency: 'GBP', method: 'bank_transfer', status: 'paid', createdAt: '2025-04-18T13:00:00Z' },
  { id: 'p6', bookingId: 'b7', bookingReference: 'BK-T2G8D4', customerName: 'Nadia Rahman', amount: 85, currency: 'GBP', method: 'card', status: 'paid', createdAt: '2025-04-17T11:00:00Z' },
  { id: 'p7', bookingId: 'b8', bookingReference: 'BK-U3H9E5', customerName: 'Khalid Ansari', amount: 85, currency: 'GBP', method: 'bank_transfer', status: 'paid', createdAt: '2025-04-16T09:00:00Z' },
  { id: 'p8', bookingId: 'b9', bookingReference: 'BK-V4I0F6', customerName: 'Sara Hussain', amount: 120, currency: 'GBP', method: 'card', status: 'refunded', notes: 'Cancelled by customer', createdAt: '2025-04-15T15:00:00Z' },
]

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', bookingId: 'b6', bookingReference: 'BK-S1F7C3', customerName: 'Ibrahim Ali', customerCountry: 'United Kingdom', serviceType: 'airport_transfer', rating: 5, title: 'Excellent service, highly recommended!', body: "Driver was waiting at arrivals with name board. Vehicle was immaculate. Journey was smooth and on time. Will definitely use again for our next Umrah trip.", driverRating: 5, vehicleRating: 5, isPublished: true, createdAt: '2025-04-24T21:00:00Z' },
  { id: 'r2', bookingId: 'b7', bookingReference: 'BK-T2G8D4', customerName: 'Nadia Rahman', customerCountry: 'Canada', serviceType: 'intercity_transfer', rating: 5, title: 'Perfect journey from Madinah to Makkah', body: 'Very comfortable journey. Driver stopped for Fajr prayer and provided water. Made the long journey easy.', driverRating: 5, vehicleRating: 4, reply: 'JazakAllahu Khayran Sister Nadia! We are so pleased you had a blessed journey. See you on your next Umrah!', repliedAt: '2025-04-24T10:00:00Z', isPublished: true, createdAt: '2025-04-23T14:00:00Z' },
  { id: 'r3', bookingId: 'b8', bookingReference: 'BK-U3H9E5', customerName: 'Khalid Ansari', customerCountry: 'United Kingdom', serviceType: 'airport_transfer', rating: 4, title: 'Good service overall', body: 'Driver was professional and minivan was spacious for 8 passengers. A small delay at pickup but communicated well via WhatsApp.', driverRating: 4, vehicleRating: 5, isPublished: true, createdAt: '2025-04-22T20:00:00Z' },
]

export const MOCK_STATS: DashboardStats = {
  totalBookings: 247,
  totalRevenue: 18450,
  activeDrivers: 4,
  pendingBookings: 3,
  bookingsChange: 12.5,
  revenueChange: 8.3,
  driversChange: 0,
  pendingChange: -15,
}

export const MOCK_REVENUE_DATA: RevenueDataPoint[] = [
  { month: 'Nov', revenue: 8200,  bookings: 62 },
  { month: 'Dec', revenue: 11400, bookings: 88 },
  { month: 'Jan', revenue: 9800,  bookings: 74 },
  { month: 'Feb', revenue: 12300, bookings: 95 },
  { month: 'Mar', revenue: 15600, bookings: 118 },
  { month: 'Apr', revenue: 18450, bookings: 139 },
]

export const MOCK_SERVICE_BREAKDOWN: ServiceBreakdown[] = [
  { name: 'Airport Transfers', value: 45, color: '#2563eb' },
  { name: 'Intercity',         value: 28, color: '#7c3aed' },
  { name: 'Ziyarat Tours',     value: 15, color: '#059669' },
  { name: 'Umrah with Qari',   value: 8,  color: '#d97706' },
  { name: 'Elderly Assist',    value: 4,  color: '#dc2626' },
]

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'a1', type: 'booking', title: 'New booking received', description: 'Mohammed Riaz — Airport Transfer, JED → Makkah', time: '2025-04-25T09:05:00Z', icon: 'calendar' },
  { id: 'a2', type: 'payment', title: 'Payment confirmed', description: 'BK-M5A2X8 — £65 via bank transfer', time: '2025-04-25T08:30:00Z', icon: 'credit-card' },
  { id: 'a3', type: 'booking', title: 'Booking completed', description: 'Ibrahim Ali — Airport Transfer, MED → Madinah', time: '2025-04-24T19:30:00Z', icon: 'check-circle' },
  { id: 'a4', type: 'review', title: 'New 5★ review', description: 'Ibrahim Ali praised driver Yusuf Al-Amri', time: '2025-04-24T21:00:00Z', icon: 'star' },
  { id: 'a5', type: 'booking', title: 'Booking cancelled', description: 'Sara Hussain — Ziyarat Tour, refund issued', time: '2025-04-19T10:00:00Z', icon: 'x-circle' },
  { id: 'a6', type: 'driver', title: 'Driver assigned', description: 'Hassan Malik assigned to BK-M5A2X8', time: '2025-04-20T10:35:00Z', icon: 'user' },
]
