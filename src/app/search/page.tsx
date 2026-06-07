'use client'

import { Suspense } from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Map, List, Search as SearchIcon } from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { SearchBar } from '@/components/search/SearchBar'
import { ResultsList } from '@/components/search/ResultsList'
import { searchHospitals } from '@/lib/supabase/queries'
import { decodeFilters } from '@/lib/share'
import type { Hospital, SearchFilters } from '@/types'
import dynamic from 'next/dynamic'
import { ExportButton } from '@/components/shared/ExportButton'
import { ShareButton } from '@/components/shared/ShareButton'
import { FilterPanel } from '@/components/search/FilterPanel'

const MapView = dynamic(
  () =>
    import('@/components/hospital/HospitalMap').then((m) => ({
      default: m.HospitalMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-2xl border flex items-center justify-center"
        style={{
          height: 480,
          borderColor: 'var(--border)',
          background: 'var(--bg-soft)',
        }}
      >
        <p style={{ color: 'var(--fg-muted)' }}>Loading map...</p>
      </div>
    ),
  }
)

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  city: '',
  specialty: '',
  ownership: 'all',
  radius: 25,
  sortBy: 'rating',
}

function SearchPage() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<'list' | 'map'>('list')
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    ...decodeFilters(searchParams.toString()),
  })

  const updateFilters = useCallback((patch: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const runSearch = useCallback(async () => {
    setLoading(true)
    const results = await searchHospitals(filters)
    setHospitals(results)
    setLoading(false)
  }, [filters])

  useEffect(() => {
    const t = setTimeout(runSearch, 600)
    return () => clearTimeout(t)
  }, [runSearch])

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg)' }}
    >
      <Navbar />

      {/* Page header */}
      <div
        className="border-b px-4 sm:px-6 py-5"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}
      >
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-2xl font-bold animate-fadeUp"
            style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
          >
            Find hospitals near you
          </h1>
          <p
            className="text-sm mt-0.5 animate-fadeUp delay-100"
            style={{ color: 'var(--fg-muted)' }}
          >
            Search across Nigeria — filter by city, specialty, and ownership
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-5">
        <div className="flex gap-5">
          {/* Filter sidebar */}
          <aside
            className="hidden lg:flex flex-col gap-4 flex-shrink-0 rounded-2xl p-5 border self-start sticky top-20"
            style={{
              width: 260,
              background: 'var(--bg-card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <p className="section-label mb-3">Filters</p>
              <SearchBar
                value={filters.query}
                onChange={(q) => updateFilters({ query: q })}
              />
            </div>
            <div
              className="border-t pt-4"
              style={{ borderColor: 'var(--border)' }}
            >
              <FilterPanel filters={filters} onChange={updateFilters} />
            </div>
            <button
              onClick={runSearch}
              className="btn-primary w-full justify-center mt-1"
            >
              <SearchIcon size={14} />
              Search Hospitals
            </button>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Mobile search */}
            <div className="lg:hidden">
              <SearchBar
                value={filters.query}
                onChange={(q) => updateFilters({ query: q })}
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div
                className="flex rounded-lg border overflow-hidden"
                style={{ borderColor: 'var(--border)' }}
                role="tablist"
              >
                {(['list', 'map'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    role="tab"
                    aria-selected={view === v}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors"
                    style={{
                      background:
                        view === v ? 'var(--accent)' : 'var(--bg-card)',
                      color: view === v ? 'white' : 'var(--fg-muted)',
                    }}
                  >
                    {v === 'list' ? <List size={14} /> : <Map size={14} />}
                    {v === 'list' ? 'List' : 'Map'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <ExportButton hospitals={hospitals} query={filters.query} />
                <ShareButton filters={filters} hospitals={hospitals} />
              </div>
            </div>

            {/* Results or Map */}
            {view === 'list' ? (
              <ResultsList
                hospitals={hospitals}
                loading={loading}
                selectedId={selectedId}
                onSelect={setSelectedId}
                sortBy={filters.sortBy}
                onSortChange={(s) => updateFilters({ sortBy: s })}
                total={hospitals.length}
              />
            ) : (
              <MapView
                hospitals={hospitals}
                selectedId={selectedId}
                onSelect={setSelectedId}
                radiusKm={filters.radius}
                userLat={filters.lat}
                userLng={filters.lng}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="sticky bottom-0 border-t px-4 sm:px-6 py-3"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border)',
          boxShadow: '0 -4px 20px rgba(13,27,42,0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-end">
          <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
            {hospitals.length} results · Carefinder Nigeria
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SearchPageWrapper() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--bg)' }}
        >
          <div className="text-center">
            <div className="skeleton w-32 h-4 rounded mx-auto mb-3" />
            <p style={{ color: 'var(--fg-muted)' }}>Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  )
}
