import { NextResponse } from "next/server";
import { runAnimeNewsSync } from "@/lib/animeNews/sync";
import { upsertHeroesDailyBrief } from "@/lib/heroesGuideDaily.server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

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
    const news = await runAnimeNewsSync();
    const daily = await upsertHeroesDailyBrief();
    return NextResponse.json({ ok: true, news, daily });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Heroes guide daily update failed" },
      { status: 500 },
    );
  }
}
