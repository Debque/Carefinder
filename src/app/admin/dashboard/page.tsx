import { AdminSidebar } from '@/components/admin/AdminSidebar'
import Link from 'next/link'
import { Hospital, Star, Plus, ArrowRight } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
              >
                Dashboard
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: 'var(--fg-muted)' }}
              >
                Manage hospital entries and reviews
              </p>
            </div>
            <Link href="/admin/hospitals/new" className="btn-primary">
              <Plus size={14} />
              Add Hospital
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: 'Total Hospitals',
                value: '—',
                icon: Hospital,
                color: 'var(--accent)',
              },
              {
                label: 'Pending Reviews',
                value: '—',
                icon: Star,
                color: '#F59E0B',
              },
              {
                label: 'Published',
                value: '—',
                icon: Hospital,
                color: '#10B981',
              },
              {
                label: 'Draft',
                value: '—',
                icon: Hospital,
                color: 'var(--fg-subtle)',
              },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border p-4"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p
                      className="text-xs font-medium"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      {stat.label}
                    </p>
                    <Icon size={14} style={{ color: stat.color }} />
                  </div>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: 'Sora, sans-serif',
                      color: 'var(--fg)',
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/admin/hospitals"
              className="flex items-center justify-between p-5 rounded-2xl border transition-all hover:shadow-md"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent-subtle)' }}
                >
                  <Hospital size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: 'var(--fg)' }}
                  >
                    Manage Hospitals
                  </p>
                  <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                    Add, edit, or delete hospital entries
                  </p>
                </div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--fg-subtle)' }} />
            </Link>

            <Link
              href="/admin/reviews"
              className="flex items-center justify-between p-5 rounded-2xl border transition-all hover:shadow-md"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#FEF3C7' }}
                >
                  <Star size={18} style={{ color: '#F59E0B' }} />
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: 'var(--fg)' }}
                  >
                    Moderate Reviews
                  </p>
                  <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                    Approve or hide pending reviews
                  </p>
                </div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--fg-subtle)' }} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
