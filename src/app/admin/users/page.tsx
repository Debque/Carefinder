'use client'

import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { createClient } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
}

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const supabase = getClient()
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setUsers((data ?? []) as User[])
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
              Registered users who have left reviews
            </p>
          </div>

          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--border)' }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--bg-soft)' }}>
                  {['Email', 'Joined', 'Last Sign In'].map((h) => (
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
                      No users yet
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      style={{ borderTop: '1px solid var(--border)' }}
                    >
                      <td className="px-4 py-3" style={{ color: 'var(--fg)' }}>
                        {user.email}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: 'var(--fg-muted)' }}
                      >
                        {user.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : '—'}
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
