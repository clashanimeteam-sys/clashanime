import { VideosPageContent } from "@/components/VideosPageContent";
import { getVideosCatalog } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await getVideosCatalog();
  return <VideosPageContent videos={videos} />;
}
