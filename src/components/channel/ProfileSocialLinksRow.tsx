"use client";

import { SocialLinkIcon } from "@/components/channel/SocialLinkIcon";
import {
  formatSocialLinkLabel,
  getProfileSocialLinks,
  type SocialPlatform,
} from "@/lib/socialLinks";
import { useLocale } from "@/providers/LocaleProvider";
import type { Profile } from "@/lib/types";

type ProfileSocialLinksRowProps = {
  profile: Pick<Profile, "youtube_url" | "instagram_url" | "tiktok_url" | "twitter_url" | "website_url">;
  compact?: boolean;
};

function platformLabel(
  platform: SocialPlatform,
  labels: ReturnType<typeof useLocale>["t"]["profile"]["socialPlatforms"],
) {
  return labels[platform];
}

export function ProfileSocialLinksRow({ profile, compact = false }: ProfileSocialLinksRowProps) {
  const { t } = useLocale();
  const links = getProfileSocialLinks(profile);

  if (links.length === 0) return null;

  if (compact) {
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={platformLabel(link.platform, t.profile.socialPlatforms)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 transition-colors hover:border-accent hover:text-accent dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
          >
            <SocialLinkIcon platform={link.platform} className="h-4 w-4" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 py-2.5 hover:text-accent"
        >
          <span className="mt-0.5 shrink-0 text-zinc-500 dark:text-zinc-400">
            <SocialLinkIcon platform={link.platform} />
          </span>
          <span className="min-w-0 text-sm text-zinc-800 dark:text-zinc-200">
            <span className="block font-medium">{platformLabel(link.platform, t.profile.socialPlatforms)}</span>
            <span className="mt-0.5 block truncate text-zinc-500 dark:text-zinc-400">
              {formatSocialLinkLabel(link.url)}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
