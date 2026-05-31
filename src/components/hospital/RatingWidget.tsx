'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

interface RatingWidgetProps {
  hospitalId: string
  onSubmit?: (rating: number) => void
}

export function RatingWidget({ hospitalId, onSubmit }: RatingWidgetProps) {
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

    const supabase = getClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Please log in to leave a review')
      setSubmitting(false)
      return
    }

    const { error: submitError } = await supabase.from('reviews').insert({
      hospital_id: hospitalId,
      user_id: user.id,
      rating: selected,
      content: content || null,
      status: 'pending',
    })

    if (submitError) {
      setError('Failed to submit review. Please try again.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    onSubmit?.(selected)
    setSubmitting(false)
  }

  if (submitted) {
    return (
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
    )
  }

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <p className="section-label mb-4">Leave a Review</p>

      {/* Star selector */}
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
          <span className="text-sm ml-2" style={{ color: 'var(--fg-muted)' }}>
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][selected]}
          </span>
        )}
      </div>

      {/* Review text */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your experience (optional)..."
        className="input-base resize-none mb-3"
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
    </div>
  )
}
