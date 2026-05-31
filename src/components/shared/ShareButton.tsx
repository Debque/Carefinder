'use client'

import { useState } from 'react'
import { Check, Copy, Mail, Share2 } from 'lucide-react'
import { buildShareUrl } from '@/lib/share'
import { EmailShareModal } from './EmailShareModal'
import type { Hospital, SearchFilters } from '@/types'

interface ShareButtonProps {
  filters: Partial<SearchFilters>
  hospitals?: Hospital[]
}

export function ShareButton({ filters, hospitals = [] }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

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
    <>
      <div className="flex items-center gap-1.5">
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
          {copied ? 'Copied!' : 'Copy link'}
        </button>

        <button
          onClick={() => setShowEmailModal(true)}
          className="btn-ghost flex items-center gap-2 text-sm border rounded-lg px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
          aria-label="Share via email"
        >
          <Mail size={14} />
          Email
        </button>
      </div>

      {showEmailModal && (
        <EmailShareModal
          hospitals={hospitals}
          filters={filters}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </>
  )
}
