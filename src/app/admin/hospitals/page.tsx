'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { createClient } from '@supabase/supabase-js'
import type { Hospital } from '@/types'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const supabase = getClient()
      let query = supabase
        .from('hospitals')
        .select('*')
        .order('created_at', { ascending: false })

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data } = await query
      setHospitals((data ?? []) as Hospital[])
      setLoading(false)
    }
    run()
  }, [search])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    const supabase = getClient()
    await supabase.from('hospitals').delete().eq('id', id)
    setHospitals((prev) => prev.filter((h) => h.id !== id))
    setDeleting(null)
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
              >
                Hospitals
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: 'var(--fg-muted)' }}
              >
                {hospitals.length} total entries
              </p>
            </div>
            <Link href="/admin/hospitals/new" className="btn-primary">
              <Plus size={14} />
              Add Hospital
            </Link>
          </div>

          <div className="relative mb-5">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--fg-subtle)' }}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospitals..."
              className="input-base pl-10"
            />
          </div>

          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--border)' }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--bg-soft)' }}>
                  {['Hospital', 'City', 'Ownership', 'Rating', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr
                      key={i}
                      style={{ borderTop: '1px solid var(--border)' }}
                    >
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="skeleton h-4 rounded w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : hospitals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      No hospitals found
                    </td>
                  </tr>
                ) : (
                  hospitals.map((hospital) => (
                    <tr
                      key={hospital.id}
                      style={{ borderTop: '1px solid var(--border)' }}
                    >
                      <td className="px-4 py-3">
                        <p
                          className="font-medium"
                          style={{ color: 'var(--fg)' }}
                        >
                          {hospital.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: 'var(--fg-subtle)' }}
                        >
                          {hospital.state}
                        </p>
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        {hospital.city}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`badge ${
                            hospital.ownership === 'public'
                              ? 'badge-public'
                              : 'badge-private'
                          }`}
                        >
                          {hospital.ownership}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        {hospital.rating_avg > 0
                          ? `★ ${hospital.rating_avg.toFixed(1)}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/hospitals/${hospital.id}/edit`}
                            className="p-1.5 rounded-lg transition-colors hover:bg-blue-50"
                            aria-label={`Edit ${hospital.name}`}
                          >
                            <Pencil
                              size={14}
                              style={{ color: 'var(--accent)' }}
                            />
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(hospital.id, hospital.name)
                            }
                            disabled={deleting === hospital.id}
                            className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                            aria-label={`Delete ${hospital.name}`}
                          >
                            <Trash2 size={14} style={{ color: 'var(--red)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
