'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    const supabase = getBrowserClient()

    if (mode === 'login') {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect') ?? '/search'
      router.push(redirect)
    } else {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      setSuccess('Account created! Check your email to confirm, then log in.')
      setMode('login')
    }

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-soft)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
              style={{
                background: 'var(--accent)',
                boxShadow: '0 4px 20px rgba(91,80,240,0.3)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  fill="white"
                  fillOpacity={0.3}
                  stroke="white"
                  strokeWidth="1.5"
                />
                <path
                  d="M9.5 8.5C9.5 7.67 10.17 7 11 7c.44 0 .84.18 1.13.47L12 7.33l-.13.14A1.5 1.5 0 0 1 13 7c.83 0 1.5.67 1.5 1.5 0 1.66-2.5 3.5-2.5 3.5S9.5 10.16 9.5 8.5z"
                  fill="white"
                />
              </svg>
            </div>
          </Link>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
          >
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
            {mode === 'login'
              ? 'Sign in to leave reviews'
              : 'Join to rate and review hospitals'}
          </p>
        </div>

        {/* Tab toggle */}
        <div
          className="flex rounded-xl border overflow-hidden mb-5"
          style={{ borderColor: 'var(--border)' }}
        >
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m)
                setError('')
                setSuccess('')
                setConfirm('')
              }}
              className="flex-1 py-2.5 text-sm font-semibold capitalize transition-colors"
              style={{
                background: mode === m ? 'var(--accent)' : 'var(--bg-card)',
                color: mode === m ? 'white' : 'var(--fg-muted)',
              }}
            >
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
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

            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: 'var(--fg-muted)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Atleast 6 characters"
                  className="input-base pr-10"
                  aria-label="Password"
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={16} style={{ color: 'var(--fg-subtle)' }} />
                  ) : (
                    <Eye size={16} style={{ color: 'var(--fg-subtle)' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password — only shown on signup */}
            {mode === 'signup' && (
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    className="input-base pr-10"
                    aria-label="Confirm password"
                    autoComplete="new-password"
                  />
                  {confirm && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                      {confirm === password ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {error && (
              <p
                className="text-xs px-3 py-2 rounded-lg"
                style={{ background: '#FEE2E2', color: '#DC2626' }}
                role="alert"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                className="text-xs px-3 py-2 rounded-lg"
                style={{ background: '#DCFCE7', color: '#166534' }}
                role="status"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
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
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <>
                  {mode === 'login' ? (
                    <LogIn size={14} />
                  ) : (
                    <UserPlus size={14} />
                  )}
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>
        </div>

        <p
          className="text-center text-xs mt-4"
          style={{ color: 'var(--fg-subtle)' }}
        >
          <Link href="/search" style={{ color: 'var(--accent)' }}>
            ← Back to search
          </Link>
        </p>
      </div>
    </div>
  )
}
