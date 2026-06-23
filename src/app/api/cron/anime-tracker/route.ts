import { NextResponse } from "next/server";
import { syncJikanReleasesToDatabase } from "@/lib/animeTrackerSync";
import { syncTrendingSpotlightToDatabase } from "@/lib/animeTrackerTrendingSync";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function authorizeCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [schedule, trending] = await Promise.all([
      syncJikanReleasesToDatabase(),
      syncTrendingSpotlightToDatabase(),
    ]);
    return NextResponse.json({ ok: true, schedule, trending });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Jikan sync failed" },
      { status: 500 },
    );
  }
}
