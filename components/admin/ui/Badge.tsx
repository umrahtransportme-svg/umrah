import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'
  className?: string
}

const VARIANTS: Record<NonNullable<Props['variant']>, string> = {
  default: 'bg-brand-50 text-brand-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger:  'bg-red-50 text-red-700',
  info:    'bg-blue-50 text-blue-700',
  muted:   'bg-slate-100 text-slate-500',
}

export default function AdminBadge({ children, variant = 'default', className }: Props) {
  return (
    <span className={cn('badge text-xs', VARIANTS[variant], className)}>
      {children}
    </span>
  )
}
