'use client'

import { useState } from 'react'
import { getBrowserClient } from '@/lib/supabase/browser'
import { StarRating } from '@/components/shared/StarRating'

interface Review {
  id: string
  rating: number
  content: string | null
  created_at: string
}

interface RatingWidgetProps {
  hospitalId: string
  initialReviews: Review[]
  onSubmit?: (rating: number) => void
}

export function RatingWidget({
  hospitalId,
  initialReviews,
  onSubmit,
}: RatingWidgetProps) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (selected === 0) {
      setError('Please select a rating')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const supabase = getBrowserClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        window.location.href = '/login?redirect=' + window.location.pathname
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const { error: submitError } = await db.from('reviews').insert({
        hospital_id: hospitalId,
        user_id: session.user.id,
        rating: selected,
        content: content || null,
        status: 'pending',
      })
      if (submitError) {
        setError(submitError.message)
        setSubmitting(false)
        return
      }
      setSubmitted(true)
      onSubmit?.(selected)
    } catch {
      setError('Failed to submit. Please try again.')
    }
    setSubmitting(false)
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  return (
    <div className="flex flex-col gap-5">
      {/* Approved reviews — server-fetched, visible to everyone */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <p className="section-label mb-4">
          Reviews{initialReviews.length > 0 && ` (${initialReviews.length})`}
        </p>

        {initialReviews.length === 0 ? (
          <div
            className="text-center py-8 rounded-xl border"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-soft)',
            }}
          >
            <p className="text-2xl mb-2">💬</p>
            <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
              No reviews yet
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--fg-muted)' }}>
              Be the first to share your experience
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {initialReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border p-4"
                style={{
                  background: 'var(--bg-soft)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <StarRating rating={review.rating} size="sm" />
                  <span
                    className="text-xs"
                    style={{ color: 'var(--fg-subtle)' }}
                  >
                    {formatDate(review.created_at)}
                  </span>
                </div>
                {review.content && (
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {review.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leave a review */}
      {submitted ? (
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="text-3xl mb-2">⭐</div>
          <p className="font-semibold" style={{ color: 'var(--fg)' }}>
            Review submitted!
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
            Your review is pending moderation. Thank you!
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl border p-5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <p className="section-label mb-4">Leave a Review</p>

          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setSelected(star)}
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                className="transition-transform hover:scale-110"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill={star <= (hovered || selected) ? '#F59E0B' : 'none'}
                  stroke={star <= (hovered || selected) ? '#F59E0B' : '#D1D5DB'}
                  strokeWidth="2"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </button>
            ))}
            {selected > 0 && (
              <span
                className="text-sm ml-2"
                style={{ color: 'var(--fg-muted)' }}
              >
                {
                  ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][
                    selected
                  ]
                }
              </span>
            )}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience (optional)..."
            className="input-base resize-none mb-1"
            rows={3}
            maxLength={500}
          />
          <p
            className="text-xs mb-3 text-right"
            style={{ color: 'var(--fg-subtle)' }}
          >
            {content.length}/500
          </p>

          {error && (
            <p
              className="text-xs px-3 py-2 rounded-lg mb-3"
              style={{ background: '#FEE2E2', color: '#DC2626' }}
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || selected === 0}
            className="btn-primary w-full justify-center"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>

          <p
            className="text-xs mt-3 text-center"
            style={{ color: 'var(--fg-subtle)' }}
          >
            You must be logged in to submit.{' '}
            <a href="/login" style={{ color: 'var(--accent)' }}>
              Log in here
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
