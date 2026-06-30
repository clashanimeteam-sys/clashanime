import { NextResponse } from "next/server";
import { loadEnabledBlogHeroSlides } from "@/lib/blog/heroSlides.server";

export const dynamic = "force-dynamic";

export async function GET() {
  const slides = await loadEnabledBlogHeroSlides();
  return NextResponse.json({ slides });
}
