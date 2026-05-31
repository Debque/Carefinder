import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminEntryForm } from '@/components/admin/AdminEntryForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewHospitalPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/admin/hospitals"
            className="inline-flex items-center gap-1.5 text-sm mb-5 hover:opacity-75"
            style={{ color: 'var(--fg-muted)' }}
          >
            <ArrowLeft size={14} />
            Back to hospitals
          </Link>

          <h1
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: 'Sora, sans-serif', color: 'var(--fg)' }}
          >
            Add New Hospital
          </h1>

          <AdminEntryForm />
        </div>
      </main>
    </div>
  )
}
