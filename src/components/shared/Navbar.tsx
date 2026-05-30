'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Share2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const navLinks = [
  { href: '/search', label: 'Search' },
  { href: '/search?view=hospitals', label: 'Hospitals' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Logo size="sm" />

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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/search" className="btn-primary hidden md:inline-flex">
            <Share2 size={14} />
            Share
          </Link>
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

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
