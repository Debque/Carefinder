'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Share2, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { createClient } from '@supabase/supabase-js'

const navLinks = [
  { href: '/search', label: 'Search' },
  { href: '/search?view=hospitals', label: 'Hospitals' },
  { href: '/#about', label: 'About' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session)
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Logo size="sm" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                color:
                  pathname === link.href ? 'var(--accent)' : 'var(--fg-muted)',
                background:
                  pathname === link.href
                    ? 'var(--accent-subtle)'
                    : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Login / Logout */}
          {isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--fg-muted)',
              }}
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--fg-muted)',
              }}
            >
              Log in
            </Link>
          )}

          <Link
            href="/search"
            className="btn-primary hidden md:inline-flex"
            style={{ paddingTop: '8px', paddingBottom: '8px' }}
          >
            <Share2 size={14} />
            Share
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-1"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: 'var(--fg-muted)' }}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-left"
              style={{ color: 'var(--fg-muted)' }}
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: 'var(--fg-muted)' }}
            >
              Log in
            </Link>
          )}

          <Link
            href="/search"
            className="btn-primary mt-2 justify-center"
            onClick={() => setMobileOpen(false)}
          >
            <Share2 size={14} />
            Share
          </Link>
        </div>
      )}
    </header>
  )
}
