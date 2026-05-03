import { NextRequest, NextResponse } from 'next/server'
import { signAdminToken, ADMIN_CREDENTIALS } from '@/lib/admin/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(`admin-login:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in a minute.' },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => ({}))
  const { email, password } = body

  if (
    email !== ADMIN_CREDENTIALS.email ||
    password !== ADMIN_CREDENTIALS.password
  ) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await signAdminToken({
    userId: 'admin-1',
    email,
    role: 'super_admin',
    name: 'Admin',
  })

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
  return res
}
