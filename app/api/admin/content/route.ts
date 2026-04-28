import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-user-id') !== null
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const page = req.nextUrl.searchParams.get('page')
  const blocks = await prisma.contentBlock.findMany({
    where: page ? { page } : undefined,
    orderBy: [{ page: 'asc' }, { section: 'asc' }, { sortOrder: 'asc' }],
  })
  return NextResponse.json(blocks)
}

// PUT: upsert a whole section's blocks at once
// body: { page, section, blocks: [{ key, value, type, label, sortOrder }] }
export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { page, section, blocks } = await req.json()
  if (!page || !section || !Array.isArray(blocks)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  await Promise.all(
    blocks.map((b: { key: string; value: string; type?: string; label?: string; sortOrder?: number }) =>
      prisma.contentBlock.upsert({
        where: { page_section_key: { page, section, key: b.key } },
        update: { value: b.value, type: b.type ?? 'text', label: b.label ?? b.key, sortOrder: b.sortOrder ?? 0 },
        create: { page, section, key: b.key, value: b.value, type: b.type ?? 'text', label: b.label ?? b.key, sortOrder: b.sortOrder ?? 0 },
      })
    )
  )
  revalidatePath('/', 'layout')
  return NextResponse.json({ ok: true })
}
