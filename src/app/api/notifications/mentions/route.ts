import { NextResponse } from "next/server";
import { notifyMentionedUsers } from "@/lib/notifications/createNotifications";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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

  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    return NextResponse.json({ error: "Service role not configured" }, { status: 503 });
  }

  let body: {
    text?: string;
    link?: string;
    title?: string;
    preview?: string;
    actorName?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = body.text?.trim() ?? "";
  if (!text) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("id", user.id)
    .maybeSingle();

  const actorName =
    body.actorName?.trim() ||
    profile?.display_name?.trim() ||
    profile?.username ||
    "Someone";

  const result = await notifyMentionedUsers({
    supabase: serviceRole,
    body: text,
    actorUserId: user.id,
    actorName,
    link: body.link?.trim() || "/community",
    title: body.title?.trim() || "You were mentioned",
    preview: body.preview?.trim() || "mentioned you in a post.",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: result.count });
}
