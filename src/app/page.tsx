import { HomeContent } from "@/components/HomeContent";
import { getClashVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const videos = await getClashVideos();

  return <HomeContent videos={videos} />;
}
