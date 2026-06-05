'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

interface HospitalShareButtonProps {
  hospitalId: string
  hospitalName: string
}

export function HospitalShareButton({
  hospitalName,
}: HospitalShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''

    if (navigator.share) {
      try {
        await navigator.share({
          title: hospitalName,
          text: `Check out ${hospitalName} on Carefinder`,
          url,
        })
        return
      } catch {
        // User cancelled native share, fall through to clipboard
      }
    }

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
      onClick={handleShare}
      className="btn-secondary"
      style={{
        borderColor: copied ? 'var(--green)' : 'var(--border)',
        color: copied ? 'var(--green)' : 'var(--fg-muted)',
        background: copied ? '#DCFCE7' : 'transparent',
        transition: 'all 0.15s',
      }}
      aria-label="Share this hospital"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? 'Copied!' : 'Share'}
    </button>
  )
}
