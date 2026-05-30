export interface Hospital {
  id: string
  name: string
  address: string
  city: string
  state: string
  lga?: string
  phone?: string
  email?: string
  website?: string
  ownership: 'public' | 'private'
  specialties: string[]
  visiting_hours?: string
  description?: string
  rating_avg: number
  review_count: number
  location?: { lat: number; lng: number }
  images?: HospitalImage[]
  created_at: string
  updated_at: string
  distance_km?: number
}

export interface HospitalImage {
  id: string
  hospital_id: string
  url: string
  alt?: string
}

export interface Review {
  id: string
  hospital_id: string
  user_id: string
  rating: number
  content?: string
  status: 'pending' | 'approved' | 'hidden'
  created_at: string
}

export interface SearchFilters {
  query: string
  city: string
  specialty: string
  ownership: 'all' | 'public' | 'private'
  radius: number
  lat?: number
  lng?: number
  sortBy: 'distance' | 'name' | 'rating'
}
