'use client'

import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getBrowserClient } from '@/lib/supabase/browser'
import { Check, EyeOff } from 'lucide-react'
import { StarRating } from '@/components/shared/StarRating'

interface Review {
  id: string
  hospital_id: string
  rating: number
  content: string | null
  status: 'pending' | 'approved' | 'hidden'
  created_at: string
  hospitals: { name: string } | null
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'hidden'>(
    'pending'
  )

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const supabase = getBrowserClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { data } = await db
        .from('reviews')
        .select('*, hospitals(name)')
        .eq('status', filter)
        .order('created_at', { ascending: false })
      setReviews((data ?? []) as Review[])
      setLoading(false)
    }
    run()
  }, [filter])

  const moderate = async (id: string, status: 'approved' | 'hidden') => {
    const supabase = getBrowserClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    await db.from('reviews').update({ status }).eq('id', id)
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
            >
              Review Moderation
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--fg-muted)' }}>
              Approve or hide user-submitted reviews
            </p>
          </div>

          {/* Filter tabs */}
          <div
            className="flex rounded-xl border overflow-hidden mb-5 w-fit"
            style={{ borderColor: 'var(--border)' }}
          >
            {(['pending', 'approved', 'hidden'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-4 py-2 text-sm font-medium capitalize transition-colors"
                style={{
                  background: filter === s ? 'var(--accent)' : 'var(--bg-card)',
                  color: filter === s ? 'white' : 'var(--fg-muted)',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Reviews list */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-24 rounded-2xl" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div
              className="text-center py-12 rounded-2xl border"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--fg-muted)',
              }}
            >
              <p className="font-medium">No {filter} reviews</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border p-4"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={review.rating} size="sm" />
                        <span
                          className="text-xs"
                          style={{ color: 'var(--fg-subtle)' }}
                        >
                          · {review.hospitals?.name ?? 'Unknown hospital'}
                        </span>
                      </div>
                      {review.content && (
                        <p
                          className="text-sm"
                          style={{ color: 'var(--fg-muted)' }}
                        >
                          {review.content}
                        </p>
                      )}
                      <p
                        className="text-xs mt-2"
                        style={{ color: 'var(--fg-subtle)' }}
                      >
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {filter === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moderate(review.id, 'approved')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{
                            background: '#DCFCE7',
                            color: '#166534',
                          }}
                          aria-label="Approve review"
                        >
                          <Check size={12} />
                          Approve
                        </button>
                        <button
                          onClick={() => moderate(review.id, 'hidden')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={{
                            background: '#FEE2E2',
                            color: '#DC2626',
                          }}
                          aria-label="Hide review"
                        >
                          <EyeOff size={12} />
                          Hide
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
