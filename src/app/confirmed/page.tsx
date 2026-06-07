import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function ConfirmedPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-soft)' }}
    >
      <div className="w-full max-w-sm text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style={{
            background: '#DCFCE7',
            border: '2px solid #86EFAC',
          }}
        >
          <CheckCircle size={32} color="#16A34A" />
        </div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
        >
          Account confirmed!
        </h1>

        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: 'var(--fg-muted)' }}
        >
          Your Carefinder account has been successfully created. You can now log
          in to leave reviews and rate hospitals across Nigeria.
        </p>

        <Link href="/login" className="btn-primary w-full justify-center py-3">
          Continue to login
        </Link>

        <p className="text-xs mt-4" style={{ color: 'var(--fg-subtle)' }}>
          <Link href="/" style={{ color: 'var(--accent)' }}>
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
