"use client";

import Image from "next/image";
import { HunterLevelBadge } from "@/components/HunterLevelBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useLocale } from "@/providers/LocaleProvider";
import type { Profile } from "@/lib/types";
import type { ReactNode } from "react";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type ChannelHeroProps = {
  profile: Profile;
  followerCount: number;
  videoCount: number;
  communityPostCount?: number;
  actions?: ReactNode;
};

export function ChannelHero({
  profile,
  followerCount,
  videoCount,
  communityPostCount = 0,
  actions,
}: ChannelHeroProps) {
  const { t, formatNumber } = useLocale();
  const displayName = profile.display_name ?? profile.username;

  const statsLine = t.profile.channelStats
    .replace("{followers}", formatNumber(followerCount))
    .replace("{videos}", formatNumber(videoCount))
    .replace("{posts}", formatNumber(communityPostCount));

  return (
    <header className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black sm:h-44 md:h-52">
        {profile.banner_url ? (
          <Image
            src={profile.banner_url}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1920px) 100vw, 1920px"
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden />
      </div>

      <div className="px-4 pb-5 sm:px-6">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-zinc-200 shadow-lg sm:h-32 sm:w-32 dark:border-zinc-950 dark:bg-zinc-900">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={displayName}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-zinc-500">
                  {getInitials(displayName)}
                </div>
              )}
            </div>

            <div className="min-w-0 pb-1 sm:max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold leading-tight text-black sm:text-3xl dark:text-white">
                  {displayName}
                </h1>
                {profile.is_verified ? <VerifiedBadge size="md" /> : null}
              </div>
              <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                @{profile.username}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <HunterLevelBadge level={profile.level} points={profile.points} size="md" />
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                  {formatNumber(profile.points ?? 0)} {t.points.pointsLabel}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{statsLine}</p>
            </div>
          </div>

          {actions ? <div className="shrink-0 sm:pb-1">{actions}</div> : null}
        </div>

        {profile.bio?.trim() ? (
          <div className="mt-5 max-w-3xl rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              {t.profile.channelAbout}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              {profile.bio.trim()}
            </p>
          </div>
        ) : null}
      </div>
    </header>
  );
}
