import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-user-id') !== null
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await prisma.setting.findMany()
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body: Record<string, string> = await req.json()
  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  )
  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true })
}
