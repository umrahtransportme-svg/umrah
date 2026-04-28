import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminToken } from '@/lib/admin/auth'
import { verifyVendorToken } from '@/lib/vendor-auth'

const ADMIN_PUBLIC = ['/admin/login', '/api/admin/auth/login']
const VENDOR_PUBLIC = ['/vendor/login', '/api/vendor/auth/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Vendor routes ─────────────────────────────────────────────────────────
  if (pathname.startsWith('/vendor') || pathname.startsWith('/api/vendor')) {
    if (VENDOR_PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next()

    if (pathname.startsWith('/api/vendor/')) {
      const token = request.cookies.get('vendor_token')?.value
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const payload = await verifyVendorToken(token)
      if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      const headers = new Headers(request.headers)
      headers.set('x-vendor-id', payload.vendorId)
      headers.set('x-vendor-email', payload.email)
      return NextResponse.next({ request: { headers } })
    }

    const token = request.cookies.get('vendor_token')?.value
    if (!token) return NextResponse.redirect(new URL('/vendor/login', request.url))
    const payload = await verifyVendorToken(token)
    if (!payload) {
      const res = NextResponse.redirect(new URL('/vendor/login', request.url))
      res.cookies.delete('vendor_token')
      return res
    }
    return NextResponse.next()
  }

  // ── Admin routes ───────────────────────────────────────────────────────────
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next()
  }

  if (ADMIN_PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next()

  if (pathname.startsWith('/api/admin/')) {
    const token =
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      request.cookies.get('admin_token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = await verifyAdminToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const headers = new Headers(request.headers)
    headers.set('x-user-id', payload.userId)
    headers.set('x-user-role', payload.role)
    headers.set('x-user-email', payload.email)
    return NextResponse.next({ request: { headers } })
  }

  const token = request.cookies.get('admin_token')?.value
  if (!token) return NextResponse.redirect(new URL('/admin/login', request.url))
  const payload = await verifyAdminToken(token)
  if (!payload) {
    const res = NextResponse.redirect(new URL('/admin/login', request.url))
    res.cookies.delete('admin_token')
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
