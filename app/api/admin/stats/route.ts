import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin/auth'
import { MOCK_STATS, MOCK_REVENUE_DATA, MOCK_SERVICE_BREAKDOWN } from '@/lib/admin/mock-data'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    stats: MOCK_STATS,
    revenueData: MOCK_REVENUE_DATA,
    serviceBreakdown: MOCK_SERVICE_BREAKDOWN,
  })
}
