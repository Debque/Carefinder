import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Hospital, SearchFilters } from '@/types'

function getClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function searchHospitals(
  filters: Partial<SearchFilters>
): Promise<Hospital[]> {
  const supabase = getClient()

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
    query = query.order('rating_avg', { ascending: false })
  } else {
    query = query.order('name', { ascending: true })
  }

  query = query.limit(50)

  const { data, error } = await query
  if (error) {
    console.error('searchHospitals error:', error)
    return []
  }
  return (data ?? []) as Hospital[]
}

export async function getHospitalById(id: string): Promise<Hospital | null> {
  const supabase = getClient()

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
