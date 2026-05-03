import nodemailer from 'nodemailer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.umrahtransport.me'
const FROM = process.env.SMTP_FROM || 'Umrah Transport <noreply@umrahtransport.me>'

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

function isConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
}

function baseTemplate(title: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:#1e3a8a;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🕌 Umrah Transport</h1>
        <p style="color:#aac4e8;margin:6px 0 0;font-size:14px;">${title}</p>
      </div>
      <div style="padding:30px;background:#f8fafc;border-radius:0 0 8px 8px;">
        ${body}
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
          Umrah Transport · Making your blessed journey easy<br>
          <a href="${SITE_URL}" style="color:#1e3a8a;">www.umrahtransport.me</a>
        </p>
      </div>
    </div>`
}

function table(rows: [string, string][]) {
  return `
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-radius:6px;">
      ${rows.map(([label, value]) => `
        <tr>
          <td style="padding:10px 14px;color:#64748b;font-size:13px;width:38%;border-bottom:1px solid #f1f5f9;">${label}</td>
          <td style="padding:10px 14px;color:#1e293b;font-size:13px;font-weight:500;border-bottom:1px solid #f1f5f9;">${value}</td>
        </tr>`).join('')}
    </table>`
}

function btn(text: string, href: string) {
  return `<div style="text-align:center;margin:24px 0;">
    <a href="${href}" style="background:#1e3a8a;color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;">${text}</a>
  </div>`
}

// ── Booking Confirmation ───────────────────────────────────────────────────────

export async function sendBookingConfirmation(data: {
  customerName: string
  customerEmail: string
  bookingRef: string
  serviceType: string
  pickupLocation: string
  dropoffLocation: string
  travelDate: string
  travelTime?: string
  passengers: number
  vehicleType: string
  totalAmount: number
}) {
  if (!isConfigured()) return
  const body = `
    <p style="font-size:17px;color:#1e3a8a;font-weight:bold;margin:0 0 8px;">
      Assalamu Alaikum, ${data.customerName} 🤲
    </p>
    <p style="color:#475569;margin:0 0 20px;">
      Your booking is <strong>confirmed</strong>. JazakAllah Khair for choosing us for your blessed journey.
    </p>
    ${table([
      ['Reference', `<strong style="color:#1e3a8a;">${data.bookingRef}</strong>`],
      ['Service', data.serviceType],
      ['From', data.pickupLocation],
      ['To', data.dropoffLocation],
      ['Date', data.travelDate + (data.travelTime ? ` at ${data.travelTime}` : '')],
      ['Passengers', String(data.passengers)],
      ['Vehicle', data.vehicleType],
      ['Total Paid', `<strong style="color:#059669;font-size:16px;">£${data.totalAmount}</strong>`],
    ])}
    <p style="color:#475569;margin:20px 0 0;">
      Your driver will be assigned shortly and you will receive another message with their full details.
    </p>
    ${btn('View My Booking →', `${SITE_URL}/account`)}`

  await getTransporter().sendMail({
    from: FROM,
    to: data.customerEmail,
    subject: `✅ Booking Confirmed — ${data.bookingRef} | Umrah Transport`,
    html: baseTemplate('Booking Confirmation', body),
  })
}

// ── Driver Assigned (to customer) ─────────────────────────────────────────────

export async function sendDriverAssignedToCustomer(data: {
  customerName: string
  customerEmail: string
  bookingRef: string
  driverName: string
  driverPhone: string
  vehicleInfo: string
  travelDate: string
  pickupLocation: string
}) {
  if (!isConfigured()) return
  const body = `
    <p style="font-size:17px;color:#1e3a8a;font-weight:bold;margin:0 0 8px;">
      Assalamu Alaikum, ${data.customerName}!
    </p>
    <p style="color:#475569;margin:0 0 20px;">
      Great news! A driver has been assigned to booking <strong>${data.bookingRef}</strong>.
    </p>
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:0 0 20px;">
      <h3 style="color:#15803d;margin:0 0 14px;font-size:15px;">🚗 Your Driver Details</h3>
      ${table([
        ['Driver Name', data.driverName],
        ['Contact / WhatsApp', data.driverPhone],
        ['Vehicle', data.vehicleInfo],
        ['Date', data.travelDate],
        ['Pickup', data.pickupLocation],
      ])}
    </div>
    <p style="color:#475569;">
      Please save your driver's number. You can reach them directly on WhatsApp for any coordination.
    </p>
    ${btn('View Booking →', `${SITE_URL}/account`)}`

  await getTransporter().sendMail({
    from: FROM,
    to: data.customerEmail,
    subject: `🚗 Driver Assigned — ${data.bookingRef} | Umrah Transport`,
    html: baseTemplate('Driver Assigned', body),
  })
}

// ── Job Notification (to driver) ──────────────────────────────────────────────

export async function sendDriverJobNotification(data: {
  driverEmail: string
  driverName: string
  customerName: string
  customerPhone: string
  bookingRef: string
  serviceType: string
  pickupLocation: string
  dropoffLocation: string
  travelDate: string
  travelTime?: string
  passengers: number
  notes?: string
}) {
  if (!isConfigured() || !data.driverEmail) return
  const rows: [string, string][] = [
    ['Booking Ref', `<strong>${data.bookingRef}</strong>`],
    ['Customer', data.customerName],
    ['Customer Phone', data.customerPhone],
    ['Service', data.serviceType],
    ['From', data.pickupLocation],
    ['To', data.dropoffLocation],
    ['Date', data.travelDate + (data.travelTime ? ` at ${data.travelTime}` : '')],
    ['Passengers', String(data.passengers)],
  ]
  if (data.notes) rows.push(['Notes', data.notes])

  const body = `
    <p style="font-size:17px;color:#1e3a8a;font-weight:bold;margin:0 0 8px;">
      Dear ${data.driverName},
    </p>
    <p style="color:#475569;margin:0 0 20px;">
      You have been assigned a new booking. Please review the details and be at the pickup location on time.
    </p>
    ${table(rows)}
    <p style="color:#475569;margin:20px 0 0;">
      Please confirm your availability. JazakAllah Khair!
    </p>`

  await getTransporter().sendMail({
    from: FROM,
    to: data.driverEmail,
    subject: `🚗 New Job — ${data.bookingRef} | Umrah Transport`,
    html: baseTemplate('New Job Assigned', body),
  })
}

// ── Vendor Approval ───────────────────────────────────────────────────────────

export async function sendVendorApproval(data: {
  vendorEmail: string
  companyName: string
  loginUrl: string
}) {
  if (!isConfigured()) return
  const body = `
    <p style="font-size:17px;color:#1e3a8a;font-weight:bold;margin:0 0 8px;">
      Assalamu Alaikum, ${data.companyName}!
    </p>
    <p style="color:#475569;margin:0 0 20px;">
      Your vendor account has been <strong>approved</strong>. You can now log in to your dashboard to manage your fleet, drivers, and bookings.
    </p>
    ${btn('Login to Vendor Portal →', data.loginUrl)}`

  await getTransporter().sendMail({
    from: FROM,
    to: data.vendorEmail,
    subject: `✅ Vendor Account Approved | Umrah Transport`,
    html: baseTemplate('Account Approved', body),
  })
}

// ── Admin Alert ───────────────────────────────────────────────────────────────

export async function sendAdminNewBookingAlert(data: {
  bookingRef: string
  customerName: string
  serviceType: string
  travelDate: string
  totalAmount: number
}) {
  if (!isConfigured() || !process.env.ADMIN_ALERT_EMAIL) return
  const body = `
    <p style="color:#475569;margin:0 0 20px;">A new confirmed booking has been received:</p>
    ${table([
      ['Reference', data.bookingRef],
      ['Customer', data.customerName],
      ['Service', data.serviceType],
      ['Travel Date', data.travelDate],
      ['Amount', `£${data.totalAmount}`],
    ])}
    ${btn('View in Admin →', `${SITE_URL}/admin/bookings`)}`

  await getTransporter().sendMail({
    from: FROM,
    to: process.env.ADMIN_ALERT_EMAIL,
    subject: `📋 New Booking — ${data.bookingRef}`,
    html: baseTemplate('New Booking Alert', body),
  })
}
