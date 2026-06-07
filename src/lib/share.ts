import type { SearchFilters } from '@/types'

export function encodeFilters(filters: Partial<SearchFilters>): string {
  const params = new URLSearchParams()
  if (filters.query) params.set('q', filters.query)
  if (filters.city) params.set('city', filters.city)
  if (filters.specialty) params.set('specialty', filters.specialty)
  if (filters.ownership && filters.ownership !== 'all')
    params.set('ownership', filters.ownership)
  if (filters.radius && filters.radius !== 25)
    params.set('radius', String(filters.radius))
  if (filters.sortBy && filters.sortBy !== 'rating')
    params.set('sort', filters.sortBy)
  return params.toString()
}

export function decodeFilters(search: string): Partial<SearchFilters> {
  const params = new URLSearchParams(search)
  return {
    query: params.get('q') ?? '',
    city: params.get('city') ?? '',
    specialty: params.get('specialty') ?? '',
    ownership: (params.get('ownership') as SearchFilters['ownership']) ?? 'all',
    radius: Number(params.get('radius') ?? 25),
    sortBy: (params.get('sort') as SearchFilters['sortBy']) ?? 'rating',
  }
}

export function buildShareUrl(filters: Partial<SearchFilters>): string {
  const qs = encodeFilters(filters)
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://carefinder.ng'
  return `${base}/search${qs ? `?${qs}` : ''}`
}
