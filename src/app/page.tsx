import Link from 'next/link'
import {
  Search,
  Share2,
  Download,
  Star,
  ArrowRight,
  MapPin,
  Shield,
  Clock,
} from 'lucide-react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg)' }}
    >
      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'var(--navbar-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl"
              style={{ background: 'var(--accent)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
            <span
              className="text-lg font-bold"
              style={{ fontFamily: 'Sora, sans-serif', lineHeight: 1 }}
            >
              <span style={{ color: 'var(--fg)' }}>Care</span>
              <span style={{ color: 'var(--accent)' }}>finder</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Find Hospitals', href: '/search' },
              { label: 'About', href: '#about' },
              { label: 'How it works', href: '#how' },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: 'var(--fg-muted)' }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--fg-muted)',
              }}
            >
              Log in
            </Link>
            <Link href="/search" className="btn-primary">
              <Search size={14} />
              Find Hospitals
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden flex-1"
        style={{
          background:
            'linear-gradient(135deg, #0D1B2A 0%, #1A2D42 60%, #1e2d5a 100%)',
          minHeight: 600,
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow orb */}
        <div
          className="absolute top-20 right-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(91,80,240,0.3) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24">
          <div className="max-w-2xl">
            {/* Pill badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: 'rgba(91,80,240,0.2)',
                border: '1px solid rgba(91,80,240,0.4)',
                color: '#A5B4FC',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Nigeria&apos;s Civic Hospital Directory
            </div>

            <h1
              className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Find the right hospital,{' '}
              <span style={{ color: '#818CF8' }}>fast.</span>
            </h1>

            <p
              className="text-lg mb-8 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Search hospitals across Nigeria by location, specialty, and
              ownership type. Export results, share with others, and get
              directions — all in one place.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/search"
                className="btn-primary px-7 py-3.5 text-base gap-2"
              >
                <Search size={18} />
                Find Hospitals
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                }}
              >
                How it works
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10 flex-wrap">
              {[
                { value: '500+', label: 'Hospitals listed' },
                { value: '36', label: 'States covered' },
                { value: 'Free', label: 'Always free to use' },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">What you can do</p>
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
            >
              Everything you need to find care
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Search size={22} />,
                title: 'Search & Filter',
                desc: 'Find hospitals by name, city, LGA, specialty, or ownership type.',
              },
              {
                icon: <MapPin size={22} />,
                title: 'Map View',
                desc: 'See hospitals on an interactive map with radius-based search.',
              },
              {
                icon: <Download size={22} />,
                title: 'Export CSV',
                desc: 'Download hospital lists as CSV with your chosen columns.',
              },
              {
                icon: <Share2 size={22} />,
                title: 'Share Results',
                desc: 'Copy a link or email a curated list to anyone.',
              },
              {
                icon: <Star size={22} />,
                title: 'Ratings & Reviews',
                desc: 'Read and leave reviews to help others find quality care.',
              },
              {
                icon: <Clock size={22} />,
                title: 'Visiting Hours',
                desc: 'Check opening times and contact details before you go.',
              },
              {
                icon: <Shield size={22} />,
                title: 'Verified Data',
                desc: 'Entries created and moderated by trusted administrators.',
              },
              {
                icon: <ArrowRight size={22} />,
                title: 'Get Directions',
                desc: 'One tap to open Google Maps directions to any hospital.',
              },
            ].map((f) => (
              <div key={f.title} className="card p-5 flex flex-col gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                  }}
                >
                  {f.icon}
                </div>
                <p
                  className="font-semibold text-sm"
                  style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
                >
                  {f.title}
                </p>
                <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="py-20 px-4 sm:px-6 border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label mb-3">Our mission</p>
          <h2
            className="text-3xl font-bold mb-5"
            style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
          >
            Making healthcare accessible to every Nigerian
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: 'var(--fg-muted)' }}
          >
            Carefinder is a civic health tool that helps Nigerians find, export,
            and share hospital information. We address the access-to-healthcare
            gap by building a searchable, shareable, and exportable hospital
            directory — free for everyone, always.
          </p>
          <Link href="/search" className="btn-primary px-8 py-3.5 text-base">
            <Search size={16} />
            Start searching now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8 px-4 sm:px-6"
        style={{ background: 'var(--navy)', borderColor: '#1A2D42' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent)' }}
            >
              <span className="text-white text-xs">🏥</span>
            </div>
            <span
              className="text-sm font-bold text-white"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Carefinder
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/search"
              className="text-xs hover:opacity-75 transition-opacity"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Find Hospitals
            </Link>
            <Link
              href="/admin/login"
              className="text-xs hover:opacity-75 transition-opacity"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Admin Login
            </Link>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © 2026 Carefinder · Built for Nigerians
          </p>
        </div>
      </footer>
    </div>
  )
}
