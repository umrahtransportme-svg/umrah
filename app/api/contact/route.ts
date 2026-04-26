import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // In production: send email via Nodemailer / SendGrid / Resend
    // Example with Nodemailer:
    // const transporter = nodemailer.createTransport({ ... })
    // await transporter.sendMail({ ... })

    console.log('Contact form submission:', {
      from: data.email,
      name: data.name,
      subject: data.subject,
      message: data.message.substring(0, 100) + '...',
    })

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will respond shortly.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
