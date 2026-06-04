import { describe, it, expect } from 'vitest'
import { HospitalSchema } from '@/lib/schemas'

describe('HospitalSchema validation', () => {
  it('passes with valid hospital data', () => {
    const result = HospitalSchema.safeParse({
      name: 'Lagos General Hospital',
      address: '1 Hospital Road',
      city: 'Lagos',
      state: 'Lagos',
      ownership: 'public',
      specialties: ['General'],
    })
    expect(result.success).toBe(true)
  })

  it('fails when name is too short', () => {
    const result = HospitalSchema.safeParse({
      name: 'AB',
      address: '1 Hospital Road',
      city: 'Lagos',
      state: 'Lagos',
      ownership: 'public',
      specialties: ['General'],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('name')
    }
  })

  it('fails with invalid phone number', () => {
    const result = HospitalSchema.safeParse({
      name: 'Lagos General Hospital',
      address: '1 Hospital Road',
      city: 'Lagos',
      state: 'Lagos',
      ownership: 'public',
      specialties: ['General'],
      phone: '12345',
    })
    expect(result.success).toBe(false)
  })

  it('passes with valid Nigerian phone number', () => {
    const result = HospitalSchema.safeParse({
      name: 'Lagos General Hospital',
      address: '1 Hospital Road',
      city: 'Lagos',
      state: 'Lagos',
      ownership: 'public',
      specialties: ['General'],
      phone: '08012345678',
    })
    expect(result.success).toBe(true)
  })

  it('fails when specialties array is empty', () => {
    const result = HospitalSchema.safeParse({
      name: 'Lagos General Hospital',
      address: '1 Hospital Road',
      city: 'Lagos',
      state: 'Lagos',
      ownership: 'public',
      specialties: [],
    })
    expect(result.success).toBe(false)
  })

  it('fails with invalid email', () => {
    const result = HospitalSchema.safeParse({
      name: 'Lagos General Hospital',
      address: '1 Hospital Road',
      city: 'Lagos',
      state: 'Lagos',
      ownership: 'public',
      specialties: ['General'],
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('fails with coordinates outside Nigeria', () => {
    const result = HospitalSchema.safeParse({
      name: 'Lagos General Hospital',
      address: '1 Hospital Road',
      city: 'Lagos',
      state: 'Lagos',
      ownership: 'public',
      specialties: ['General'],
      latitude: 51.5, // London
      longitude: -0.1,
    })
    expect(result.success).toBe(false)
  })

  it('accepts public and private ownership only', () => {
    const publicResult = HospitalSchema.safeParse({
      name: 'Lagos General Hospital',
      address: '1 Hospital Road',
      city: 'Lagos',
      state: 'Lagos',
      ownership: 'public',
      specialties: ['General'],
    })
    expect(publicResult.success).toBe(true)

    const invalidResult = HospitalSchema.safeParse({
      name: 'Lagos General Hospital',
      address: '1 Hospital Road',
      city: 'Lagos',
      state: 'Lagos',
      ownership: 'government',
      specialties: ['General'],
    })
    expect(invalidResult.success).toBe(false)
  })
})
