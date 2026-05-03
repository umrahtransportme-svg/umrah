'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plane,
  Car,
  MapPin,
  Star,
  Heart,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  User,
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  Globe,
  FileText,
  Briefcase,
  Minus,
  Plus,
  AlertTriangle,
} from 'lucide-react'
import { buildBookingMessage, openWhatsApp } from '@/lib/whatsapp'
import { generateBookingRef, formatPrice } from '@/lib/utils'
import { PRICING } from '@/lib/config'
import { getRoutePrice } from '@/lib/route-pricing'
import {
  VEHICLE_CAPACITY,
  recommendVehicle,
  isVehicleValid,
  getCapacityMessage,
} from '@/lib/vehicle-capacity'
import type { ServiceType, VehicleType } from '@/types'

const schema = z.object({
  serviceType: z.enum([
    'airport-transfer',
    'intercity-transfer',
    'ziyarat-tour',
    'umrah-with-qari',
    'elderly-assistance',
  ] as const),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropoffLocation: z.string().min(1, 'Drop-off location is required'),
  travelDate: z.string().min(1, 'Travel date is required'),
  travelTime: z.string().min(1, 'Travel time is required'),
  passengers: z.number({ coerce: true }).min(1).max(60),
  luggage:    z.number({ coerce: true }).min(0).max(60),
  vehicleType: z.enum(['sedan', 'suv', 'luxury-suv', 'hiace', 'coaster'] as const),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  whatsappNumber: z.string().min(8, 'Please enter a valid WhatsApp number'),
  country: z.string().min(1, 'Country is required'),
  email: z.string().email('Please enter a valid email address'),
  specialRequests: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const STEPS = [
  { id: 1, title: 'Service', desc: 'Choose your service' },
  { id: 2, title: 'Trip Details', desc: 'Journey information' },
  { id: 3, title: 'Your Info', desc: 'Personal details' },
  { id: 4, title: 'Confirm', desc: 'Review & book' },
]

const SERVICES = [
  {
    id: 'airport-transfer' as ServiceType,
    icon: Plane,
    title: 'Airport Transfer',
    desc: 'Jeddah & Madinah airports',
    color: 'blue',
  },
  {
    id: 'intercity-transfer' as ServiceType,
    icon: Car,
    title: 'Intercity Transfer',
    desc: 'Makkah · Madinah · Jeddah',
    color: 'violet',
  },
  {
    id: 'ziyarat-tour' as ServiceType,
    icon: MapPin,
    title: 'Ziyarat Tour',
    desc: 'Religious site visits',
    color: 'emerald',
  },
  {
    id: 'umrah-with-qari' as ServiceType,
    icon: Star,
    title: 'Umrah with Qari',
    desc: 'Guided Umrah experience',
    color: 'amber',
  },
  {
    id: 'elderly-assistance' as ServiceType,
    icon: Heart,
    title: 'Elderly Assistance',
    desc: 'Personal care & support',
    color: 'rose',
  },
]

const VEHICLES: { id: VehicleType; name: string; desc: string; example: string }[] = [
  { id: 'sedan',       name: 'Sedan',       desc: 'Up to 3 passengers',  example: 'Toyota Corolla / Hyundai Sonata' },
  { id: 'suv',         name: 'SUV / MPV',   desc: 'Up to 6 passengers',  example: 'Hyundai Staria / H1' },
  { id: 'luxury-suv',  name: 'Luxury SUV',  desc: 'Up to 6 passengers',  example: 'GMC Yukon / Land Cruiser' },
  { id: 'hiace',       name: 'Hiace',       desc: 'Up to 10 passengers', example: 'Toyota Hiace High Roof' },
  { id: 'coaster',     name: 'Coaster',     desc: 'Up to 16 passengers', example: 'Toyota Coaster EX' },
]

const PICKUP_OPTIONS: Record<ServiceType, string[]> = {
  'airport-transfer': [
    'Jeddah Airport (JED)',
    'Madinah Airport (MED)',
    'Hotel in Makkah',
    'Hotel in Madinah',
    'Hotel in Jeddah',
  ],
  'intercity-transfer': ['Makkah', 'Madinah', 'Jeddah'],
  'ziyarat-tour': ['Makkah Ziyarat', 'Madinah Ziyarat', 'Bader Ziyarat'],
  'umrah-with-qari': ['Makkah (Hotel)'],
  'elderly-assistance': ['Makkah (Hotel)', 'Madinah (Hotel)', 'Jeddah'],
}

const DROPOFF_OPTIONS: Record<ServiceType, string[]> = {
  'airport-transfer': [
    'Hotel in Makkah',
    'Hotel in Madinah',
    'Hotel in Jeddah',
    'Jeddah Airport (JED)',
    'Madinah Airport (MED)',
  ],
  'intercity-transfer': ['Makkah', 'Madinah', 'Jeddah'],
  'ziyarat-tour': ['Return to Hotel'],
  'umrah-with-qari': ['Return to Hotel'],
  'elderly-assistance': ['Return to Hotel / Haram'],
}

const COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Sweden',
  'Other',
]

function getEstimatedPrice(
  service: ServiceType,
  vehicle: VehicleType,
  pickup?: string,
  dropoff?: string,
): number | null {
  if (service === 'umrah-with-qari')    return PRICING.umrahWithQari
  if (service === 'elderly-assistance') return PRICING.elderlyAssistance.hourlyRate * PRICING.elderlyAssistance.minHours
  if (pickup && dropoff)                return getRoutePrice(pickup, dropoff, vehicle)
  return null
}

function ServiceLabel(id: ServiceType): string {
  return SERVICES.find((s) => s.id === id)?.title ?? id
}

export default function BookingForm() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [bookingRef, setBookingRef] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceType: undefined,
      vehicleType: 'sedan',
      passengers: 2,
      luggage: 2,
    },
  })

  const watchedService  = watch('serviceType')
  const watchedVehicle  = watch('vehicleType')
  const watchedPax      = watch('passengers') || 0
  const watchedLuggage  = watch('luggage')    || 0
  const watchedData = watch()

  // Auto-recommend vehicle when pax/luggage changes
  const recommended = recommendVehicle(watchedPax, watchedLuggage)
  const needsVehicleSvc = watchedService !== 'umrah-with-qari' && watchedService !== 'elderly-assistance'

  useEffect(() => {
    if (!needsVehicleSvc || !watchedVehicle) return
    if (!isVehicleValid(watchedVehicle, watchedPax, watchedLuggage)) {
      setValue('vehicleType', recommended, { shouldValidate: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPax, watchedLuggage])

  const goNext = async () => {
    let valid = false
    if (step === 1) valid = await trigger('serviceType')
    if (step === 2)
      valid = await trigger([
        'pickupLocation',
        'dropoffLocation',
        'travelDate',
        'travelTime',
        'passengers',
        'luggage',
        'vehicleType',
      ])
    if (step === 3)
      valid = await trigger([
        'fullName',
        'whatsappNumber',
        'country',
        'email',
      ])
    if (step === 4) valid = true

    if (valid) {
      setDirection(1)
      setStep((s) => Math.min(s + 1, 4))
    }
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 1))
  }

  const onSubmit = (data: FormData) => {
    const ref = generateBookingRef()
    setBookingRef(ref)
    setSubmitted(true)

    const message = buildBookingMessage({
      service: ServiceLabel(data.serviceType),
      pickup: data.pickupLocation,
      dropoff: data.dropoffLocation,
      date: data.travelDate,
      time: data.travelTime,
      passengers: data.passengers,
      vehicle: data.vehicleType,
      name: data.fullName,
      bookingRef: ref,
    })

    setTimeout(() => openWhatsApp(message), 800)
  }

  const watchedPickup  = watch('pickupLocation')
  const watchedDropoff = watch('dropoffLocation')
  const estimatedPrice = watchedService && watchedVehicle
    ? getEstimatedPrice(watchedService, watchedVehicle, watchedPickup, watchedDropoff)
    : null

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-card p-10 text-center max-w-lg mx-auto"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Booking Submitted!
        </h2>
        <p className="text-slate-500 mb-4">
          Your booking reference is:
        </p>
        <div className="bg-brand-50 border border-brand-100 rounded-xl py-3 px-6 mb-6 inline-block">
          <span className="text-2xl font-bold font-mono text-brand-700">
            {bookingRef}
          </span>
        </div>
        <p className="text-slate-500 text-sm mb-8">
          We are opening WhatsApp with your booking details. Our team will
          confirm availability and pricing within minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '447456938750'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <MessageCircle className="w-4 h-4" />
            Open WhatsApp
          </a>
          <button
            onClick={() => {
              setSubmitted(false)
              setStep(1)
            }}
            className="btn-secondary"
          >
            New Booking
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
      {/* Progress header */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step > s.id
                      ? 'bg-brand-600 text-white'
                      : step === s.id
                      ? 'bg-brand-600 text-white shadow-brand'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > s.id ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    s.id
                  )}
                </div>
                <div className="hidden sm:block">
                  <div
                    className={`text-xs font-semibold ${
                      step === s.id ? 'text-brand-600' : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </div>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${
                    step > s.id ? 'bg-brand-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 md:p-8 min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -30 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                    What service do you need?
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Select the service that best matches your requirements
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICES.map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => setValue('serviceType', svc.id, { shouldValidate: true })}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                          watchedService === svc.id
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-slate-200 hover:border-brand-200 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            watchedService === svc.id
                              ? 'bg-brand-600'
                              : 'bg-slate-100'
                          }`}
                        >
                          <svc.icon
                            className={`w-5 h-5 ${
                              watchedService === svc.id
                                ? 'text-white'
                                : 'text-slate-500'
                            }`}
                          />
                        </div>
                        <div>
                          <div
                            className={`font-semibold text-sm ${
                              watchedService === svc.id
                                ? 'text-brand-700'
                                : 'text-slate-800'
                            }`}
                          >
                            {svc.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {svc.desc}
                          </div>
                        </div>
                        {watchedService === svc.id && (
                          <CheckCircle className="w-5 h-5 text-brand-600 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.serviceType && (
                    <p className="text-red-500 text-sm mt-3">
                      {errors.serviceType.message}
                    </p>
                  )}
                </div>
              )}

              {/* Step 2: Trip Details */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                    Journey details
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Tell us about your trip
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pickup */}
                    <div>
                      <label className="label-field">
                        <MapPin className="w-3.5 h-3.5 inline mr-1" />
                        Pickup Location
                      </label>
                      <select
                        {...register('pickupLocation')}
                        className="input-field"
                      >
                        <option value="">Select pickup...</option>
                        {(watchedService
                          ? PICKUP_OPTIONS[watchedService]
                          : []
                        ).map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                        <option value="Other (specify in requests)">
                          Other (specify in requests)
                        </option>
                      </select>
                      {errors.pickupLocation && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pickupLocation.message}
                        </p>
                      )}
                    </div>

                    {/* Dropoff */}
                    <div>
                      <label className="label-field">
                        <MapPin className="w-3.5 h-3.5 inline mr-1" />
                        Drop-off Location
                      </label>
                      <select
                        {...register('dropoffLocation')}
                        className="input-field"
                      >
                        <option value="">Select drop-off...</option>
                        {(watchedService
                          ? DROPOFF_OPTIONS[watchedService]
                          : []
                        ).map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                        <option value="Other (specify in requests)">
                          Other (specify in requests)
                        </option>
                      </select>
                      {errors.dropoffLocation && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dropoffLocation.message}
                        </p>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <label className="label-field">
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />
                        Travel Date
                      </label>
                      <input
                        type="date"
                        {...register('travelDate')}
                        min={new Date().toISOString().split('T')[0]}
                        className="input-field"
                      />
                      {errors.travelDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.travelDate.message}
                        </p>
                      )}
                    </div>

                    {/* Time */}
                    <div>
                      <label className="label-field">
                        <Clock className="w-3.5 h-3.5 inline mr-1" />
                        Pickup Time
                      </label>
                      <input
                        type="time"
                        {...register('travelTime')}
                        className="input-field"
                      />
                      {errors.travelTime && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.travelTime.message}
                        </p>
                      )}
                    </div>

                    {/* Passengers + Luggage steppers */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="label-field">
                        <Users className="w-3.5 h-3.5 inline mr-1" />
                        Passengers
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <button type="button" onClick={() => setValue('passengers', Math.max(1, watchedPax - 1))}
                          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                          disabled={watchedPax <= 1}>
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-900">{watchedPax}</span>
                        <button type="button" onClick={() => setValue('passengers', Math.min(60, watchedPax + 1))}
                          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Luggage */}
                  <div className="mt-4">
                    <label className="label-field">
                      <Briefcase className="w-3.5 h-3.5 inline mr-1" />
                      Luggage Bags
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <button type="button" onClick={() => setValue('luggage', Math.max(0, watchedLuggage - 1))}
                        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                        disabled={watchedLuggage <= 0}>
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900">{watchedLuggage}</span>
                      <button type="button" onClick={() => setValue('luggage', Math.min(60, watchedLuggage + 1))}
                        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs text-slate-400 ml-1">total bags / suitcases</span>
                    </div>
                  </div>

                  {/* Vehicle selection */}
                  {watchedService !== 'umrah-with-qari' &&
                    watchedService !== 'elderly-assistance' && (
                      <div className="mt-4">
                        <label className="label-field">
                          <Car className="w-3.5 h-3.5 inline mr-1" />
                          Vehicle Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                          {VEHICLES.map((v) => {
                            const invalid = !isVehicleValid(v.id, watchedPax, watchedLuggage)
                            const reason  = getCapacityMessage(v.id, watchedPax, watchedLuggage)
                            const isRec   = v.id === recommended
                            return (
                              <button
                                key={v.id}
                                type="button"
                                title={invalid ? (reason ?? '') : v.example}
                                onClick={() => {
                                  if (!invalid) setValue('vehicleType', v.id, { shouldValidate: true })
                                }}
                                className={`p-3 rounded-xl border-2 text-left transition-all ${
                                  invalid
                                    ? 'border-red-100 bg-red-50 opacity-50 cursor-not-allowed'
                                    : watchedVehicle === v.id
                                    ? 'border-brand-500 bg-brand-50'
                                    : isRec
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-slate-200 hover:border-brand-200'
                                }`}
                              >
                                <div className={`font-semibold text-sm flex items-center gap-1 ${
                                  invalid ? 'text-slate-400' : watchedVehicle === v.id ? 'text-brand-700' : isRec ? 'text-green-700' : 'text-slate-800'
                                }`}>
                                  {v.name}
                                  {isRec && !invalid && (
                                    <span className="text-[9px] font-bold bg-green-500 text-white px-1 py-0.5 rounded-full">Best</span>
                                  )}
                                  {invalid && <AlertTriangle className="w-3 h-3 text-red-400" />}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                  {invalid ? reason : v.desc}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                  {/* Price preview */}
                  {estimatedPrice !== null && (
                    <div className="mt-5 p-3 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-between">
                      <span className="text-sm text-brand-700">
                        {watchedPickup && watchedDropoff ? 'Price for this route' : 'Estimated price'}
                      </span>
                      <span className="font-bold text-brand-700 text-lg">
                        {formatPrice(estimatedPrice!)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Personal Info */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                    Your details
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    How can we contact you?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="label-field">
                        <User className="w-3.5 h-3.5 inline mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...register('fullName')}
                        placeholder="Your full name"
                        className="input-field"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label-field">
                        <Phone className="w-3.5 h-3.5 inline mr-1" />
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        {...register('whatsappNumber')}
                        placeholder="+44 7456 938750"
                        className="input-field"
                      />
                      {errors.whatsappNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.whatsappNumber.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label-field">
                        <Globe className="w-3.5 h-3.5 inline mr-1" />
                        Country
                      </label>
                      <select {...register('country')} className="input-field">
                        <option value="">Select country...</option>
                        {COUNTRIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="label-field">
                        <Mail className="w-3.5 h-3.5 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="your@email.com"
                        className="input-field"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="label-field">
                        <FileText className="w-3.5 h-3.5 inline mr-1" />
                        Special Requests{' '}
                        <span className="text-slate-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        {...register('specialRequests')}
                        rows={3}
                        placeholder="E.g. wheelchair required, flight number, hotel name, dietary needs..."
                        className="input-field resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                    Review your booking
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Please confirm your booking details
                  </p>

                  <div className="space-y-4">
                    {/* Summary card */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                        Journey
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-slate-400 text-xs">Service</div>
                          <div className="font-medium text-slate-800 mt-0.5">
                            {watchedData.serviceType
                              ? ServiceLabel(watchedData.serviceType)
                              : '—'}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">Vehicle</div>
                          <div className="font-medium text-slate-800 mt-0.5 capitalize">
                            {watchedData.vehicleType}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">Pickup</div>
                          <div className="font-medium text-slate-800 mt-0.5">
                            {watchedData.pickupLocation || '—'}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">Drop-off</div>
                          <div className="font-medium text-slate-800 mt-0.5">
                            {watchedData.dropoffLocation || '—'}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">Date & Time</div>
                          <div className="font-medium text-slate-800 mt-0.5">
                            {watchedData.travelDate} at {watchedData.travelTime}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">Passengers</div>
                          <div className="font-medium text-slate-800 mt-0.5">
                            {watchedData.passengers}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                        Your Details
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-slate-400 text-xs">Name</div>
                          <div className="font-medium text-slate-800 mt-0.5">
                            {watchedData.fullName || '—'}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">Country</div>
                          <div className="font-medium text-slate-800 mt-0.5">
                            {watchedData.country || '—'}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">WhatsApp</div>
                          <div className="font-medium text-slate-800 mt-0.5">
                            {watchedData.whatsappNumber || '—'}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs">Email</div>
                          <div className="font-medium text-slate-800 mt-0.5 truncate">
                            {watchedData.email || '—'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price estimate */}
                    {estimatedPrice !== null && (
                      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <div className="text-brand-700 font-semibold">
                            Estimated Price
                          </div>
                          <div className="text-brand-500 text-xs mt-0.5">
                            Final price confirmed via WhatsApp
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-brand-700">
                          From {formatPrice(estimatedPrice)}
                        </div>
                      </div>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                      By submitting, your booking details will be sent to our
                      team via WhatsApp for confirmation. No payment is taken
                      until we confirm availability.
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="px-6 md:px-8 pb-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`rounded-full transition-all duration-300 ${
                  s.id === step
                    ? 'w-5 h-2 bg-brand-600'
                    : s.id < step
                    ? 'w-2 h-2 bg-brand-400'
                    : 'w-2 h-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {step < 4 ? (
            <button
              type="button"
              onClick={goNext}
              className="btn-primary"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" className="btn-primary">
              <MessageCircle className="w-4 h-4" />
              Confirm via WhatsApp
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
