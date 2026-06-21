import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoPageContent, type VideoFeedMode } from "@/components/VideoPageContent";
import {
  buildVideoShareMetadata,
  buildVideoStructuredData,
} from "@/lib/videoMetadata";
import { CLASH_TOP_COUNT } from "@/lib/videoRanking";
import { getClashVideos, getVideoById, getVideosCatalog } from "@/lib/videos";

export const dynamic = "force-dynamic";

type VideoPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ feed?: string }>;
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

function resolveFeedMode(
  requestedFeed: string | undefined,
  globalRank: number | undefined,
): VideoFeedMode {
  if (requestedFeed === "catalog") return "catalog";
  if (requestedFeed === "clash") return "clash";
  if (typeof globalRank === "number" && globalRank >= 1 && globalRank <= CLASH_TOP_COUNT) {
    return "clash";
  }
  return "catalog";
}

export default async function VideoPage({ params, searchParams }: VideoPageProps) {
  const { id } = await params;
  const { feed: requestedFeed } = await searchParams;
  const [video, clashFeed, catalogFeed] = await Promise.all([
    getVideoById(id),
    getClashVideos(),
    getVideosCatalog(),
  ]);

  if (!video) {
    notFound();
  }

  const feedMode = resolveFeedMode(requestedFeed, video.global_rank);
  const feed = feedMode === "clash" ? clashFeed : catalogFeed;
  const structuredData = buildVideoStructuredData(video);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <VideoPageContent video={video} feed={feed} feedMode={feedMode} />
    </>
  );
}
