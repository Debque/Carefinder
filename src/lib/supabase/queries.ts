import { getBrowserClient } from './browser'
import type { Hospital, SearchFilters } from '@/types'

export async function searchHospitals(
  filters: Partial<SearchFilters>
): Promise<Hospital[]> {
  const supabase = getBrowserClient()

  let query = supabase
    .from('hospitals_with_coords')
    .select(`*, images:hospital_images(id, url, alt)`)

  if (filters.query) {
    query = query.or(
      `name.ilike.%${filters.query}%,city.ilike.%${filters.query}%,lga.ilike.%${filters.query}%`
    )
  }
  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`)
  }
  if (filters.specialty && filters.specialty !== 'all') {
    query = query.contains('specialties', [filters.specialty])
  }
  if (filters.ownership && filters.ownership !== 'all') {
    query = query.eq('ownership', filters.ownership)
  }
  if (filters.sortBy === 'name') {
    query = query.order('name', { ascending: true })
  } else if (filters.sortBy === 'rating') {
    query = query.order('rating_avg', { ascending: false, nullsFirst: false })
  } else if (filters.sortBy === 'distance') {
    query = query.order('name', { ascending: true }) // fallback since distance needs user coords
  } else {
    query = query.order('rating_avg', { ascending: false, nullsFirst: false })
  }

  query = query.limit(200)

  const { data, error } = await query
  if (error) {
    console.error('searchHospitals error:', error)
    return []
  }
  return (data ?? []) as Hospital[]
}

export async function getHospitalById(id: string): Promise<Hospital | null> {
  const supabase = getBrowserClient()

  const { data, error } = await supabase
    .from('hospitals_with_coords')
    .select(`*, images:hospital_images(id, url, alt)`)
    .eq('id', id)
    .single()

  if (error) {
    console.error('getHospitalById error:', error)
    return null
  }
  return data as Hospital
}
