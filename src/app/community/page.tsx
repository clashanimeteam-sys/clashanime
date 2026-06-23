import type { Metadata } from "next";
import { CommunityPageContent } from "@/components/CommunityPageContent";
import { getAnimeSeoCatalog } from "@/lib/animeTracker.server";
import { buildPageMetadata } from "@/lib/seoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getAnimeSeoCatalog();
  return buildPageMetadata("community", { dbAnime: catalog });
}

export default function CommunityPage() {
  return <CommunityPageContent />;
}
