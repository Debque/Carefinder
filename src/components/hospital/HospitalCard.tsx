import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import { StarRating } from '@/components/shared/StarRating'
import type { Hospital } from '@/types'

interface HospitalCardProps {
  hospital: Hospital
  isSelected?: boolean
  onClick?: () => void
}

export function HospitalCard({
  hospital,
  isSelected,
  onClick,
}: HospitalCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150"
      style={{
        background: isSelected ? 'var(--accent-subtle)' : 'var(--bg-card)',
        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: isSelected
          ? '0 0 0 2px rgba(91,80,240,0.15)'
          : 'var(--shadow-sm)',
      }}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Thumbnail */}
      <div
        className="flex-shrink-0 rounded-lg overflow-hidden"
        style={{ width: 72, height: 72, background: 'var(--bg-soft)' }}
      >
        {hospital.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hospital.images[0].url}
            alt={hospital.images[0].alt ?? hospital.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'var(--accent-subtle)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="var(--accent)"
                fillOpacity={0.3}
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/hospitals/${hospital.id}`}
          className="block font-semibold text-sm leading-snug hover:underline"
          style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {hospital.name}
        </Link>

        <p
          className="text-xs mt-0.5 truncate"
          style={{ color: 'var(--fg-muted)' }}
        >
          {hospital.city}, {hospital.state}
        </p>

        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span
            className={`badge ${
              hospital.ownership === 'public' ? 'badge-public' : 'badge-private'
            }`}
          >
            {hospital.ownership === 'public' ? 'Public' : 'Private'}
          </span>
          {hospital.specialties.slice(0, 2).map((s) => (
            <span key={s} className="badge badge-accent">
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-1.5">
          {hospital.rating_avg > 0 ? (
            <StarRating
              rating={hospital.rating_avg}
              count={hospital.review_count}
            />
          ) : (
            <span className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
              No reviews yet
            </span>
          )}
          {hospital.distance_km !== undefined && (
            <div className="flex items-center gap-1">
              <MapPin size={11} style={{ color: 'var(--fg-subtle)' }} />
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--fg-muted)' }}
              >
                {hospital.distance_km < 1
                  ? `${Math.round(hospital.distance_km * 1000)}m`
                  : `${hospital.distance_km.toFixed(1)} km`}
              </span>
            </div>
          )}
        </div>

        {hospital.phone && (
          <div className="flex items-center gap-1 mt-1">
            <Phone size={10} style={{ color: 'var(--fg-subtle)' }} />
            <span className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
              {hospital.phone}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
