import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
import { parseEarnMoneySettings, type EarnMoneySettings } from "@/lib/earnMoney/settings";
import { loadEarnMoneySettings, saveEarnMoneySettings } from "@/lib/earnMoney/settings.server";
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

  const settings = await loadEarnMoneySettings();
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

  let body: { settings?: EarnMoneySettings };
  try {
    body = (await request.json()) as { settings?: EarnMoneySettings };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.settings) {
    return NextResponse.json({ error: "settings required" }, { status: 400 });
  }

  const settings = parseEarnMoneySettings(body.settings);
  const ok = await saveEarnMoneySettings(settings, user.id);
  if (!ok) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }

  return NextResponse.json({ settings });
}
