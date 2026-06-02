'use client'

import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { createClient } from '@supabase/supabase-js'

interface ReviewUser {
  user_id: string
  count: number
  latest: string
}

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ReviewUser[]>([])
  const [loading, setLoading] = useState(true)
  const [totalReviews, setTotalReviews] = useState(0)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const supabase = getClient()

      const { data, count } = await supabase
        .from('reviews')
        .select('user_id, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })

      setTotalReviews(count ?? 0)

      // Group by user_id
      const grouped: Record<string, { count: number; latest: string }> = {}
      for (const row of data ?? []) {
        if (!grouped[row.user_id]) {
          grouped[row.user_id] = { count: 0, latest: row.created_at }
        }
        grouped[row.user_id].count++
      }

      setUsers(
        Object.entries(grouped).map(([user_id, val]) => ({
          user_id,
          count: val.count,
          latest: val.latest,
        }))
      )
      setLoading(false)
    }
    run()
  }, [])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
            >
              Users
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--fg-muted)' }}>
              {users.length} users · {totalReviews} total reviews
            </p>
          </div>

          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--border)' }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--bg-soft)' }}>
                  {['User ID', 'Reviews', 'Latest Activity'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr
                      key={i}
                      style={{ borderTop: '1px solid var(--border)' }}
                    >
                      {[...Array(3)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="skeleton h-4 rounded w-32" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-12 text-center"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      No users have left reviews yet
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.user_id}
                      style={{ borderTop: '1px solid var(--border)' }}
                    >
                      <td
                        className="px-4 py-3 font-mono text-xs"
                        style={{ color: 'var(--fg)' }}
                      >
                        {user.user_id.slice(0, 16)}...
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        {user.count} review{user.count !== 1 ? 's' : ''}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        {new Date(user.latest).toLocaleDateString()}
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
