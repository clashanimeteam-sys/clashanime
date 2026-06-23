import type { Metadata } from "next";
import { VideosPageContent } from "@/components/VideosPageContent";
import { getAnimeSeoCatalog } from "@/lib/animeTracker.server";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { getVideosCatalog } from "@/lib/videos";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getAnimeSeoCatalog();
  return buildPageMetadata("videos", { dbAnime: catalog });
}

export default async function VideosPage() {
  const videos = await getVideosCatalog();
  return <VideosPageContent videos={videos} />;
}
