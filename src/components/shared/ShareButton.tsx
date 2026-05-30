'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { buildShareUrl } from '@/lib/share'
import type { SearchFilters } from '@/types'

interface ShareButtonProps {
  filters: Partial<SearchFilters>
}

export function ShareButton({ filters }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = buildShareUrl(filters)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="btn-ghost flex items-center gap-2 text-sm border rounded-lg px-3 py-2 transition-all"
      style={{
        borderColor: copied ? 'var(--green)' : 'var(--border)',
        color: copied ? 'var(--green)' : 'var(--fg-muted)',
        background: copied ? '#DCFCE7' : 'transparent',
      }}
      aria-label="Copy share link"
      aria-live="polite"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : 'Share Results'}
    </button>
  )
}
