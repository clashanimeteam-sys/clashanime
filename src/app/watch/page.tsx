import { WatchComingSoon } from "@/components/watch/WatchComingSoon";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { loadWatchComingSoonCover } from "@/lib/watchComingSoonCover.server";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata("watch", {
  indexable: false,
  title: "Watch Anime — Coming soon | ClashAnime",
  description:
    "Watch Anime on ClashAnime is coming soon. Compete in clashes and climb hunter ranks meanwhile.",
});

export default async function WatchPage() {
  const cover = await loadWatchComingSoonCover();
  return <WatchComingSoon cover={cover} />;
}
