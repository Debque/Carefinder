'use client'

import { useState } from 'react'
import { UserPlus, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { getBrowserClient } from '@/lib/supabase/browser'

export default function InviteAdminPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInvite = async () => {
    if (!email) {
      setError('Please enter an email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = getBrowserClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setError('You must be logged in as an admin')
        setLoading(false)
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/invite-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ email }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        setError(result.error ?? 'Failed to send invite')
        setLoading(false)
        return
      }

      setSuccess(true)
      setEmail('')
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-lg">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-75 transition-opacity"
        style={{ color: 'var(--fg-muted)' }}
      >
        <ArrowLeft size={14} />
        Back to dashboard
      </Link>

      <div
        className="rounded-2xl border p-6"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-subtle)' }}
          >
            <UserPlus size={18} color="var(--accent)" />
          </div>
          <div>
            <h1
              className="text-lg font-bold"
              style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
            >
              Invite Admin
            </h1>
            <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
              New admins are created by existing admins only
            </p>
          </div>
        </div>

        {success ? (
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: '#DCFCE7', border: '1px solid #86EFAC' }}
          >
            <Check size={18} color="#166534" />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#166534' }}>
                Invite sent successfully
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#166534' }}>
                The new admin will receive an email with a link to set up their
                account.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: 'var(--fg-muted)' }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="newadmin@carefinder.ng"
                className="input-base"
                aria-label="Email address"
                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
              />
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
              onClick={handleInvite}
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                'Sending invite...'
              ) : (
                <>
                  <UserPlus size={14} />
                  Send admin invite
                </>
              )}
            </button>

            <p
              className="text-xs text-center"
              style={{ color: 'var(--fg-subtle)' }}
            >
              The invited user will receive an email to set up their password.
              They will automatically be granted admin access.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
