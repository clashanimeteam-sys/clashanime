"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { getKycCountryByCode, getKycCountryLabel } from "@/lib/kycCountries";
import { absoluteSiteUrl } from "@/lib/siteSeo";
import { useLocale } from "@/providers/LocaleProvider";
import type { Profile } from "@/lib/types";

export type ChannelAboutStats = {
  followerCount: number;
  videoCount: number;
  totalViews: number;
};

type ChannelAboutSectionProps = {
  profile: Profile;
  stats: ChannelAboutStats;
  showReportAction?: boolean;
};

function normalizeExternalUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function AboutRow({
  icon,
  children,
  href,
}: {
  icon: React.ReactNode;
  children: ReactNode;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 shrink-0 text-zinc-500 dark:text-zinc-400">{icon}</span>
      <span className="min-w-0 text-sm text-zinc-800 dark:text-zinc-200">{children}</span>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:text-accent">
        {content}
      </a>
    );
  }

  return content;
}

export function ChannelAboutSection({ profile, stats, showReportAction = true }: ChannelAboutSectionProps) {
  const { t, locale, formatNumber, formatDateTime } = useLocale();
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const countryLabel = useMemo(() => {
    if (!profile.country_code) return null;
    const country = getKycCountryByCode(profile.country_code);
    if (country) return getKycCountryLabel(country, locale);
    return profile.country_name ?? profile.country_code;
  }, [profile.country_code, profile.country_name, locale]);

  const channelUrl = absoluteSiteUrl(`/channel/${profile.username}`);
  const youtubeUrl = profile.youtube_url?.trim() ? normalizeExternalUrl(profile.youtube_url) : null;

  const handleShare = useCallback(async () => {
    setShareMessage(null);
    const title = profile.display_name ?? profile.username;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url: channelUrl });
        return;
      }

      await navigator.clipboard.writeText(channelUrl);
      setShareMessage(t.profile.channelLinkCopied);
    } catch {
      setShareMessage(t.profile.channelShareFailed);
    }
  }, [channelUrl, profile.display_name, profile.username, t.profile.channelLinkCopied, t.profile.channelShareFailed]);

  return (
    <div className="mt-5 max-w-2xl">
      <h3 className="text-base font-bold text-black dark:text-white">{t.profile.channelMoreInfo}</h3>

      <div className="mt-3 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {youtubeUrl ? (
          <AboutRow
            href={youtubeUrl}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5L15.8 12l-6.1 3.5z" />
              </svg>
            }
          >
            {youtubeUrl.replace(/^https?:\/\//, "")}
          </AboutRow>
        ) : null}

        {countryLabel ? (
          <AboutRow
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
              </svg>
            }
          >
            {countryLabel}
          </AboutRow>
        ) : null}

        <AboutRow
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          }
        >
          {t.profile.channelJoinedDate.replace(
            "{date}",
            formatDateTime(profile.created_at, { year: "numeric", month: "2-digit", day: "2-digit" }),
          )}
        </AboutRow>

        <AboutRow
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        >
          {t.profile.channelFollowersStat.replace("{count}", formatNumber(stats.followerCount))}
        </AboutRow>

        <AboutRow
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M10 9l6 3-6 3V9z" />
            </svg>
          }
        >
          {t.profile.channelVideosStat.replace("{count}", formatNumber(stats.videoCount))}
        </AboutRow>

        <AboutRow
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M14 7h7v7" />
            </svg>
          }
        >
          {t.profile.channelViewsStat.replace("{count}", formatNumber(stats.totalViews))}
        </AboutRow>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleShare()}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
            <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
            <path d="M16 6l-4-4-4 4" />
            <path d="M12 2v14" />
          </svg>
          {t.profile.shareChannel}
        </button>

        {showReportAction ? (
          <Link
            href={`/report?details=${encodeURIComponent(`${t.profile.reportUserHint} @${profile.username}`)}`}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <path d="M4 22v-7" />
            </svg>
            {t.profile.reportUser}
          </Link>
        ) : null}
      </div>

      {shareMessage ? (
        <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400" role="status">
          {shareMessage}
        </p>
      ) : null}
    </div>
  );
}
