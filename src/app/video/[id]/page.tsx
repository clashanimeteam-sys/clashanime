import { notFound } from "next/navigation";
import { VideoPageContent } from "@/components/VideoPageContent";
import { getTrendingVideos, getVideoById } from "@/lib/videos";

export const dynamic = "force-dynamic";

type VideoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const [video, feed] = await Promise.all([getVideoById(id), getTrendingVideos()]);

  if (!video) {
    notFound();
  }

  return <VideoPageContent video={video} feed={feed} />;
}
