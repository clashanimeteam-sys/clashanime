import { NextResponse } from "next/server";
import { getFeaturedSeasonalGuide } from "@/lib/animeNews.server";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const article = await getFeaturedSeasonalGuide();
  return NextResponse.json({ article });
}
