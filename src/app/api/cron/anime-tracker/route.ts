import { NextResponse } from "next/server";
import { syncJikanReleasesToDatabase } from "@/lib/animeTrackerSync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
    const result = await syncJikanReleasesToDatabase();
    return NextResponse.json({ ok: true, source: "jikan", ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Jikan sync failed" },
      { status: 500 },
    );
  }
}
