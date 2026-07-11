import { NextResponse, type NextRequest } from "next/server";
import { createWatchGateToken, watchSiteUrl } from "@/lib/watchGate";
import { getWatchAccess } from "@/lib/watchAccess";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function safeNextPath(raw: string | null) {
  const value = raw?.trim() || "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function GET(request: NextRequest) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"));
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", nextPath === "/" ? "/watch" : nextPath);

  if (!user) {
    return NextResponse.redirect(loginUrl);
  }

  const access = await getWatchAccess(supabase, user.id);
  if (!access.allowed) {
    const earnUrl = new URL("/earn", request.url);
    earnUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(earnUrl);
  }

  try {
    const token = await createWatchGateToken(user.id);

    const acceptUrl = new URL("/api/gate/accept", watchSiteUrl());
    acceptUrl.searchParams.set("token", token);
    acceptUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(acceptUrl);
  } catch {
    return NextResponse.json({ error: "Watch gate is not configured" }, { status: 500 });
  }
}
