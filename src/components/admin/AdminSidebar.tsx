'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Hospital,
  Star,
  Users,
  Settings,
  LogOut,
  Globe,
  UserPlus,
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hospitals', label: 'Hospitals', icon: Hospital },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/invite', label: 'Invite Admin', icon: UserPlus },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/', label: 'View Site', icon: Globe },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside
      className="flex flex-col w-56 min-h-screen border-r px-3 py-5"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="white"
              fillOpacity={0.3}
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M9.5 8.5C9.5 7.67 10.17 7 11 7c.44 0 .84.18 1.13.47L12 7.33l-.13.14A1.5 1.5 0 0 1 13 7c.83 0 1.5.67 1.5 1.5 0 1.66-2.5 3.5-2.5 3.5S9.5 10.16 9.5 8.5z"
              fill="white"
            />
          </svg>
        </div>
        <span
          className="font-bold text-sm"
          style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
        >
          Carefinder
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--fg-muted)',
              }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full"
        style={{ color: 'var(--fg-muted)' }}
      >
        <LogOut size={16} />
        Sign out
      </button>
    </aside>
  )
}
