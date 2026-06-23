import type { Metadata } from "next";
import { MusicPageContent } from "@/components/MusicPageContent";
import { getAnimeSeoCatalog } from "@/lib/animeTracker.server";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { getAnimeBeatsPlaylist } from "@/lib/animeBeatsLounge.server";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getAnimeSeoCatalog();
  return buildPageMetadata("music", { dbAnime: catalog });
}

export default async function MusicPage() {
  const initialPlaylist = await getAnimeBeatsPlaylist();

  return (
    <Suspense fallback={null}>
      <MusicPageContent initialPlaylist={initialPlaylist} />
    </Suspense>
  );
}
