'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'

function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = getBrowserClient()
    supabase.auth.onAuthStateChange((event: string) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
  }, [])

  const handleSubmit = async () => {
    if (!password) {
      setError('Please enter a new password')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    const supabase = getBrowserClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/login?reset=success')
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
            <KeyRound size={22} color="white" />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
          >
            Reset password
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
            Enter your new password below
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
          {!ready ? (
            <div className="text-center py-4">
              <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                Verifying your reset link...
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
                    placeholder="Min. 6 characters"
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
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    className="input-base pr-10"
                    aria-label="Confirm new password"
                    autoComplete="new-password"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                  {confirm && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                      {confirm === password ? '✅' : '❌'}
                    </span>
                  )}
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
                onClick={handleSubmit}
                disabled={loading || !password || !confirm}
                className="btn-primary w-full justify-center py-3"
              >
                {loading ? (
                  'Updating password...'
                ) : (
                  <>
                    <KeyRound size={14} />
                    Reset password
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'var(--bg-soft)' }}
        >
          <p style={{ color: 'var(--fg-muted)' }}>Loading...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
