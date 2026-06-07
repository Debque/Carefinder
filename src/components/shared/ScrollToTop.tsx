'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Only scroll to top when the pathname changes, not hash changes
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname])

  return null
}
