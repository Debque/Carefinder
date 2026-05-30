'use client'

import { HospitalCard } from '@/components/hospital/HospitalCard'
import type { Hospital, SearchFilters } from '@/types'
import { ArrowUpDown } from 'lucide-react'

interface ResultsListProps {
  hospitals: Hospital[]
  loading: boolean
  selectedId: string | null
  onSelect: (id: string) => void
  sortBy: SearchFilters['sortBy']
  onSortChange: (s: SearchFilters['sortBy']) => void
  total: number
}

function CardSkeleton() {
  return (
    <div
      className="flex gap-3 p-3 rounded-xl border"
      style={{ borderColor: 'var(--border)' }}
    >
      <div
        className="skeleton rounded-lg flex-shrink-0"
        style={{ width: 72, height: 72 }}
      />
      <div className="flex-1 flex flex-col gap-2 pt-1">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex gap-1.5 mt-1">
          <div className="skeleton h-4 w-14 rounded-full" />
          <div className="skeleton h-4 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ResultsList({
  hospitals,
  loading,
  selectedId,
  onSelect,
  sortBy,
  onSortChange,
  total,
}: ResultsListProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: 'var(--fg-muted)' }}>
          {loading ? (
            <span className="skeleton inline-block w-32 h-4 rounded" />
          ) : (
            <span>
              <strong style={{ color: 'var(--fg)' }}>{total}</strong> hospitals
              found
            </span>
          )}
        </p>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown size={13} style={{ color: 'var(--fg-subtle)' }} />
          <span className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
            Sort by
          </span>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as SearchFilters['sortBy'])
            }
            className="text-xs font-semibold border-none outline-none cursor-pointer bg-transparent"
            style={{ color: 'var(--fg)' }}
            aria-label="Sort results"
          >
            <option value="distance">Distance</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : hospitals.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl border"
          style={{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
        >
          <div className="text-3xl mb-2">🏥</div>
          <p className="font-medium">No hospitals found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--fg-subtle)' }}>
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {hospitals.map((h) => (
            <HospitalCard
              key={h.id}
              hospital={h}
              isSelected={selectedId === h.id}
              onClick={() => onSelect(h.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
