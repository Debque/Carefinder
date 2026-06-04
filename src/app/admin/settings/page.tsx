import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
            >
              Settings
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--fg-muted)' }}>
              Platform configuration
            </p>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border)',
            }}
          >
            <p className="section-label mb-4">Platform Info</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Platform', value: 'Carefinder' },
                { label: 'Version', value: '1.0.0' },
                { label: 'Stack', value: 'Next.js 16 + Supabase + Vercel' },
                { label: 'Database', value: 'PostgreSQL + PostGIS' },
                { label: 'Auth', value: 'Supabase Auth + RLS' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span
                    className="text-sm"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--fg)' }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
