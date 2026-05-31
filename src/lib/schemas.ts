import { z } from 'zod'

export const HospitalSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  lga: z.string().optional(),
  phone: z
    .string()
    .regex(/^(\+234|0)[0-9]{9,10}$/, 'Enter a valid Nigerian phone number')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  ownership: z.enum(['public', 'private']),
  specialties: z.array(z.string()).min(1, 'Select at least one specialty'),
  visiting_hours: z.string().optional(),
  description: z.string().optional(),
  latitude: z
    .number()
    .min(4, 'Latitude must be within Nigeria')
    .max(14, 'Latitude must be within Nigeria')
    .optional(),
  longitude: z
    .number()
    .min(2, 'Longitude must be within Nigeria')
    .max(15, 'Longitude must be within Nigeria')
    .optional(),
})

export type HospitalFormData = z.infer<typeof HospitalSchema>

export const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z
    .string()
    .max(500, 'Review must be under 500 characters')
    .optional(),
})

export type ReviewFormData = z.infer<typeof ReviewSchema>
