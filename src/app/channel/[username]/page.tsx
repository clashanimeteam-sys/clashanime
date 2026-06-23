import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChannelProfileContent } from "@/components/ChannelProfileContent";
import { JsonLd } from "@/components/JsonLd";
import { getPublicChannelByUsername } from "@/lib/channels.server";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { absoluteSiteUrl } from "@/lib/siteSeo";

export const dynamic = "force-dynamic";

type ChannelPageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: ChannelPageProps): Promise<Metadata> {
  const { username } = await params;
  const channel = await getPublicChannelByUsername(username);

  if (!channel) {
    return { title: "Channel — Clash Anime" };
  }

  const displayName = channel.profile.display_name ?? channel.profile.username;
  const title = `${displayName} (@${channel.profile.username}) — Clash Anime Channel`;
  const description =
    channel.profile.bio?.trim() ||
    `Watch ${channel.videoCount} anime clips from ${displayName} on Clash Anime. ${channel.communityPostCount} community posts — ${channel.followerCount} followers — قناة انمي — アニメチャンネル.`;
  const path = `/channel/${encodeURIComponent(channel.profile.username)}`;

  return buildPageMetadata("videos", {
    title,
    description,
    path,
    extraKeywords: [displayName, channel.profile.username, "anime channel", "anime creator"],
  });
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { username } = await params;
  const channel = await getPublicChannelByUsername(username);

  if (!channel) notFound();

  const displayName = channel.profile.display_name ?? channel.profile.username;
  const channelUrl = absoluteSiteUrl(`/channel/${channel.profile.username}`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: displayName,
          description: channel.profile.bio?.trim() || `${displayName} on Clash Anime`,
          url: channelUrl,
          image: channel.profile.avatar_url ?? undefined,
          mainEntity: {
            "@type": "Person",
            name: displayName,
            alternateName: `@${channel.profile.username}`,
            image: channel.profile.avatar_url ?? undefined,
          },
        }}
      />
      <ChannelProfileContent username={username} />
    </>
  );
}
