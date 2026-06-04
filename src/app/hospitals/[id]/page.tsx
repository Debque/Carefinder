import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ArrowLeft,
  Share2,
  Navigation,
} from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { StarRating } from '@/components/shared/StarRating'
import { getHospitalById } from '@/lib/supabase/queries'
import { RatingWidget } from '@/components/hospital/RatingWidget'

export const revalidate = 60

interface Props {
  params: Promise<{ id: string }>
}

export default async function HospitalDetailPage({ params }: Props) {
  const { id } = await params
  const hospital = await getHospitalById(id)

  if (!hospital) notFound()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm mb-5 hover:opacity-75 transition-opacity"
          style={{ color: 'var(--fg-muted)' }}
        >
          <ArrowLeft size={14} />
          Back to search
        </Link>

        <div
          className="rounded-2xl border p-5 sm:p-7 mb-5 animate-fadeUp"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`badge ${
                    hospital.ownership === 'public'
                      ? 'badge-public'
                      : 'badge-private'
                  }`}
                >
                  {hospital.ownership === 'public' ? 'Public' : 'Private'}
                </span>
                {hospital.specialties.slice(0, 3).map((s) => (
                  <span key={s} className="badge badge-accent">
                    {s}
                  </span>
                ))}
              </div>

              <h1
                className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
              >
                {hospital.name}
              </h1>

              <div
                className="flex items-center gap-1.5 mt-2"
                style={{ color: 'var(--fg-muted)' }}
              >
                <MapPin size={14} />
                <span className="text-sm">
                  {hospital.address}, {hospital.city}, {hospital.state}
                </span>
              </div>

              {hospital.rating_avg > 0 && (
                <div className="mt-3">
                  <StarRating
                    rating={hospital.rating_avg}
                    count={hospital.review_count}
                    size="md"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  hospital.name + ' ' + hospital.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Navigation size={14} />
                Get directions
              </Link>
              <button className="btn-secondary">
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div
            className="sm:col-span-1 rounded-2xl border p-5 animate-fadeUp delay-100"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <p className="section-label mb-4">Contact & Hours</p>

            <div className="flex flex-col gap-3.5">
              {hospital.phone && (
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--accent-subtle)' }}
                  >
                    <Phone size={14} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold mb-0.5"
                      style={{ color: 'var(--fg-subtle)' }}
                    >
                      Phone
                    </p>
                    <a
                      href={`tel:${hospital.phone}`}
                      className="text-sm font-medium hover:underline"
                      style={{ color: 'var(--fg)' }}
                    >
                      {hospital.phone}
                    </a>
                  </div>
                </div>
              )}

              {hospital.email && (
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--accent-subtle)' }}
                  >
                    <Mail size={14} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold mb-0.5"
                      style={{ color: 'var(--fg-subtle)' }}
                    >
                      Email
                    </p>
                    <a
                      href={`mailto:${hospital.email}`}
                      className="text-sm font-medium hover:underline break-all"
                      style={{ color: 'var(--fg)' }}
                    >
                      {hospital.email}
                    </a>
                  </div>
                </div>
              )}

              {hospital.website && (
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--accent-subtle)' }}
                  >
                    <Globe size={14} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold mb-0.5"
                      style={{ color: 'var(--fg-subtle)' }}
                    >
                      Website
                    </p>
                    <a
                      href={hospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      Visit website
                    </a>
                  </div>
                </div>
              )}

              {hospital.visiting_hours && (
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--accent-subtle)' }}
                  >
                    <Clock size={14} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold mb-0.5"
                      style={{ color: 'var(--fg-subtle)' }}
                    >
                      Visiting Hours
                    </p>
                    <p className="text-sm" style={{ color: 'var(--fg)' }}>
                      {hospital.visiting_hours}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {hospital.specialties.length > 0 && (
              <div
                className="mt-5 pt-4 border-t"
                style={{ borderColor: 'var(--border)' }}
              >
                <p className="section-label mb-3">Specialties</p>
                <div className="flex flex-wrap gap-1.5">
                  {hospital.specialties.map((s) => (
                    <span key={s} className="badge badge-accent">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="sm:col-span-2 flex flex-col gap-5">
            {hospital.images && hospital.images.length > 0 && (
              <div
                className="rounded-2xl border overflow-hidden animate-fadeUp delay-200"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="grid grid-cols-2 gap-1">
                  {hospital.images.slice(0, 4).map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={img.id}
                      src={img.url}
                      alt={img.alt ?? `${hospital.name} photo ${i + 1}`}
                      className={`w-full object-cover ${
                        i === 0 ? 'col-span-2 h-52' : 'h-28'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {hospital.description ? (
              <div
                className="rounded-2xl border p-5 animate-fadeUp delay-200"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <p className="section-label mb-4">About</p>
                <div
                  className="prose prose-sm max-w-none"
                  style={{ color: 'var(--fg-muted)' }}
                  dangerouslySetInnerHTML={{ __html: hospital.description }}
                />
              </div>
            ) : (
              <div
                className="rounded-2xl border p-5 text-center animate-fadeUp delay-200"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-soft)',
                }}
              >
                <p className="text-sm" style={{ color: 'var(--fg-subtle)' }}>
                  No description available yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews section */}
        {/* Reviews section */}
        <div className="mt-5 animate-fadeUp delay-300">
          <RatingWidget hospitalId={hospital.id} />
        </div>
      </div>
    </div>
  )
}
