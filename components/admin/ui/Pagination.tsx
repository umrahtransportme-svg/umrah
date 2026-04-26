import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  totalItems?: number
  pageSize?: number
}

export default function AdminPagination({ page, totalPages, onPageChange, totalItems, pageSize }: Props) {
  if (totalPages <= 1) return null

  const start = pageSize ? (page - 1) * pageSize + 1 : undefined
  const end = pageSize && totalItems ? Math.min(page * pageSize, totalItems) : undefined

  return (
    <div className="flex items-center justify-between px-1 py-2">
      {totalItems && start && end ? (
        <p className="text-xs text-slate-500">Showing {start}–{end} of {totalItems}</p>
      ) : <div />}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn('p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-7 h-7 rounded-lg text-xs font-medium transition-colors',
              p === page ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
