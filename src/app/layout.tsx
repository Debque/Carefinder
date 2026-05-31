import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'

export const metadata: Metadata = {
  title: "Carefinder — Nigeria's Hospital Directory",
  description:
    'Find, export, and share trusted hospital information across Nigeria.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
