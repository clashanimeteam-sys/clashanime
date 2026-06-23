import { NextResponse } from "next/server";
import { syncTrendingSpotlightToDatabase } from "@/lib/animeTrackerTrendingSync";
import { getStaffUser } from "@/lib/adminAuth";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

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
    const result = await syncTrendingSpotlightToDatabase();
    return NextResponse.json({ ok: true, source: "trending", ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Trending sync failed" },
      { status: 500 },
    );
  }
}
