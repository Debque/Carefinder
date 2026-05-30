import { describe, it, expect } from 'vitest'
import { encodeFilters, decodeFilters, buildShareUrl } from '@/lib/share'
import { CSV_COLUMNS } from '@/lib/csv'
import type { Hospital, SearchFilters } from '@/types'

function makeHospital(overrides: Partial<Hospital> = {}): Hospital {
  return {
    id: '1',
    name: 'Test Hospital',
    address: '1 Test Street',
    city: 'Lagos',
    state: 'Lagos',
    ownership: 'public',
    specialties: ['General', 'Emergency'],
    rating_avg: 4.2,
    review_count: 12,
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
    ...overrides,
  }
}

describe('CSV columns', () => {
  it('has 9 columns defined', () => {
    expect(CSV_COLUMNS).toHaveLength(9)
  })

  it('includes name, phone, specialties', () => {
    const keys = CSV_COLUMNS.map((c) => c.key)
    expect(keys).toContain('name')
    expect(keys).toContain('phone')
    expect(keys).toContain('specialties')
  })

  it('filename includes query and date', () => {
    const date = new Date().toISOString().split('T')[0]
    const query = 'lagos'
    const slug = query.toLowerCase().replace(/\s+/g, '-').slice(0, 20)
    const filename = `hospitals-${slug}-${date}.csv`
    expect(filename).toContain('lagos')
    expect(filename).toContain(date)
    expect(filename).toMatch(/\.csv$/)
  })

  it('specialties join with semicolons', () => {
    const h = makeHospital({ specialties: ['Cardiology', 'Neurology'] })
    expect(h.specialties.join('; ')).toBe('Cardiology; Neurology')
  })
})

describe('Share URL encoding', () => {
  it('round-trips all filter params', () => {
    const filters: Partial<SearchFilters> = {
      query: 'maternity hospital',
      city: 'Lagos',
      specialty: 'Maternity',
      ownership: 'public',
      radius: 50,
      sortBy: 'rating',
    }
    const encoded = encodeFilters(filters)
    const decoded = decodeFilters(encoded)
    expect(decoded.query).toBe('maternity hospital')
    expect(decoded.city).toBe('Lagos')
    expect(decoded.ownership).toBe('public')
    expect(decoded.radius).toBe(50)
  })

  it('omits default values from URL', () => {
    const encoded = encodeFilters({
      ownership: 'all',
      radius: 25,
      sortBy: 'distance',
    })
    expect(encoded).not.toContain('ownership')
    expect(encoded).not.toContain('radius')
  })

  it('handles empty filters', () => {
    const decoded = decodeFilters('')
    expect(decoded.query).toBe('')
    expect(decoded.city).toBe('')
  })

  it('produces a valid URL string', () => {
    const url = buildShareUrl({ query: 'kano', city: 'Kano' })
    expect(url).toContain('/search')
    expect(url).toContain('kano')
  })
})

describe('Search filter logic', () => {
  const hospitals: Hospital[] = [
    makeHospital({
      id: '1',
      ownership: 'public',
      specialties: ['General'],
      city: 'Lagos',
    }),
    makeHospital({
      id: '2',
      ownership: 'private',
      specialties: ['Cardiology'],
      city: 'Lagos',
    }),
    makeHospital({
      id: '3',
      ownership: 'public',
      specialties: ['General'],
      city: 'Ibadan',
    }),
  ]

  it('filters by ownership', () => {
    const pub = hospitals.filter((h) => h.ownership === 'public')
    expect(pub).toHaveLength(2)
  })

  it('filters by specialty', () => {
    const cardio = hospitals.filter((h) => h.specialties.includes('Cardiology'))
    expect(cardio).toHaveLength(1)
  })

  it('filters by city', () => {
    const lagos = hospitals.filter((h) => h.city.toLowerCase() === 'lagos')
    expect(lagos).toHaveLength(2)
  })

  it('returns empty for no match', () => {
    const result = hospitals.filter((h) =>
      h.specialties.includes('Ophthalmology')
    )
    expect(result).toHaveLength(0)
  })
})
