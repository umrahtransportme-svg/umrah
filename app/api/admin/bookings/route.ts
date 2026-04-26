import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin/auth'
import { MOCK_BOOKINGS } from '@/lib/admin/mock-data'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 10)
  const status = searchParams.get('status')
  const search = searchParams.get('search')?.toLowerCase()

  let bookings = [...MOCK_BOOKINGS]
  if (status) bookings = bookings.filter((b) => b.status === status)
  if (search) {
    bookings = bookings.filter(
      (b) =>
        b.customerName.toLowerCase().includes(search) ||
        b.reference.toLowerCase().includes(search),
    )
  }

  const total = bookings.length
  const data = bookings.slice((page - 1) * limit, page * limit)

  return NextResponse.json({ data, total, page, limit })
}
