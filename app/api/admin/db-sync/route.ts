import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(req: NextRequest) {
  if (!req.headers.get('x-user-id')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sql = neon(process.env.POSTGRES_PRISMA_URL!)
  const results: string[] = []

  const run = async (label: string, fn: () => Promise<unknown>) => {
    try { await fn(); results.push(`${label}: ok`) }
    catch (e: any) { results.push(`${label}: ${e.message?.slice(0, 80)}`) }
  }

  await run('vendor_accounts', () => sql`
    CREATE TABLE IF NOT EXISTS vendor_accounts (
      id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "companyName"    TEXT NOT NULL,
      "contactName"    TEXT NOT NULL,
      email            TEXT NOT NULL UNIQUE,
      phone            TEXT,
      "passwordHash"   TEXT NOT NULL,
      status           TEXT NOT NULL DEFAULT 'pending',
      city             TEXT,
      country          TEXT NOT NULL DEFAULT 'Saudi Arabia',
      "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 15,
      "payoutMethod"   TEXT NOT NULL DEFAULT 'bank',
      "payoutDetails"  JSONB NOT NULL DEFAULT '{}',
      "payoutSchedule" TEXT NOT NULL DEFAULT 'monthly',
      "payoutDay"      INTEGER NOT NULL DEFAULT 1,
      "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)

  await run('payouts', () => sql`
    CREATE TABLE IF NOT EXISTS payouts (
      id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "vendorId"  TEXT NOT NULL REFERENCES vendor_accounts(id),
      amount      DOUBLE PRECISION NOT NULL,
      currency    TEXT NOT NULL DEFAULT 'GBP',
      status      TEXT NOT NULL DEFAULT 'pending',
      method      TEXT NOT NULL,
      reference   TEXT,
      period      TEXT,
      notes       TEXT,
      "paidAt"    TIMESTAMPTZ,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)

  await run('vendor_vehicles', () => sql`
    CREATE TABLE IF NOT EXISTS vendor_vehicles (
      id                   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "vendorId"           TEXT NOT NULL REFERENCES vendor_accounts(id) ON DELETE CASCADE,
      make                 TEXT NOT NULL,
      model                TEXT NOT NULL,
      year                 INTEGER NOT NULL,
      plate                TEXT NOT NULL UNIQUE,
      color                TEXT,
      capacity             INTEGER NOT NULL,
      "vehicleType"        TEXT NOT NULL,
      status               TEXT NOT NULL DEFAULT 'pending',
      "regDoc"             TEXT,
      "regDocName"         TEXT,
      "insuranceDoc"       TEXT,
      "insuranceDocName"   TEXT,
      "roadworthyDoc"      TEXT,
      "roadworthyDocName"  TEXT,
      "photoFront"         TEXT,
      "photoSide"          TEXT,
      notes                TEXT,
      "createdAt"          TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"          TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)

  await run('vendor_drivers', () => sql`
    CREATE TABLE IF NOT EXISTS vendor_drivers (
      id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "vendorId"          TEXT NOT NULL REFERENCES vendor_accounts(id) ON DELETE CASCADE,
      "fullName"          TEXT NOT NULL,
      email               TEXT,
      phone               TEXT NOT NULL,
      nationality         TEXT,
      "licenseNumber"     TEXT NOT NULL,
      "licenseExpiry"     TEXT NOT NULL,
      status              TEXT NOT NULL DEFAULT 'active',
      "licenseDoc"        TEXT,
      "licenseDocName"    TEXT,
      "passportDoc"       TEXT,
      "passportDocName"   TEXT,
      "photoUrl"          TEXT,
      "assignedVehicleId" TEXT,
      notes               TEXT,
      "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"         TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)

  await run('vendor_documents', () => sql`
    CREATE TABLE IF NOT EXISTS vendor_documents (
      id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "vendorId"   TEXT NOT NULL REFERENCES vendor_accounts(id) ON DELETE CASCADE,
      "docType"    TEXT NOT NULL,
      label        TEXT NOT NULL,
      "fileData"   TEXT,
      "fileName"   TEXT,
      status       TEXT NOT NULL DEFAULT 'pending',
      "expiryDate" TEXT,
      "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)

  await run('saved_cards', () => sql`
    CREATE TABLE IF NOT EXISTS saved_cards (
      id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "userId"        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      last4           TEXT NOT NULL,
      brand           TEXT NOT NULL,
      "expMonth"      INTEGER NOT NULL,
      "expYear"       INTEGER NOT NULL,
      "cardholderName" TEXT,
      "isDefault"     BOOLEAN NOT NULL DEFAULT false,
      "stripeId"      TEXT,
      "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)

  await run('referrals', () => sql`
    CREATE TABLE IF NOT EXISTS referrals (
      id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "referrerId"    TEXT NOT NULL REFERENCES users(id),
      "referredEmail" TEXT,
      commission      DOUBLE PRECISION NOT NULL DEFAULT 10,
      status          TEXT NOT NULL DEFAULT 'pending',
      "paidAt"        TIMESTAMPTZ,
      "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)

  await run('complaints', () => sql`
    CREATE TABLE IF NOT EXISTS complaints (
      id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "userId"     TEXT NOT NULL REFERENCES users(id),
      "bookingRef" TEXT,
      category     TEXT NOT NULL,
      subject      TEXT NOT NULL,
      message      TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'open',
      priority     TEXT NOT NULL DEFAULT 'normal',
      response     TEXT,
      "resolvedAt" TIMESTAMPTZ,
      "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)

  // Add new columns to existing tables
  await run('users.profilePicture', () => sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS "profilePicture" TEXT`)
  await run('users.referralCode',   () => sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS "referralCode" TEXT UNIQUE`)
  await run('bookings.vendorId',              () => sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "vendorId" TEXT REFERENCES vendor_accounts(id)`)
  await run('bookings.vendorAmount',           () => sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "vendorAmount" DOUBLE PRECISION NOT NULL DEFAULT 0`)
  await run('bookings.refunded',               () => sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS refunded BOOLEAN NOT NULL DEFAULT false`)
  await run('bookings.refundAmount',           () => sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "refundAmount" DOUBLE PRECISION NOT NULL DEFAULT 0`)
  await run('bookings.stripeSessionId',        () => sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "stripeSessionId" TEXT`)
  await run('bookings.stripePaymentIntentId',  () => sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" TEXT`)
  await run('bookings.paidAt',                 () => sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMPTZ`)

  return NextResponse.json({ results })
}
