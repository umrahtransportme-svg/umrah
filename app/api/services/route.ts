import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const services = await prisma.service.findMany({
    where: { enabled: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(services)
}
