import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminEntryForm } from "@/components/admin/AdminEntryForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditHospitalPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: hospital } = await supabase
    .from("hospitals_with_coords")
    .select("*, images:hospital_images(id, url, alt)")
    .eq("id", id)
    .single();

  if (!hospital) notFound();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/admin/hospitals"
            className="inline-flex items-center gap-1.5 text-sm mb-5 hover:opacity-75"
            style={{ color: "var(--fg-muted)" }}
          >
            <ArrowLeft size={14} />
            Back to hospitals
          </Link>

          <h1
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "Sora, sans-serif", color: "var(--fg)" }}
          >
            Edit Hospital
          </h1>

          <AdminEntryForm
            hospitalId={hospital.id}
            defaultValues={{
              name: hospital.name,
              address: hospital.address,
              city: hospital.city,
              state: hospital.state,
              lga: hospital.lga ?? "",
              phone: hospital.phone ?? "",
              email: hospital.email ?? "",
              website: hospital.website ?? "",
              ownership: hospital.ownership,
              specialties: hospital.specialties,
              visiting_hours: hospital.visiting_hours ?? "",
              description: hospital.description ?? "",
            }}
          />
        </div>
      </main>
    </div>
  );
}
