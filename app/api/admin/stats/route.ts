import { NextRequest, NextResponse } from 'next/server'
import { MOCK_STATS, MOCK_REVENUE_DATA, MOCK_SERVICE_BREAKDOWN } from '@/lib/admin/mock-data'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-user-id') !== null
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({
    stats: MOCK_STATS,
    revenueData: MOCK_REVENUE_DATA,
    serviceBreakdown: MOCK_SERVICE_BREAKDOWN,
  })
}
