interface StarRatingProps {
  rating: number
  count?: number
  size?: 'sm' | 'md'
}

export function StarRating({ rating, count, size = 'sm' }: StarRatingProps) {
  const starSize = size === 'sm' ? 12 : 16

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width={starSize}
            height={starSize}
            viewBox="0 0 24 24"
            fill={star <= Math.round(rating) ? '#F59E0B' : 'none'}
            stroke={star <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
            strokeWidth="2"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
      </div>
      <span
        className="font-semibold"
        style={{
          fontSize: size === 'sm' ? '12px' : '14px',
          color: 'var(--fg)',
        }}
      >
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span style={{ fontSize: '11px', color: 'var(--fg-subtle)' }}>
          ({count})
        </span>
      )}
    </div>
  )
}
