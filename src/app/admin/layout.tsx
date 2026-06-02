import type { Metadata } from 'next'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

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
      {/* Admin theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {children}
    </div>
  )
}
