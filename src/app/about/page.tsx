import type { Metadata } from "next";
import { AboutPageContent } from "@/components/AboutPageContent";
import { getAnimeSeoCatalog } from "@/lib/animeTracker.server";
import { buildPageMetadata } from "@/lib/seoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getAnimeSeoCatalog();
  return buildPageMetadata("about", { dbAnime: catalog });
}

export default function AboutPage() {
  return <AboutPageContent />;
}
