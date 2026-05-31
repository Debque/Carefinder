'use client'

import { useState } from 'react'
import { X, Mail, Send, Check } from 'lucide-react'
import { buildShareUrl } from '@/lib/share'
import type { Hospital, SearchFilters } from '@/types'

interface EmailShareModalProps {
  hospitals: Hospital[]
  filters: Partial<SearchFilters>
  onClose: () => void
}

export function EmailShareModal({
  hospitals,
  filters,
  onClose,
}: EmailShareModalProps) {
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<string[]>(
    hospitals.slice(0, 5).map((h) => h.id)
  )
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const toggleHospital = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSend = async () => {
    if (!email) {
      setError('Please enter a recipient email')
      return
    }
    if (selected.length === 0) {
      setError('Please select at least one hospital')
      return
    }

    setSending(true)
    setError('')

    const selectedHospitals = hospitals
      .filter((h) => selected.includes(h.id))
      .map((h) => ({ name: h.name, city: h.city, ownership: h.ownership }))

    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          hospitals: selectedHospitals,
          shareUrl: buildShareUrl(filters),
        }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setError('Too many emails sent. Please try again later.')
        setSending(false)
        return
      }

      if (!res.ok) {
        setError(data.error ?? 'Failed to send email')
        setSending(false)
        return
      }

      setSent(true)
    } catch {
      setError('Failed to send email. Please try again.')
    }

    setSending(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,27,42,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <Mail size={16} style={{ color: 'var(--accent)' }} />
            <h3
              className="font-bold text-base"
              style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
            >
              Share via Email
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X size={16} />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#DCFCE7' }}
            >
              <Check size={24} style={{ color: '#166534' }} />
            </div>
            <p
              className="font-semibold text-base mb-1"
              style={{ color: 'var(--fg)' }}
            >
              Email sent!
            </p>
            <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
              Hospital list sent to {email}
            </p>
            <button onClick={onClose} className="btn-primary mt-5">
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-4">
            {/* Email input */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: 'var(--fg-muted)' }}
              >
                Recipient email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="input-base"
                aria-label="Recipient email address"
              />
            </div>

            {/* Hospital selection */}
            <div>
              <label
                className="block text-xs font-semibold mb-2"
                style={{ color: 'var(--fg-muted)' }}
              >
                Select hospitals ({selected.length} selected)
              </label>
              <div
                className="flex flex-col gap-1.5 max-h-48 overflow-y-auto rounded-xl border p-2"
                style={{ borderColor: 'var(--border)' }}
              >
                {hospitals.slice(0, 10).map((h) => {
                  const isSelected = selected.includes(h.id)
                  return (
                    <button
                      key={h.id}
                      onClick={() => toggleHospital(h.id)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-sm"
                      style={{
                        background: isSelected
                          ? 'var(--accent-subtle)'
                          : 'transparent',
                        color: isSelected ? 'var(--accent)' : 'var(--fg-muted)',
                      }}
                      aria-pressed={isSelected}
                    >
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isSelected
                            ? 'var(--accent)'
                            : 'transparent',
                          border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border-strong)'}`,
                        }}
                      >
                        {isSelected && (
                          <Check size={10} color="white" strokeWidth={3} />
                        )}
                      </div>
                      <span className="truncate">{h.name}</span>
                      <span
                        className="text-xs flex-shrink-0"
                        style={{ color: 'var(--fg-subtle)' }}
                      >
                        {h.city}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <p
                className="text-xs px-3 py-2 rounded-lg"
                style={{ background: '#FEE2E2', color: '#DC2626' }}
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              onClick={handleSend}
              disabled={sending}
              className="btn-primary w-full justify-center"
            >
              {sending ? (
                <>
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeOpacity={0.3}
                      strokeWidth="3"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send Email
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
