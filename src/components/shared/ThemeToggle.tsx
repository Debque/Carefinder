'use client'

import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 hover:scale-105"
      style={{
        background: 'var(--bg-soft)',
        borderColor: 'var(--border)',
        color: 'var(--fg-muted)',
      }}
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
