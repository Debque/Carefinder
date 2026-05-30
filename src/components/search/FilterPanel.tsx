'use client'

import { MapPin, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { SearchFilters } from '@/types'

const SPECIALTIES = [
  'All Specialties',
  'General',
  'Emergency',
  'Maternity',
  'Pediatrics',
  'Cardiology',
  'Neurology',
  'Surgery',
  'Dental',
  'Oncology',
  'Teaching',
]

interface FilterPanelProps {
  filters: SearchFilters
  onChange: (filters: Partial<SearchFilters>) => void
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported')
      return
    }
    setLocating(true)
    setLocError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        setLocError('Location access denied')
        setLocating(false)
      },
      { timeout: 8000 }
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label
          className="block text-xs font-semibold mb-1.5"
          style={{ color: 'var(--fg-muted)' }}
        >
          City / State / LGA
        </label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="Enter City, State or LGA"
          className="input-base"
          aria-label="Filter by city"
        />
      </div>

      <div>
        <label
          className="block text-xs font-semibold mb-1.5"
          style={{ color: 'var(--fg-muted)' }}
        >
          Within{' '}
          <span style={{ color: 'var(--accent)' }}>{filters.radius} km</span>
        </label>
        <input
          type="range"
          min={5}
          max={100}
          step={5}
          value={filters.radius}
          onChange={(e) => onChange({ radius: Number(e.target.value) })}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: 'var(--accent)' }}
          aria-label="Search radius in km"
        />
        <div
          className="flex justify-between text-xs mt-1"
          style={{ color: 'var(--fg-subtle)' }}
        >
          <span>5 km</span>
          <span>100 km</span>
        </div>
      </div>

      <div>
        <label
          className="block text-xs font-semibold mb-1.5"
          style={{ color: 'var(--fg-muted)' }}
        >
          Specialty
        </label>
        <select
          value={filters.specialty || 'All Specialties'}
          onChange={(e) =>
            onChange({
              specialty:
                e.target.value === 'All Specialties' ? '' : e.target.value,
            })
          }
          className="input-base"
          aria-label="Filter by specialty"
        >
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="block text-xs font-semibold mb-1.5"
          style={{ color: 'var(--fg-muted)' }}
        >
          Ownership
        </label>
        <select
          value={filters.ownership}
          onChange={(e) =>
            onChange({
              ownership: e.target.value as SearchFilters['ownership'],
            })
          }
          className="input-base"
          aria-label="Filter by ownership"
        >
          <option value="all">All Ownerships</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <button
        onClick={requestLocation}
        disabled={locating}
        className="flex items-center gap-2 text-sm font-medium py-1"
        style={{ color: 'var(--accent)' }}
        aria-live="polite"
      >
        {locating ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <MapPin size={14} />
        )}
        {locating ? 'Locating...' : 'Use my current location'}
      </button>

      {locError && (
        <p className="text-xs" style={{ color: 'var(--red)' }}>
          {locError}
        </p>
      )}
    </div>
  )
}
