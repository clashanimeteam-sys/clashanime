import { VideosPageContent } from "@/components/VideosPageContent";
import { getRecentVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await getRecentVideos();
  return <VideosPageContent videos={videos} />;
}
