'use client'

import { useState } from 'react'
import { HospitalCard } from '@/components/hospital/HospitalCard'
import type { Hospital, SearchFilters } from '@/types'
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 10

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
      className="flex gap-4 p-4 rounded-2xl border"
      style={{ borderColor: 'var(--border)' }}
    >
      <div
        className="skeleton rounded-xl flex-shrink-0"
        style={{ width: 80, height: 80 }}
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
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(hospitals.length / PAGE_SIZE)
  const paginated = hospitals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSortChange = (s: SearchFilters['sortBy']) => {
    setPage(1)
    onSortChange(s)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
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
              handleSortChange(e.target.value as SearchFilters['sortBy'])
            }
            className="text-xs font-semibold border outline-none cursor-pointer rounded-lg px-2 py-1"
            style={{
              color: 'var(--fg)',
              background: 'var(--bg-card)',
              borderColor: 'var(--border)',
            }}
            aria-label="Sort results"
          >
            <option value="distance">Distance</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : hospitals.length === 0 ? (
        <div
          className="text-center py-12 rounded-2xl border"
          style={{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
        >
          <div className="text-3xl mb-2">🏥</div>
          <p className="font-medium">No hospitals found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--fg-subtle)' }}>
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {paginated.map((h) => (
              <HospitalCard
                key={h.id}
                hospital={h}
                isSelected={selectedId === h.id}
                onClick={() => onSelect(h.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3">
              <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
                Page {page} of {totalPages} · {hospitals.length} results
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all disabled:opacity-40"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--fg-muted)',
                  }}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-semibold transition-all"
                      style={{
                        borderColor:
                          page === p ? 'var(--accent)' : 'var(--border)',
                        background:
                          page === p ? 'var(--accent)' : 'var(--bg-card)',
                        color: page === p ? 'white' : 'var(--fg-muted)',
                      }}
                      aria-label={`Page ${p}`}
                      aria-current={page === p ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all disabled:opacity-40"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--fg-muted)',
                  }}
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
