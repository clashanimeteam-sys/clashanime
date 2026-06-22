import { MusicPageContent } from "@/components/MusicPageContent";
import { getAnimeBeatsPlaylist } from "@/lib/animeBeatsLounge.server";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function MusicPage() {
  const initialPlaylist = await getAnimeBeatsPlaylist();

  return (
    <Suspense fallback={null}>
      <MusicPageContent initialPlaylist={initialPlaylist} />
    </Suspense>
  );
}
