import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: string | number
  change?: string | number
  changeLabel?: string
  icon: React.ReactNode
  iconBg: string
}

export default function AdminStatCard({ title, value, change, changeLabel = 'vs last month', icon, iconBg }: Props) {
  const changeStr = typeof change === 'number'
    ? (change > 0 ? `+${change}%` : change < 0 ? `${change}%` : '0%')
    : change
  const isPositive = typeof change === 'number' ? change > 0 : changeStr?.startsWith('+')
  const isNegative = typeof change === 'number' ? change < 0 : changeStr?.startsWith('-')

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-green-700' : isNegative ? 'text-red-600' : 'text-slate-500')}>
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {changeStr}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{title}</div>
      {change !== undefined && <div className="text-xs text-slate-400 mt-0.5">{changeLabel}</div>}
    </div>
  )
}
