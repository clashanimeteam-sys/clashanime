import { NextResponse } from "next/server";
import { loadBlogHeroDisplaySettings, loadEnabledBlogHeroSlides } from "@/lib/blog/heroSlides.server";

export const dynamic = "force-dynamic";

export async function GET() {
  const [slides, display] = await Promise.all([
    loadEnabledBlogHeroSlides(),
    loadBlogHeroDisplaySettings(),
  ]);

  return NextResponse.json({ slides, display });
}
