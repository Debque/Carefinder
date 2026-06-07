import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
