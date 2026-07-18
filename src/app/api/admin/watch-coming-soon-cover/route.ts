import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import {
  loadWatchComingSoonCover,
  resetWatchComingSoonCover,
  saveWatchComingSoonCover,
} from "@/lib/watchComingSoonCover.server";
import { parseWatchComingSoonCover } from "@/lib/watchComingSoonCover";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getAdminUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cover = await loadWatchComingSoonCover();
  return NextResponse.json({ cover });
}

export async function PUT(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getAdminUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const cover = parseWatchComingSoonCover(body);
  const ok = await saveWatchComingSoonCover(cover, user.id);
  if (!ok) {
    return NextResponse.json({ error: "Failed to save cover" }, { status: 500 });
  }

  return NextResponse.json({ cover });
}

export async function DELETE() {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getAdminUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ok = await resetWatchComingSoonCover(user.id);
  if (!ok) {
    return NextResponse.json({ error: "Failed to reset cover" }, { status: 500 });
  }

  const cover = await loadWatchComingSoonCover();
  return NextResponse.json({ cover });
}
