'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HospitalSchema, type HospitalFormData } from '@/lib/schemas'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Save, X } from 'lucide-react'

const SPECIALTIES = [
  'General',
  'Emergency',
  'Maternity',
  'Pediatrics',
  'Cardiology',
  'Neurology',
  'Surgery',
  'Dental',
  'Oncology',
  'Teaching',
  'Multi-specialty',
]

const STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
]

interface AdminEntryFormProps {
  defaultValues?: Partial<HospitalFormData>
  hospitalId?: string
}

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function AdminEntryForm({
  defaultValues,
  hospitalId,
}: AdminEntryFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<HospitalFormData>({
    resolver: zodResolver(HospitalSchema),
    defaultValues: {
      ownership: 'public',
      specialties: [],
      ...defaultValues,
    },
  })

  const selectedSpecialties = watch('specialties') ?? []

  const onSubmit = async (data: HospitalFormData) => {
    setSaving(true)
    setSaveError('')

    const supabase = getClient()

    const payload = {
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      lga: data.lga ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      website: data.website ?? null,
      ownership: data.ownership,
      specialties: data.specialties,
      visiting_hours: data.visiting_hours ?? null,
      description: data.description ?? null,
    }

    let error
    if (hospitalId) {
      const result = await supabase
        .from('hospitals')
        .update(payload)
        .eq('id', hospitalId)
      error = result.error
    } else {
      const result = await supabase.from('hospitals').insert(payload)
      error = result.error
    }

    if (error) {
      setSaveError(error.message)
      setSaving(false)
      return
    }

    router.push('/admin/hospitals')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Basic info */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <p className="section-label mb-4">Basic Information</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--fg-muted)' }}
            >
              Hospital Name *
            </label>
            <input
              {...register('name')}
              className="input-base"
              placeholder="Lagos University Teaching Hospital"
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--fg-muted)' }}
            >
              Address *
            </label>
            <input
              {...register('address')}
              className="input-base"
              placeholder="123 Hospital Road"
            />
            {errors.address && (
              <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--fg-muted)' }}
            >
              City *
            </label>
            <input
              {...register('city')}
              className="input-base"
              placeholder="Lagos"
            />
            {errors.city && (
              <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                {errors.city.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--fg-muted)' }}
            >
              State *
            </label>
            <select {...register('state')} className="input-base">
              <option value="">Select state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                {errors.state.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--fg-muted)' }}
            >
              LGA
            </label>
            <input
              {...register('lga')}
              className="input-base"
              placeholder="Surulere"
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--fg-muted)' }}
            >
              Ownership *
            </label>
            <select {...register('ownership')} className="input-base">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <p className="section-label mb-4">Contact Details</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--fg-muted)' }}
            >
              Phone
            </label>
            <input
              {...register('phone')}
              className="input-base"
              placeholder="01-234-5678"
            />
            {errors.phone && (
              <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--fg-muted)' }}
            >
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="input-base"
              placeholder="info@hospital.ng"
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--fg-muted)' }}
            >
              Website
            </label>
            <input
              {...register('website')}
              className="input-base"
              placeholder="https://hospital.ng"
            />
            {errors.website && (
              <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                {errors.website.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{ color: 'var(--fg-muted)' }}
            >
              Visiting Hours
            </label>
            <input
              {...register('visiting_hours')}
              className="input-base"
              placeholder="Mon-Fri: 8AM-5PM"
            />
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <p className="section-label mb-4">Specialties *</p>
        <Controller
          name="specialties"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => {
                const isSelected = field.value?.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      const current = field.value ?? []
                      field.onChange(
                        isSelected
                          ? current.filter((v) => v !== s)
                          : [...current, s]
                      )
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                    style={{
                      background: isSelected ? 'var(--accent)' : 'transparent',
                      color: isSelected ? 'white' : 'var(--fg-muted)',
                      borderColor: isSelected
                        ? 'var(--accent)'
                        : 'var(--border)',
                    }}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {s}
                  </button>
                )
              })}
            </div>
          )}
        />
        {errors.specialties && (
          <p className="text-xs mt-2" style={{ color: 'var(--red)' }}>
            {errors.specialties.message}
          </p>
        )}
        {selectedSpecialties.length > 0 && (
          <p className="text-xs mt-2" style={{ color: 'var(--fg-subtle)' }}>
            {selectedSpecialties.length} selected
          </p>
        )}
      </div>

      {/* Description */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <p className="section-label mb-4">Description (Markdown supported)</p>
        <textarea
          {...register('description')}
          className="input-base resize-none"
          rows={6}
          placeholder="## About&#10;&#10;Write a description of the hospital using Markdown..."
        />
      </div>

      {/* Error */}
      {saveError && (
        <p
          className="text-sm px-4 py-3 rounded-xl"
          style={{ background: '#FEE2E2', color: '#DC2626' }}
        >
          {saveError}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-ghost border rounded-lg px-5 py-2.5"
          style={{ borderColor: 'var(--border)' }}
        >
          <X size={14} />
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-primary px-6">
          <Save size={14} />
          {saving
            ? 'Saving...'
            : hospitalId
              ? 'Save Changes'
              : 'Create Hospital'}
        </button>
      </div>
    </form>
  )
}
