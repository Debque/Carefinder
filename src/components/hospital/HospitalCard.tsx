'use client'

import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  const handleClick = () => {
    onClick?.()
    router.push(`/hospitals/${hospital.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="group flex gap-4 p-4 rounded-2xl cursor-pointer"
      style={{
        background: isSelected ? 'var(--accent-subtle)' : 'var(--bg-card)',
        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: 'var(--shadow-sm)',
        transition:
          'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 12px 32px rgba(91,80,240,0.18)'
        el.style.borderColor = 'var(--accent)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'var(--shadow-sm)'
        el.style.borderColor = isSelected ? 'var(--accent)' : 'var(--border)'
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${hospital.name}`}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Thumbnail */}
      <div
        className="flex-shrink-0 rounded-xl overflow-hidden"
        style={{ width: 80, height: 80, background: 'var(--bg-soft)' }}
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
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
        <p
          className="font-bold text-sm leading-snug mb-0.5"
          style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
        >
          {hospital.name}
        </p>

        <div
          className="flex items-center gap-1 mb-2"
          style={{ color: 'var(--fg-muted)' }}
        >
          <MapPin size={11} />
          <p className="text-xs truncate">
            {hospital.city}, {hospital.state}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mb-2">
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

        <div className="flex items-center justify-between">
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
            <span
              className="text-xs font-medium"
              style={{ color: 'var(--fg-muted)' }}
            >
              {hospital.distance_km < 1
                ? `${Math.round(hospital.distance_km * 1000)}m`
                : `${hospital.distance_km.toFixed(1)} km`}
            </span>
          )}
        </div>

        {hospital.phone && (
          <div className="flex items-center gap-1 mt-1.5">
            <Phone size={10} color="var(--fg-subtle)" />
            <span className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
              {hospital.phone}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
