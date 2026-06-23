import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HashtagPageContent } from "@/components/HashtagPageContent";
import { JsonLd } from "@/components/JsonLd";
import { getHashtagPageStats, getHashtagVideos } from "@/lib/hashtags.server";
import { normalizeHashtagSlug } from "@/lib/hashtagUrls";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { absoluteSiteUrl } from "@/lib/siteSeo";

export const dynamic = "force-dynamic";

type HashtagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: HashtagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const stats = await getHashtagPageStats(decodeURIComponent(tag));

  if (!stats || stats.videoCount === 0) {
    const slug = normalizeHashtagSlug(decodeURIComponent(tag));
    return {
      title: slug ? `#${slug} — Clash Anime` : "Hashtag — Clash Anime",
    };
  }

  const title = `#${stats.tag} — Anime Clips on Clash Anime`;
  const description = `Watch ${stats.videoCount} anime clips tagged #${stats.tag} from ${stats.channelCount} creators on Clash Anime — مقاطع انمي — アニメクリップ.`;
  const path = `/hashtag/${encodeURIComponent(stats.tag)}`;

  return buildPageMetadata("videos", {
    title,
    description,
    path,
    extraKeywords: [stats.tag, `#${stats.tag}`, "anime hashtag", "anime clips"],
  });
}

export default async function HashtagPage({ params }: HashtagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const [stats, videos] = await Promise.all([
    getHashtagPageStats(decodedTag),
    getHashtagVideos(decodedTag, 48),
  ]);

  if (!stats) notFound();

  const pageUrl = absoluteSiteUrl(`/hashtag/${encodeURIComponent(stats.tag)}`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `#${stats.tag}`,
          description: `Anime clips tagged #${stats.tag} on Clash Anime`,
          url: pageUrl,
          numberOfItems: stats.videoCount,
        }}
      />
      <HashtagPageContent stats={stats} videos={videos} />
    </>
  );
}
