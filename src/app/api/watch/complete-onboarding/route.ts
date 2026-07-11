import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error: rpcError } = await supabase.rpc("complete_watch_onboarding");

  if (!rpcError) {
    return NextResponse.json({ ok: true });
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ watch_onboarding_completed_at: new Date().toISOString() })
    .eq("id", user.id)
    .is("watch_onboarding_completed_at", null);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
