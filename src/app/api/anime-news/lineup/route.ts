import { NextResponse } from "next/server";
import { getFeaturedSeasonalGuide } from "@/lib/animeNews.server";
import { getEnrichedSummer2026Lineup } from "@/lib/animeNews/seasonalLineupEnrich";
import { getSeasonalLineup } from "@/lib/animeNews/types";

export const dynamic = "force-dynamic";
export const revalidate = 86400;
export const maxDuration = 120;

export async function GET() {
  try {
    const article = await getFeaturedSeasonalGuide();
    const stored = article ? getSeasonalLineup(article) : [];
    const lineup = await getEnrichedSummer2026Lineup(stored);

    return NextResponse.json({
      lineup,
      count: lineup.length,
      enriched: lineup.filter((entry) => entry.posterUrl && entry.story).length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lineup fetch failed", lineup: [] },
      { status: 500 },
    );
  }
}
