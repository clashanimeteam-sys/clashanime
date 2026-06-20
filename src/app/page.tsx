import { VideoCard } from "@/components/VideoCard";
import { getTrendingVideos } from "@/lib/videos";

export default async function Home() {
  const videos = await getTrendingVideos();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Duel System
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Trending Anime Duels
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
          Videos rise to the top based on real-time likes and comments. The
          fastest-growing clips win the grid.
        </p>
        <p className="mt-2 text-xs font-medium text-brand/80">
          ClashAnime is live on www.clashanime.com
        </p>
      </section>

      <section
        aria-label="Trending duel grid"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} rank={index + 1} />
        ))}
      </section>
    </div>
  );
}
