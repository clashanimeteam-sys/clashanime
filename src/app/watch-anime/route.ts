import { NextResponse } from "next/server";
import { buildWatchSiteEntryUrl, createWatchGateToken } from "@/lib/watchGate";

export async function GET(request: Request) {
  if (!process.env.WATCH_GATE_SECRET?.trim()) {
    return NextResponse.redirect(new URL("/?watch_unconfigured=1", request.url));
  }

  const url = new URL(request.url);
  const nextPath = url.searchParams.get("next")?.trim() || "/";

  const token = await createWatchGateToken();
  return NextResponse.redirect(buildWatchSiteEntryUrl(token, nextPath));
}
