import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoPageContent } from "@/components/VideoPageContent";
import {
  buildVideoShareMetadata,
  buildVideoStructuredData,
} from "@/lib/videoMetadata";
import { getTrendingVideos, getVideoById } from "@/lib/videos";

export const dynamic = "force-dynamic";

type VideoPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    return {
      title: "Video not found",
      robots: { index: false, follow: false },
    };
  }

  return buildVideoShareMetadata(video);
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const [video, feed] = await Promise.all([getVideoById(id), getTrendingVideos()]);

  if (!video) {
    notFound();
  }

  const structuredData = buildVideoStructuredData(video);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <VideoPageContent video={video} feed={feed} />
    </>
  );
}
