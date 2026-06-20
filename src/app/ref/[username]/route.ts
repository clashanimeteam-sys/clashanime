import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { REFERRAL_COOKIE } from "@/lib/points";
import { createServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ username: string }>;
};

function getVisitorHash(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  return createHash("sha256").update(`${ip}:${userAgent}`).digest("hex").slice(0, 32);
}

export async function GET(request: Request, context: RouteContext) {
  const { username } = await context.params;
  const normalized = username.replace(/^@/, "").trim().toLowerCase();
  const redirectUrl = new URL("/", request.url);
  const response = NextResponse.redirect(redirectUrl);

  if (!normalized) {
    return response;
  }

  response.cookies.set(REFERRAL_COOKIE, normalized, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });

  const supabase = await createServerClient();
  if (supabase) {
    await supabase.rpc("track_referral_click", {
      referrer_username: normalized,
      visitor_hash: getVisitorHash(request),
    });
  }

  return response;
}
