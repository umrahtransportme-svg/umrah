import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(req: NextRequest) {
  if (!req.headers.get('x-user-id')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sql = neon(process.env.POSTGRES_PRISMA_URL!)
  const results: string[] = []

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS vendor_accounts (
        id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "companyName"  TEXT NOT NULL,
        "contactName"  TEXT NOT NULL,
        email          TEXT NOT NULL UNIQUE,
        phone          TEXT,
        "passwordHash" TEXT NOT NULL,
        status         TEXT NOT NULL DEFAULT 'pending',
        city           TEXT,
        country        TEXT NOT NULL DEFAULT 'Saudi Arabia',
        "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 15,
        "payoutMethod" TEXT NOT NULL DEFAULT 'bank',
        "payoutDetails" JSONB NOT NULL DEFAULT '{}',
        "payoutSchedule" TEXT NOT NULL DEFAULT 'monthly',
        "payoutDay"    INTEGER NOT NULL DEFAULT 1,
        "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `
    results.push('vendor_accounts: ok')
  } catch (e: any) {
    results.push(`vendor_accounts: ${e.message}`)
  }

  try {
    await sql`
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
      )
    `
    results.push('payouts: ok')
  } catch (e: any) {
    results.push(`payouts: ${e.message}`)
  }

  try {
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "vendorId" TEXT REFERENCES vendor_accounts(id)`
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "vendorAmount" DOUBLE PRECISION NOT NULL DEFAULT 0`
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS refunded BOOLEAN NOT NULL DEFAULT false`
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "refundAmount" DOUBLE PRECISION NOT NULL DEFAULT 0`
    results.push('bookings columns: ok')
  } catch (e: any) {
    results.push(`bookings columns: ${e.message}`)
  }

  return NextResponse.json({ results })
}
