'use client'

import { useState } from 'react'
import { Star, Send, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { MOCK_REVIEWS } from '@/lib/admin/mock-data'
import { cn } from '@/lib/utils'
import { formatDate, SERVICE_LABELS } from '@/lib/admin/utils'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [replyText, setReplyText] = useState<Record<string, string>>({})

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  function togglePublish(id: string) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isPublished: !r.isPublished } : r)))
  }

  function submitReply(id: string) {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, reply: replyText[id] || '', repliedAt: new Date().toISOString() } : r))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Average Rating', value: `${avgRating.toFixed(1)} ★`, sub: `${reviews.length} reviews` }, { label: 'Published', value: reviews.filter((r) => r.isPublished).length, sub: 'visible on website' }, { label: 'Awaiting Reply', value: reviews.filter((r) => !r.reply).length, sub: 'need response' }].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs font-medium text-slate-700 mt-0.5">{s.label}</div>
            <div className="text-xs text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="card p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">{review.customerName[0]}</div>
                  <div><div className="font-semibold text-slate-900 text-sm">{review.customerName}</div><div className="text-xs text-slate-400">{review.customerCountry} · {formatDate(review.createdAt)}</div></div>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={cn('w-3.5 h-3.5', i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200')} />))}
                  <span className="text-xs text-slate-500 ml-1">{SERVICE_LABELS[review.serviceType]}</span>
                </div>
                <h3 className="font-semibold text-slate-900">{review.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{review.body}</p>
              </div>
              <button onClick={() => togglePublish(review.id)} className={cn('w-7 h-7 flex items-center justify-center rounded-lg transition-colors flex-shrink-0', review.isPublished ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100')}>
                {review.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            {review.reply ? (
              <div className="flex items-start gap-2 bg-brand-50 border border-brand-100 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <div><div className="text-xs font-semibold text-brand-700 mb-0.5">Your reply</div><p className="text-xs text-slate-700">{review.reply}</p></div>
              </div>
            ) : (
              <div className="flex gap-2">
                <textarea rows={2} className="input text-xs flex-1 resize-none" placeholder="Write a reply..." value={replyText[review.id] || ''} onChange={(e) => setReplyText((prev) => ({ ...prev, [review.id]: e.target.value }))} />
                <button className="inline-flex items-center px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors self-end disabled:opacity-50" onClick={() => submitReply(review.id)} disabled={!replyText[review.id]}><Send className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
