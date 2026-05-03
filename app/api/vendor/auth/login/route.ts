import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signVendorToken, verifyPassword } from '@/lib/vendor-auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(`vendor-login:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in a minute.' },
      { status: 429 }
    )
  }

  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const vendor = await prisma.vendorAccount.findUnique({ where: { email } })
  if (!vendor || !verifyPassword(password, vendor.passwordHash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  if (vendor.status === 'pending') {
    return NextResponse.json(
      { error: 'Your account is pending verification. Please wait for admin approval.' },
      { status: 403 }
    )
  }
  if (vendor.status === 'suspended') {
    return NextResponse.json(
      { error: 'Your account has been suspended. Please contact support.' },
      { status: 403 }
    )
  }

  const token = await signVendorToken({
    vendorId: vendor.id,
    email: vendor.email,
    companyName: vendor.companyName,
  })

  const res = NextResponse.json({ ok: true, companyName: vendor.companyName })
  res.cookies.set('vendor_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
