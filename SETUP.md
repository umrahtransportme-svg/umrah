# Umrah Transport — Setup Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your WhatsApp number, email, etc.

# 3. Run development server
npm run dev
```

Open http://localhost:3000

## Configuration

### 1. WhatsApp Number (Critical)
In `.env.local`, set your WhatsApp Business number (digits only, no +):
```
NEXT_PUBLIC_WHATSAPP_NUMBER=447700000000
```

### 2. Business Info
Edit `lib/config.ts` to update:
- Business phone
- Business email
- Social media links
- Pricing

### 3. Pricing
Edit `lib/config.ts` — the `PRICING` object:
```typescript
export const PRICING = {
  airportTransfer: { sedan: 45, suv: 65, van: 85 },
  intercityTransfer: { sedan: 85, suv: 115, van: 145 },
  // ...
}
```

## Deployment (Vercel)

```bash
npm install -g vercel
vercel --prod
```

Add environment variables in the Vercel dashboard.

## Project Structure

```
app/                    # Next.js App Router pages
├── page.tsx            # Homepage
├── book/               # Booking form page
├── services/           # Service pages
├── about/              # About page
├── contact/            # Contact page
└── api/                # API routes

components/
├── layout/             # Header, Footer
├── sections/           # Homepage sections
├── booking/            # Booking form
└── ui/                 # Reusable UI components

lib/
├── config.ts           # Business configuration & pricing
├── utils.ts            # Utility functions
└── whatsapp.ts         # WhatsApp URL generation

types/
└── index.ts            # TypeScript types
```

## Customisation

### Colors
Edit `tailwind.config.ts` — the `brand` color palette.

### Fonts
Edit `app/layout.tsx` — the `Inter` font import.

### Content
- Hero text: `components/sections/Hero.tsx`
- Services: `components/sections/ServicesSection.tsx`
- Testimonials: `components/sections/Testimonials.tsx`
- Pricing tables: individual service pages in `app/services/`

## WhatsApp Integration

All "Book Now" and "WhatsApp Us" buttons generate a WhatsApp click-to-chat
URL with a pre-filled message. Update the phone number in `.env.local`.

The booking form's final step sends the booking summary via WhatsApp.

## Adding Email Confirmation

Install nodemailer:
```bash
npm install nodemailer @types/nodemailer
```

Then update `app/api/bookings/route.ts` with your SMTP configuration.
