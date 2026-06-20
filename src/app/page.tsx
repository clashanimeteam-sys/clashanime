import { HomeContent } from "@/components/HomeContent";
import { getTrendingVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const videos = await getTrendingVideos();

  return <HomeContent videos={videos} />;
}
