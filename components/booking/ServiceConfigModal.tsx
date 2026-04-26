'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import {
  X, MapPin, Calendar, Clock, Users, Car, ShoppingCart,
  AlertTriangle, CheckCircle, Briefcase, Minus, Plus, Info, AlertCircle,
} from 'lucide-react'
import { getRoutePrice } from '@/lib/route-pricing'
import {
  VEHICLE_CAPACITY,
  recommendVehicle,
  isVehicleValid,
  getCapacityMessage,
} from '@/lib/vehicle-capacity'
import { PRICING } from '@/lib/config'
import { useCurrency } from '@/lib/currency-context'
import type { ServiceType, VehicleType } from '@/types'

// ─── Location options ─────────────────────────────────────────────────────────

const PICKUP_OPTIONS: Record<ServiceType, string[]> = {
  'airport-transfer': [
    'Jeddah Airport (JED)',
    'Madinah Airport (MED)',
    'Hotel in Makkah',
    'Hotel in Madinah',
    'Hotel in Jeddah',
  ],
  'intercity-transfer': ['Makkah', 'Madinah', 'Jeddah'],
  'ziyarat-tour':       ['Makkah Ziyarat', 'Madinah Ziyarat', 'Bader Ziyarat'],
  'umrah-with-qari':    ['Makkah (Hotel)'],
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
  'ziyarat-tour':       ['Return to Hotel'],
  'umrah-with-qari':    ['Return to Hotel'],
  'elderly-assistance': ['Return to Hotel / Haram'],
}

// ─── Vehicle data ─────────────────────────────────────────────────────────────

interface VehicleOption {
  id: VehicleType
  image: string
  gradient: string
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: 'sedan',       image: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Toyota_Corolla_Sedan.jpg',    gradient: 'from-blue-500 to-blue-700'      },
  { id: 'suv',         image: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/2021_Hyundai_Staria_S.jpg',  gradient: 'from-violet-500 to-violet-700'  },
  { id: 'luxury-suv',  image: 'https://upload.wikimedia.org/wikipedia/commons/5/59/2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_02.png', gradient: 'from-amber-500 to-yellow-600' },
  { id: 'hiace',       image: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/1989_Toyota_HiAce_9-seater_minibus_%28LH51%29%2C_rear_right.jpg', gradient: 'from-emerald-500 to-emerald-700' },
  { id: 'coaster',     image: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Toyota_Coaster_GX_XZB70_rear.jpg', gradient: 'from-rose-500 to-rose-700' },
]

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  pickupLocation:  z.string().min(1, 'Required'),
  dropoffLocation: z.string().min(1, 'Required'),
  travelDate:      z.string().min(1, 'Required'),
  travelTime:      z.string().min(1, 'Required'),
  passengers:      z.number().min(1).max(60),
  luggage:         z.number().min(0).max(60),
  vehicleType:     z.enum(['sedan', 'suv', 'luxury-suv', 'hiace', 'coaster'] as const),
  hours:           z.number().min(4).max(10).optional(),
  specialRequests: z.string().optional(),
})
type FormData = z.infer<typeof schema>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const needsVehicle    = (s: ServiceType) => s !== 'umrah-with-qari' && s !== 'elderly-assistance'
const isTransport     = (s: ServiceType) => s !== 'umrah-with-qari' && s !== 'elderly-assistance'

function elderlyPrice(hours: number) {
  return hours >= PRICING.elderlyAssistance.fullDayHours
    ? PRICING.elderlyAssistance.fullDayRate
    : hours * PRICING.elderlyAssistance.hourlyRate
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({
  value, onChange, min = 0, max = 60, icon: Icon, label,
}: {
  value: number; onChange: (n: number) => void; min?: number; max?: number
  icon: React.ElementType; label: string
}) {
  return (
    <div>
      <label className="label-field flex items-center gap-1 mb-2">
        <Icon className="w-3.5 h-3.5" />{label}
      </label>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-10 text-center text-lg font-bold text-slate-900 tabular-nums">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Vehicle card ─────────────────────────────────────────────────────────────

function VehicleCard({ option, selected, isRecommended, isInvalid, invalidReason, onClick }: {
  option: VehicleOption; selected: boolean; isRecommended: boolean
  isInvalid: boolean; invalidReason: string | null; onClick: () => void
}) {
  const [imgError, setImgError] = useState(false)
  const cap = VEHICLE_CAPACITY[option.id]

  return (
    <button type="button" onClick={onClick} title={isInvalid ? (invalidReason ?? '') : cap.example}
      className={`relative rounded-xl border-2 overflow-hidden transition-all duration-200 text-left
        ${selected && !isInvalid ? 'border-brand-500 ring-2 ring-brand-200'
          : isInvalid ? 'border-red-200 opacity-50 cursor-not-allowed'
          : isRecommended ? 'border-green-400 ring-2 ring-green-100'
          : 'border-slate-200 hover:border-brand-300'}`}
    >
      <div className="relative h-16 w-full">
        {!imgError ? (
          <Image src={option.image} alt={cap.label} fill
            className={`object-cover ${isInvalid ? 'grayscale' : ''}`}
            onError={() => setImgError(true)} sizes="100px" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${option.gradient} flex items-center justify-center ${isInvalid ? 'opacity-40' : ''}`}>
            <Car className="w-5 h-5 text-white/70" />
          </div>
        )}
        {isRecommended && !isInvalid && (
          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded-full leading-none">Best fit</div>
        )}
        {isInvalid && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/30">
            <AlertTriangle className="w-5 h-5 text-red-300" />
          </div>
        )}
        {selected && !isInvalid && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-brand-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className={`py-1.5 px-1.5 ${selected && !isInvalid ? 'bg-brand-50' : isRecommended ? 'bg-green-50' : 'bg-white'}`}>
        <div className={`text-xs font-bold leading-none ${selected && !isInvalid ? 'text-brand-700' : isRecommended ? 'text-green-700' : isInvalid ? 'text-slate-400' : 'text-slate-800'}`}>
          {cap.label}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">{cap.passengers} pax · {cap.luggage} bags</div>
      </div>
    </button>
  )
}

// ─── Main modal ───────────────────────────────────────────────────────────────

interface Props {
  serviceType: ServiceType
  serviceLabel: string
  onAdd: (data: FormData & { price: number }) => void
  onClose: () => void
}

export default function ServiceConfigModal({ serviceType, serviceLabel, onAdd, onClose }: Props) {
  const { format } = useCurrency()
  const isElderly = serviceType === 'elderly-assistance'
  const isUmrah   = serviceType === 'umrah-with-qari'

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      vehicleType: 'sedan',
      passengers:  isUmrah ? 2 : 1,
      luggage:     isElderly || isUmrah ? 0 : 2,
      hours:       isElderly ? 4 : undefined,
      pickupLocation:  isUmrah ? 'Makkah (Hotel)' : '',
      dropoffLocation: isUmrah ? 'Return to Hotel' : isElderly ? 'Return to Hotel / Haram' : '',
    },
  })

  const watchedVehicle = watch('vehicleType')
  const watchedPickup  = watch('pickupLocation')
  const watchedDropoff = watch('dropoffLocation')
  const watchedPax     = watch('passengers') || 1
  const watchedLuggage = watch('luggage')    || 0
  const watchedHours   = watch('hours')      ?? 4
  const today = new Date().toISOString().split('T')[0]

  // ── Smart vehicle recommendation ────────────────────────────────────────────
  const recommended    = recommendVehicle(watchedPax, watchedLuggage)
  const currentInvalid = needsVehicle(serviceType)
    ? !isVehicleValid(watchedVehicle, watchedPax, watchedLuggage)
    : false
  const [autoSwitched, setAutoSwitched] = useState(false)

  useEffect(() => {
    if (!needsVehicle(serviceType)) return
    if (currentInvalid) {
      setValue('vehicleType', recommended, { shouldValidate: true })
      setAutoSwitched(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPax, watchedLuggage])

  useEffect(() => { if (!currentInvalid) setAutoSwitched(false) }, [currentInvalid])

  // ── Pricing ─────────────────────────────────────────────────────────────────
  const routePrice = isTransport(serviceType)
    ? getRoutePrice(watchedPickup || '', watchedDropoff || '', watchedVehicle)
    : null
  const elderlyPriceVal = isElderly ? elderlyPrice(watchedHours) : null
  const umrahPrice      = isUmrah   ? PRICING.umrahWithQari : null

  const price: number | null = elderlyPriceVal ?? umrahPrice ?? routePrice
  const routeSelected    = Boolean(watchedPickup && watchedDropoff)
  const priceUnavailable = isTransport(serviceType) && routeSelected && routePrice === null

  // Elderly: suggest full-day package when hourly exceeds it
  const showFullDayTip = isElderly && watchedHours >= 8 && watchedHours < PRICING.elderlyAssistance.fullDayHours

  function onSubmit(data: FormData) {
    let finalPrice = 0
    if (isElderly) {
      finalPrice = elderlyPrice(data.hours ?? 4)
    } else if (isUmrah) {
      finalPrice = PRICING.umrahWithQari
    } else {
      finalPrice = getRoutePrice(data.pickupLocation, data.dropoffLocation, data.vehicleType) ?? 0
    }
    onAdd({ ...data, price: finalPrice })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900">{serviceLabel}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isElderly ? 'Hire a dedicated helper — set date, time & duration'
                : isUmrah ? 'Guided Umrah with a certified Qari — set date & group size'
                : 'Configure your journey details'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">

          {/* ── ELDERLY ASSISTANCE ───────────────────────────────────────── */}
          {isElderly && (
            <>
              {/* Location */}
              <div>
                <label className="label-field"><MapPin className="w-3 h-3 inline mr-1" />Service Location</label>
                <select {...register('pickupLocation')} className="input-field text-sm">
                  <option value="">Select city / hotel area...</option>
                  {PICKUP_OPTIONS['elderly-assistance'].map((o) => <option key={o}>{o}</option>)}
                </select>
                {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation.message}</p>}
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-field"><Calendar className="w-3 h-3 inline mr-1" />Date</label>
                  <input type="date" min={today} {...register('travelDate')} className="input-field text-sm" />
                  {errors.travelDate && <p className="text-red-500 text-xs mt-1">{errors.travelDate.message}</p>}
                </div>
                <div>
                  <label className="label-field"><Clock className="w-3 h-3 inline mr-1" />Start Time</label>
                  <input type="time" {...register('travelTime')} className="input-field text-sm" />
                  {errors.travelTime && <p className="text-red-500 text-xs mt-1">{errors.travelTime.message}</p>}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="label-field mb-2">Duration (hours)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[4, 5, 6, 7, 8, 9].map((h) => (
                    <button key={h} type="button"
                      onClick={() => setValue('hours', h, { shouldValidate: true })}
                      className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${watchedHours === h ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-700 hover:border-brand-300'}`}
                    >
                      {h}h<br />
                      <span className="text-xs font-normal">{format(h * PRICING.elderlyAssistance.hourlyRate)}</span>
                    </button>
                  ))}
                  <button type="button"
                    onClick={() => setValue('hours', PRICING.elderlyAssistance.fullDayHours, { shouldValidate: true })}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all col-span-2 flex flex-col items-center ${watchedHours === PRICING.elderlyAssistance.fullDayHours ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-700 hover:border-brand-300'}`}
                  >
                    <span>Full Day (10 hrs)</span>
                    <span className="text-xs font-bold text-green-600">{format(PRICING.elderlyAssistance.fullDayRate)} — Best value</span>
                  </button>
                </div>

                {showFullDayTip && (
                  <div className="mt-2 flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Full Day Package (10 hrs, {format(PRICING.elderlyAssistance.fullDayRate)}) saves you {format(watchedHours * PRICING.elderlyAssistance.hourlyRate - PRICING.elderlyAssistance.fullDayRate)} vs hourly rate.
                  </div>
                )}
              </div>

              {/* Medical disclaimer */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-800 mb-1">Medical assistance not included</p>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    Our helpers assist with mobility, wheelchair support, Haram access and general pilgrim support.
                    Medical care, nursing or clinical assistance is outside the scope of this service.
                  </p>
                </div>
              </div>

              {/* Special requests */}
              <div>
                <label className="label-field">Special Requests <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea {...register('specialRequests')} rows={2}
                  placeholder="E.g. wheelchair needed, female helper preferred, hotel name..."
                  className="input-field resize-none text-sm" />
              </div>
            </>
          )}

          {/* ── UMRAH WITH QARI ──────────────────────────────────────────── */}
          {isUmrah && (
            <>
              {/* Location info */}
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-semibold text-amber-800">Makkah (Hotel)</span>
                  <span className="text-amber-600 ml-1">— Our Qari meets you at your hotel in Makkah.</span>
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-field"><Calendar className="w-3 h-3 inline mr-1" />Date</label>
                  <input type="date" min={today} {...register('travelDate')} className="input-field text-sm" />
                  {errors.travelDate && <p className="text-red-500 text-xs mt-1">{errors.travelDate.message}</p>}
                </div>
                <div>
                  <label className="label-field"><Clock className="w-3 h-3 inline mr-1" />Time</label>
                  <input type="time" {...register('travelTime')} className="input-field text-sm" />
                  {errors.travelTime && <p className="text-red-500 text-xs mt-1">{errors.travelTime.message}</p>}
                </div>
              </div>

              {/* Group size */}
              <div className="p-4 bg-slate-50 rounded-2xl">
                <Stepper
                  value={watchedPax}
                  onChange={(n) => setValue('passengers', n, { shouldValidate: true })}
                  min={1} max={20}
                  icon={Users}
                  label="Number of People in Group"
                />
              </div>

              {/* Transport disclaimer */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-800 mb-1">Transport not included in this service</p>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    The Guided Umrah price covers only the Qari's guidance service — niyyah, ihram, tawaf, sa'i and duas.
                    Please book a separate <strong>Airport Transfer</strong> or <strong>Intercity Transfer</strong> for your journey to Makkah.
                  </p>
                </div>
              </div>

              {/* Special requests */}
              <div>
                <label className="label-field">Special Requests <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea {...register('specialRequests')} rows={2}
                  placeholder="E.g. elderly in group, specific duas, language preference..."
                  className="input-field resize-none text-sm" />
              </div>
            </>
          )}

          {/* ── TRANSPORT SERVICES ───────────────────────────────────────── */}
          {isTransport(serviceType) && (
            <>
              {/* Pickup / Dropoff */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-field"><MapPin className="w-3 h-3 inline mr-1" />Pickup</label>
                  <select {...register('pickupLocation')} className="input-field text-sm">
                    <option value="">Select...</option>
                    {PICKUP_OPTIONS[serviceType].map((o) => <option key={o}>{o}</option>)}
                    <option value="Other (specify below)">Other</option>
                  </select>
                  {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation.message}</p>}
                </div>
                <div>
                  <label className="label-field"><MapPin className="w-3 h-3 inline mr-1" />Drop-off</label>
                  <select {...register('dropoffLocation')} className="input-field text-sm">
                    <option value="">Select...</option>
                    {DROPOFF_OPTIONS[serviceType].map((o) => <option key={o}>{o}</option>)}
                    <option value="Other (specify below)">Other</option>
                  </select>
                  {errors.dropoffLocation && <p className="text-red-500 text-xs mt-1">{errors.dropoffLocation.message}</p>}
                </div>
              </div>

              {/* Date / Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-field"><Calendar className="w-3 h-3 inline mr-1" />Travel Date</label>
                  <input type="date" min={today} {...register('travelDate')} className="input-field text-sm" />
                  {errors.travelDate && <p className="text-red-500 text-xs mt-1">{errors.travelDate.message}</p>}
                </div>
                <div>
                  <label className="label-field"><Clock className="w-3 h-3 inline mr-1" />Pickup Time</label>
                  <input type="time" {...register('travelTime')} className="input-field text-sm" />
                  {errors.travelTime && <p className="text-red-500 text-xs mt-1">{errors.travelTime.message}</p>}
                </div>
              </div>

              {/* Passengers + Luggage steppers */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl">
                <Stepper value={watchedPax}    onChange={(n) => setValue('passengers', n, { shouldValidate: true })} min={1} max={60} icon={Users}    label="Passengers" />
                <Stepper value={watchedLuggage} onChange={(n) => setValue('luggage', n, { shouldValidate: true })}    min={0} max={60} icon={Briefcase} label="Luggage bags" />
              </div>

              {/* Vehicle selector */}
              {needsVehicle(serviceType) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label-field mb-0"><Car className="w-3 h-3 inline mr-1" />Choose Vehicle</label>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Info className="w-3 h-3" />Hover for details</span>
                  </div>

                  {autoSwitched && (
                    <div className="mb-3 flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Vehicle updated to <strong>{VEHICLE_CAPACITY[watchedVehicle].label}</strong> — fits <strong>{watchedPax} passengers</strong> and <strong>{watchedLuggage} bags</strong>. Select a larger option below.
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-5 gap-2">
                    {VEHICLE_OPTIONS.map((v) => {
                      const invalid = !isVehicleValid(v.id, watchedPax, watchedLuggage)
                      const reason  = getCapacityMessage(v.id, watchedPax, watchedLuggage)
                      return (
                        <VehicleCard key={v.id} option={v} selected={watchedVehicle === v.id}
                          isRecommended={v.id === recommended} isInvalid={invalid} invalidReason={reason}
                          onClick={() => { if (!invalid) { setValue('vehicleType', v.id, { shouldValidate: true }); setAutoSwitched(false) } }}
                        />
                      )
                    })}
                  </div>

                  <div className="mt-3 flex items-center gap-3 flex-wrap text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Best fit for your group</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-300 inline-block" /> Too small — not selectable</span>
                  </div>
                </div>
              )}

              {/* Route price unavailable */}
              {priceUnavailable && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  No set rate for this route. Please contact us on WhatsApp for a quote.
                </div>
              )}

              {/* Special requests */}
              <div>
                <label className="label-field">Special Requests <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea {...register('specialRequests')} rows={2}
                  placeholder="E.g. wheelchair, flight number, child seat, hotel name..."
                  className="input-field resize-none text-sm" />
              </div>
            </>
          )}

          {/* ── Price + CTA (all service types) ──────────────────────────── */}
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-brand-600 mb-0.5">
                {isElderly
                  ? (watchedHours >= PRICING.elderlyAssistance.fullDayHours ? 'Full Day Package (10 hrs)' : `${watchedHours} hours`)
                  : isUmrah
                  ? 'Per group — guide only'
                  : price !== null ? 'Price for this route & vehicle' : 'Select pickup & drop-off to see price'}
              </div>
              {price !== null
                ? <div className="text-2xl font-bold text-brand-700">{format(price)}</div>
                : <div className="text-lg font-semibold text-slate-400">—</div>
              }
            </div>
            <button type="submit" disabled={price === null || priceUnavailable}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
