import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
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

  const { data, error } = await supabase
    .from("admin_broadcast_emails")
    .select("id, subject, recipient_count, sent_count, failed_count, status, created_at, completed_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ campaigns: data ?? [] });
}
