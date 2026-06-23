import type { Metadata } from "next";
import type { Video } from "@/lib/types";
import { SITE_URL } from "@/lib/siteSeo";

const SITE_NAME = "Clash Anime";

function absoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, SITE_URL).toString();
}

function formatEngagementCount(value: number): string {
  return value.toLocaleString("en-US");
}

export function buildVideoShareDescription(video: Video): string {
  const parts: string[] = [];

  if (video.description?.trim()) {
    parts.push(video.description.trim());
  }

  if (video.channel?.username) {
    const creator = video.channel.display_name?.trim() || `@${video.channel.username}`;
    parts.push(`By ${creator}`);
  }

  const stats = [
    video.views_count != null ? `${formatEngagementCount(video.views_count)} views` : null,
    `${formatEngagementCount(video.likes_count)} likes`,
    `${formatEngagementCount(video.comments_count)} comments`,
  ].filter(Boolean);

  if (stats.length > 0) {
    parts.push(stats.join(" · "));
  }

  if (video.hashtags?.length) {
    parts.push(video.hashtags.map((tag) => `#${tag}`).join(" "));
  }

  if (parts.length === 0) {
    return "Watch this anime clip on ClashAnime — ranked by community engagement.";
  }

  return parts.join(" · ").slice(0, 300);
}

export function buildVideoShareMetadata(video: Video): Metadata {
  const pageUrl = `${SITE_URL}/video/${video.id}`;
  const title = video.title.trim() || "Clash Anime Video";
  const description = buildVideoShareDescription(video);
  const imageUrl = absoluteUrl(video.thumbnail_url);

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      type: "video.other",
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 540,
          height: 960,
          alt: title,
          type: "image/jpeg",
        },
      ],
      ...(video.video_url
        ? {
            videos: [
              {
                url: absoluteUrl(video.video_url),
                width: 540,
                height: 960,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildVideoStructuredData(video: Video) {
  const pageUrl = `${SITE_URL}/video/${video.id}`;
  const imageUrl = absoluteUrl(video.thumbnail_url);

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: buildVideoShareDescription(video),
    thumbnailUrl: imageUrl,
    uploadDate: video.created_at,
    url: pageUrl,
    ...(video.video_url ? { contentUrl: absoluteUrl(video.video_url) } : {}),
    ...(video.duration_seconds ? { duration: `PT${Math.round(video.duration_seconds)}S` } : {}),
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: { "@type": "LikeAction" },
        userInteractionCount: video.likes_count,
      },
      {
        "@type": "InteractionCounter",
        interactionType: { "@type": "CommentAction" },
        userInteractionCount: video.comments_count,
      },
      ...(video.views_count != null
        ? [
            {
              "@type": "InteractionCounter",
              interactionType: { "@type": "WatchAction" },
              userInteractionCount: video.views_count,
            },
          ]
        : []),
    ],
    ...(video.channel?.username
      ? {
          author: {
            "@type": "Person",
            name: video.channel.display_name || video.channel.username,
            url: `${SITE_URL}/channel/${video.channel.username}`,
          },
        }
      : {}),
  };
}
