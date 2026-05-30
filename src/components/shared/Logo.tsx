import Link from 'next/link'

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36
  const textSize =
    size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'

  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 group"
      aria-label="Carefinder home"
    >
      <div
        className="flex items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
        style={{
          width: iconSize,
          height: iconSize,
          background: 'var(--accent)',
          boxShadow: '0 2px 12px rgba(91,80,240,0.35)',
        }}
      >
        <svg
          width={iconSize * 0.6}
          height={iconSize * 0.6}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="white"
            fillOpacity={0.25}
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M9.5 8.5C9.5 7.67 10.17 7 11 7c.44 0 .84.18 1.13.47L12 7.33l-.13.14A1.5 1.5 0 0 1 13 7c.83 0 1.5.67 1.5 1.5 0 1.66-2.5 3.5-2.5 3.5S9.5 10.16 9.5 8.5z"
            fill="white"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={`${textSize} font-bold tracking-tight`}
          style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
        >
          Carefinder
        </span>
        {size !== 'sm' && (
          <span className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
            Nigeria&apos;s Hospital Directory
          </span>
        )}
      </div>
    </Link>
  )
}
