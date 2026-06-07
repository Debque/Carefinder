'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    const supabase = getBrowserClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: 'https://carefinder-gamma.vercel.app/reset-password',
      }
    )

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-soft)' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
            style={{
              background: 'var(--accent)',
              boxShadow: '0 4px 20px rgba(91,80,240,0.3)',
            }}
          >
            <Mail size={22} color="white" />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
          >
            Forgot password
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {sent ? (
            <div className="text-center py-2">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                style={{ background: '#DCFCE7', border: '2px solid #86EFAC' }}
              >
                <Mail size={22} color="#16A34A" />
              </div>
              <p className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                Check your email
              </p>
              <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                We sent a password reset link to <strong>{email}</strong>. Click
                the link to reset your password.
              </p>
              <p className="text-xs mt-4" style={{ color: 'var(--fg-subtle)' }}>
                Didn&#39;t get it? Check your spam folder or{' '}
                <button
                  onClick={() => setSent(false)}
                  style={{ color: 'var(--accent)' }}
                  className="underline"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  placeholder="you@example.com"
                  className="input-base"
                  aria-label="Email address"
                  autoComplete="email"
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
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Mail size={14} />
                    Send reset link
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p
          className="text-center text-xs mt-4"
          style={{ color: 'var(--fg-subtle)' }}
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-1 hover:opacity-75 transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeft size={12} />
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
