import Link from 'next/link'
import Image from 'next/image'

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
      <Image
        src="/favicon-32x32.png"
        alt="Carefinder logo"
        width={iconSize}
        height={iconSize}
        style={{ borderRadius: 8, flexShrink: 0 }}
        className="transition-transform duration-200 group-hover:scale-105"
      />

      <div className="flex flex-col leading-none">
        <span
          className={`${textSize} font-bold tracking-tight`}
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          <span style={{ color: 'var(--fg)' }}>Care</span>
          <span style={{ color: 'var(--accent)' }}>Finder</span>
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
