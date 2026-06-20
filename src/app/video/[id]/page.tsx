import { notFound } from "next/navigation";
import { VideoPageContent } from "@/components/VideoPageContent";
import { getVideoById } from "@/lib/videos";

export const dynamic = "force-dynamic";

type VideoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  return <VideoPageContent video={video} />;
}
