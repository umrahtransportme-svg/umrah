'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Calendar, Shield, Star } from 'lucide-react'

function SignInInner() {
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') || '/account'

  return (
    <div className="min-h-screen bg-section-alt flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-brand">
              <Calendar className="w-7 h-7 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your account</h1>
          <p className="text-slate-500 text-sm mb-8">
            Track bookings, manage your profile and save your preferences
          </p>

          {/* Google button */}
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:border-brand-300 hover:bg-brand-50 transition-all duration-200 group"
          >
            {/* Google SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-xs text-slate-400 mt-6">
            By signing in you agree to our{' '}
            <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
            {' '}and{' '}
            <Link href="/terms" className="text-brand-600 hover:underline">Terms</Link>.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-brand-500" />
            Secure login
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            4.9 rated service
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInInner />
    </Suspense>
  )
}
