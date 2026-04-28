import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

function generateCode(name: string): string {
  const base = (name || 'user').replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${base}${rand}`
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Auto-generate referral code if none exists
  if (!user.referralCode) {
    let code = generateCode(user.name || '')
    // Ensure unique
    while (await prisma.user.findUnique({ where: { referralCode: code } })) {
      code = generateCode(user.name || '')
    }
    user = await prisma.user.update({ where: { id: user.id }, data: { referralCode: code } })
  }

  const referrals = await prisma.referral.findMany({ where: { referrerId: user.id }, orderBy: { createdAt: 'desc' } })
  const totalEarned = referrals.filter(r => r.status === 'paid').reduce((s, r) => s + r.commission, 0)
  const pending = referrals.filter(r => r.status === 'pending').reduce((s, r) => s + r.commission, 0)

  return NextResponse.json({
    code: user.referralCode,
    shareUrl: `${process.env.NEXTAUTH_URL || 'https://umrahtransport.me'}/book?ref=${user.referralCode}`,
    totalEarned,
    pending,
    count: referrals.length,
    referrals: referrals.slice(0, 10),
  })
}
