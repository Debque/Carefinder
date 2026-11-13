import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // Only admins may clear the cache. The admin's session cookie is sent automatically.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    const { id } = await request.json();

    // Revalidate the specific hospital page
    if (id) {
      revalidatePath(`/hospitals/${id}`);
    }

    // Revalidate the search page and hospital list
    revalidatePath("/search");
    revalidatePath("/admin/hospitals");

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 },
    );
  }
}
