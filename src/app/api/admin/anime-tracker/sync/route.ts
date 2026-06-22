import { NextResponse } from "next/server";
import { syncJikanReleasesToDatabase } from "@/lib/animeTrackerSync";
import { getStaffUser } from "@/lib/adminAuth";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncJikanReleasesToDatabase();
    return NextResponse.json({ ok: true, source: "jikan", ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Jikan sync failed" },
      { status: 500 },
    );
  }
}
