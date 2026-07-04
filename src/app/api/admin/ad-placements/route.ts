import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
import { parseAdPlacementSettings, type AdPlacementSettings } from "@/lib/ads/placements";
import { loadAdPlacementSettings, saveAdPlacementSettings } from "@/lib/ads/placements.server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await loadAdPlacementSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { settings?: AdPlacementSettings };
  try {
    body = (await request.json()) as { settings?: AdPlacementSettings };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.settings) {
    return NextResponse.json({ error: "settings required" }, { status: 400 });
  }

  const settings = parseAdPlacementSettings(body.settings);
  const ok = await saveAdPlacementSettings(settings, user.id);
  if (!ok) {
    return NextResponse.json({ error: "Failed to save ad placements" }, { status: 500 });
  }

  return NextResponse.json({ settings });
}
