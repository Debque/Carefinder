'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="rounded-2xl border p-8 text-center"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-soft)',
            }}
          >
            <div className="text-3xl mb-3">⚠️</div>
            <p className="font-semibold" style={{ color: 'var(--fg)' }}>
              Something went wrong
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--fg-muted)' }}>
              Please refresh the page and try again
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-4"
            >
              Refresh
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
