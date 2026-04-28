import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/vendor-auth'
import { revalidatePath } from 'next/cache'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!req.headers.get('x-user-id')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const { password, ...rest } = body

  const data: Record<string, unknown> = { ...rest }
  if (password) data.passwordHash = hashPassword(password)

  const vendor = await prisma.vendorAccount.update({ where: { id }, data })
  revalidatePath('/admin/vendors')
  return NextResponse.json(vendor)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!req.headers.get('x-user-id')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.vendorAccount.delete({ where: { id } })
  revalidatePath('/admin/vendors')
  return NextResponse.json({ ok: true })
}
