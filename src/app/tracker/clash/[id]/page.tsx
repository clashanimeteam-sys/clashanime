import { notFound } from "next/navigation";
import { AnimeReleaseClashPageContent } from "@/components/tracker/AnimeReleaseClashPageContent";
import {
  getAnimeReleaseClashDetail,
  getAnimeReleaseClashVideos,
} from "@/lib/animeTracker.server";

export const dynamic = "force-dynamic";

type AnimeReleaseClashPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnimeReleaseClashPage({ params }: AnimeReleaseClashPageProps) {
  const { id } = await params;
  const [clash, videos] = await Promise.all([
    getAnimeReleaseClashDetail(id),
    getAnimeReleaseClashVideos(id, 24),
  ]);

  if (!clash) notFound();

  return <AnimeReleaseClashPageContent clash={clash} videos={videos} />;
}
