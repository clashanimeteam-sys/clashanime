import { WatchAnimeFrame } from "@/components/WatchAnimeFrame";
import { WatchPageGate } from "@/components/watch/WatchPageGate";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata("watch");

export default function WatchPage() {
  return (
    <WatchPageGate>
      <WatchAnimeFrame />
    </WatchPageGate>
  );
}
