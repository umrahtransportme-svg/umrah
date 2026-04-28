import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { BUSINESS } from '@/lib/config'
import ContactClient from './ContactClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contact Us | Umrah Transport',
  description:
    'Get in touch with Umrah Transport via WhatsApp, email or phone. We are available 24/7 to answer your questions and help you book pilgrimage transportation.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  let phone = BUSINESS.phone
  let email = BUSINESS.email
  let address = ''
  let whatsappNumber = BUSINESS.whatsappNumber

  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ['email', 'whatsappNumber', 'address'] } },
    })
    const db = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    if (db.email) email = db.email
    if (db.whatsappNumber) {
      phone = db.whatsappNumber
      whatsappNumber = db.whatsappNumber
    }
    if (db.address) address = db.address
  } catch {
    // Fall back to config defaults if DB is unavailable
  }

  return (
    <ContactClient
      phone={phone}
      email={email}
      address={address}
      whatsappNumber={whatsappNumber}
    />
  )
}
