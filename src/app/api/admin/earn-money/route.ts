import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("earn_money_submissions")
    .select(
      "id, user_id, task_type, content_url, notes, locale, status, reward_cents, admin_note, reviewed_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data ?? [];
  const userIds = [...new Set(rows.map((row) => row.user_id))];

  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, username, display_name").in("id", userIds)
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return NextResponse.json({
    submissions: rows.map((row) => ({
      ...row,
      username: profileMap.get(row.user_id)?.username ?? null,
      display_name: profileMap.get(row.user_id)?.display_name ?? null,
    })),
  });
}

export async function POST(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { submissionId?: string; action?: string; adminNote?: string | null };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const submissionId = body.submissionId?.trim();
  const action = body.action?.trim().toLowerCase();

  if (!submissionId || !action) {
    return NextResponse.json({ error: "submissionId and action required" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("review_earn_money_submission", {
    p_submission_id: submissionId,
    p_action: action,
    p_admin_note: body.adminNote?.trim() || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, result: data });
}
