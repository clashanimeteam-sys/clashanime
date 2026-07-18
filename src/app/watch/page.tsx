import { WatchComingSoon } from "@/components/watch/WatchComingSoon";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata("watch", {
  indexable: false,
  title: "Watch Anime — Coming soon | ClashAnime",
  description:
    "Watch Anime on ClashAnime is coming soon. Compete in clashes and climb hunter ranks meanwhile.",
});

export default function WatchPage() {
  return <WatchComingSoon />;
}
