'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import type { AuthChangeEvent } from '@supabase/supabase-js'

function SetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase puts the token in the URL hash — exchange it for a session
    const supabase = getBrowserClient()
    supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setReady(true)
      }
    })
    // Also check if already have a session
    supabase.auth
      .getSession()
      .then(({ data }: { data: { session: unknown } }) => {
        if (data.session) setReady(true)
      })
  }, [searchParams])

  const handleSubmit = async () => {
    if (!password) {
      setError('Please enter a password')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = getBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      // Redirect to admin dashboard after password set
      router.push('/admin/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2D42 100%)',
      }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
            style={{
              background: 'var(--accent)',
              boxShadow: '0 4px 20px rgba(91,80,240,0.4)',
            }}
          >
            <KeyRound size={22} color="white" />
          </div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Set your password
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Create a secure password for your admin account
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {!ready ? (
            <div className="text-center py-4">
              <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                Verifying your invite link...
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="input-base pr-10"
                    aria-label="New password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} style={{ color: 'var(--fg-subtle)' }} />
                    ) : (
                      <Eye size={16} style={{ color: 'var(--fg-subtle)' }} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  Confirm password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  className="input-base"
                  aria-label="Confirm password"
                  autoComplete="new-password"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
                onClick={handleSubmit}
                disabled={loading || !password || !confirm}
                className="btn-primary w-full justify-center py-3 mt-1"
              >
                {loading ? (
                  'Setting password...'
                ) : (
                  <>
                    <KeyRound size={14} />
                    Set password & sign in
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <p
          className="text-center text-xs mt-4"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Admin access only · Carefinder
        </p>
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2D42 100%)',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
        </div>
      }
    >
      <SetPasswordForm />
    </Suspense>
  )
}
