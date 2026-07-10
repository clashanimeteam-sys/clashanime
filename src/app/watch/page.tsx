import { WatchAnimeFrame } from "@/components/WatchAnimeFrame";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata("watch");

export default function WatchPage() {
  return <WatchAnimeFrame />;
}
