import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ── Services ──────────────────────────────────────────────────────────────
  const services = [
    {
      id: 's1',
      name: 'Airport Transfer',
      iconName: 'Plane',
      enabled: true,
      description: 'Private transfers to/from Jeddah (JED) and Madinah (MED) airports.',
      pricing: [
        { id: 'sp1', label: 'Sedan (3 pax)', price: 45 },
        { id: 'sp2', label: 'SUV (6 pax)', price: 65 },
        { id: 'sp3', label: 'Minivan (12 pax)', price: 85 },
      ],
      colorClass: 'bg-blue-50 text-blue-600',
    },
    {
      id: 's2',
      name: 'Intercity Transfer',
      iconName: 'Car',
      enabled: true,
      description: 'Private intercity transfers between Makkah, Madinah, and Jeddah.',
      pricing: [
        { id: 'sp4', label: 'Sedan', price: 85 },
        { id: 'sp5', label: 'SUV', price: 115 },
        { id: 'sp6', label: 'Minivan', price: 145 },
      ],
      colorClass: 'bg-purple-50 text-purple-600',
    },
    {
      id: 's3',
      name: 'Ziyarat Tours',
      iconName: 'MapPin',
      enabled: true,
      description: 'Private guided tours of Islamic historical sites.',
      pricing: [
        { id: 'sp7', label: 'Half Day', price: 75 },
        { id: 'sp8', label: 'Full Day', price: 120 },
      ],
      colorClass: 'bg-green-50 text-green-600',
    },
    {
      id: 's4',
      name: 'Umrah with Qari',
      iconName: 'Star',
      enabled: true,
      description: 'Guided Umrah performance with a certified Qari.',
      pricing: [{ id: 'sp9', label: 'Per person', price: 180 }],
      colorClass: 'bg-amber-50 text-amber-600',
    },
    {
      id: 's5',
      name: 'Elderly Assistance',
      iconName: 'Heart',
      enabled: true,
      description: 'Personal helper, wheelchair support, and Haram access assistance.',
      pricing: [
        { id: 'sp10', label: 'Half Day (5h)', price: 85 },
        { id: 'sp11', label: 'Full Day (10h)', price: 150 },
      ],
      colorClass: 'bg-red-50 text-red-600',
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: service,
      create: service,
    })
  }

  // ── Settings ──────────────────────────────────────────────────────────────
  const settings: { key: string; value: string }[] = [
    { key: 'businessName', value: 'UmraTransport' },
    { key: 'legalName', value: 'Umra Transport Ltd' },
    { key: 'domain', value: 'www.umrahtransport.me' },
    { key: 'founded', value: '2018' },
    { key: 'whatsappNumber', value: '+44 7456 938750' },
    { key: 'email', value: 'info@umrahtransport.me' },
    { key: 'address', value: 'London, United Kingdom' },
    { key: 'primaryColor', value: '#2563eb' },
    { key: 'stripeMode', value: 'test' },
    { key: 'googleAnalyticsId', value: '' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('✅ Database seeded successfully')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
