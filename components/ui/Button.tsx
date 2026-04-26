'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  href?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  external?: boolean
}

const variants = {
  primary:
    'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-brand hover:shadow-brand-lg',
  secondary:
    'bg-white hover:bg-slate-50 text-brand-600 border border-brand-200 hover:border-brand-300',
  ghost:
    'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-3 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2',
  xl: 'px-8 py-4 text-base rounded-2xl gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled,
  loading,
  fullWidth,
  className,
  type = 'button',
  external = false,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-semibold transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  )

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
