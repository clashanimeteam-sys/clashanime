import { NextResponse } from "next/server";
import { loadAdPlacementSettings } from "@/lib/ads/placements.server";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await loadAdPlacementSettings();
  return NextResponse.json(
    { settings },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
