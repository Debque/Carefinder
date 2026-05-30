import type { Hospital } from '@/types'

export type CsvColumn =
  | 'name'
  | 'address'
  | 'city'
  | 'state'
  | 'phone'
  | 'email'
  | 'ownership'
  | 'specialties'
  | 'rating'

export const CSV_COLUMNS: { key: CsvColumn; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'ownership', label: 'Ownership' },
  { key: 'specialties', label: 'Specialties' },
  { key: 'rating', label: 'Rating' },
]

function getField(hospital: Hospital, key: CsvColumn): string {
  switch (key) {
    case 'name':
      return hospital.name
    case 'address':
      return hospital.address
    case 'city':
      return hospital.city
    case 'state':
      return hospital.state
    case 'phone':
      return hospital.phone ?? ''
    case 'email':
      return hospital.email ?? ''
    case 'ownership':
      return hospital.ownership
    case 'specialties':
      return hospital.specialties.join('; ')
    case 'rating':
      return hospital.rating_avg > 0 ? hospital.rating_avg.toFixed(1) : ''
    default:
      return ''
  }
}

export function exportToCsv(
  hospitals: Hospital[],
  columns: CsvColumn[],
  query = ''
): void {
  const headers = columns.map(
    (key) => CSV_COLUMNS.find((c) => c.key === key)?.label ?? key
  )
  const rows = hospitals.map((h) => columns.map((key) => getField(h, key)))

  const escape = (val: string) =>
    val.includes(',') || val.includes('"') || val.includes('\n')
      ? `"${val.replace(/"/g, '""')}"`
      : val

  const csv = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().split('T')[0]
  const slug = query
    ? query.toLowerCase().replace(/\s+/g, '-').slice(0, 20) + '-'
    : ''

  const link = document.createElement('a')
  link.href = url
  link.download = `hospitals-${slug}${date}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
