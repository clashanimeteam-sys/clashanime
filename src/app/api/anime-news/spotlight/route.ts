import { NextResponse } from "next/server";
import { getStoredAnimeSpotlightCatalog } from "@/lib/animeNews.server";
import { parseFeaturedAnimeCatalog, getFeaturedAnimeCatalog } from "@/lib/animeNews/featuredAnimeEnrich";

export const dynamic = "force-dynamic";
export const revalidate = 86400;
export const maxDuration = 300;

export async function GET() {
  try {
    const storedRaw = await getStoredAnimeSpotlightCatalog();
    const stored = parseFeaturedAnimeCatalog(storedRaw);
    const catalog = await getFeaturedAnimeCatalog(stored);

    return NextResponse.json({
      catalog,
      count: catalog.length,
      enriched: catalog.filter((entry) => entry.posterUrl && entry.synopsis).length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Spotlight fetch failed", catalog: [] },
      { status: 500 },
    );
  }
}
