import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Carefinder',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ background: 'var(--bg-soft)', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
