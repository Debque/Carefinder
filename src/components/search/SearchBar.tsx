'use client'

import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search hospitals, specialty, or keyword...',
}: SearchBarProps) {
  const [local, setLocal] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    queueMicrotask(() => setLocal(value))
  }, [value])

  const handleChange = (val: string) => {
    setLocal(val)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange(val), 350)
  }

  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--fg-subtle)' }}
        aria-hidden
      />
      <input
        type="search"
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-10 pr-9"
        aria-label="Search hospitals"
      />
      {local && (
        <button
          onClick={() => handleChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5"
          aria-label="Clear search"
        >
          <X size={14} style={{ color: 'var(--fg-subtle)' }} />
        </button>
      )}
    </div>
  )
}
