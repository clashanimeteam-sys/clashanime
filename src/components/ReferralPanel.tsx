"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getFlashEventTitle,
  getReferralAvatarFrameClass,
  getReferralTierDefinition,
  getReferralTierProgress,
  REFERRAL_POINT_VALUES,
  type ReferralFlashEvent,
  type ReferralLeaderboardRow,
  type ReferralStats,
} from "@/lib/referrals";
import { getReferralUrl } from "@/lib/points";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";
import type { Profile } from "@/lib/types";

type ReferralPanelProps = {
  profile: Profile;
};

function panelBoxClassName(extra = "") {
  return `overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-orange-50/40 p-5 dark:border-zinc-800 dark:from-zinc-950 dark:via-black dark:to-orange-950/20 ${extra}`.trim();
}

export function ReferralPanel({ profile }: ReferralPanelProps) {
  const { t, locale, formatNumber } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const referralUrl = getReferralUrl(profile.username);
  const tierDef = getReferralTierDefinition(profile.referral_tier ?? 0);

  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<ReferralLeaderboardRow[]>([]);
  const [flashEvent, setFlashEvent] = useState<ReferralFlashEvent | null>(null);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"week" | "all">("week");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);

    const [statsResult, leaderboardResult, flashResult] = await Promise.all([
      supabase.rpc("get_my_referral_stats"),
      supabase.rpc("get_referral_leaderboard", {
        p_period: leaderboardPeriod,
        p_limit: 10,
      }),
      supabase.rpc("get_active_referral_multiplier"),
    ]);

    if (!statsResult.error && statsResult.data) {
      setStats(statsResult.data as ReferralStats);
    }

    if (!leaderboardResult.error && leaderboardResult.data) {
      setLeaderboard(leaderboardResult.data as ReferralLeaderboardRow[]);
    }

    const flashRows = flashResult.data as ReferralFlashEvent[] | ReferralFlashEvent | null;
    const flashRow = Array.isArray(flashRows) ? flashRows[0] ?? null : flashRows;
    setFlashEvent(flashRow);
    setLoading(false);
  }, [supabase, leaderboardPeriod]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const signupCount = stats?.signup_count ?? 0;
  const tierProgress = getReferralTierProgress(signupCount, profile.referral_tier ?? 0);
  const flashTitle = getFlashEventTitle(flashEvent, locale);

  async function copyReferralLink() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="referral" className={panelBoxClassName()}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {t.points.referralSystemLabel}
          </p>
          <h2 className="mt-1 text-xl font-bold text-black dark:text-white">{t.points.referralTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{t.points.referralHintV2}</p>
        </div>
        {tierDef.tier > 0 ? (
          <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            {t.points.referralTiers[tierDef.key as "scout" | "recruit" | "leader"]}
          </span>
        ) : null}
      </div>

      {flashTitle && flashEvent ? (
        <div className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{flashTitle}</p>
          <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-200/80">
            {t.points.referralFlashActive.replace("{multiplier}", String(flashEvent.multiplier))}
          </p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white/90 p-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
          <p className="text-sm font-semibold text-black dark:text-white">{t.points.referralDoubleSidedTitle}</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <li>
              +{formatNumber(REFERRAL_POINT_VALUES.signupReferrer)} · {t.points.earn.referralSignupYou}
            </li>
            <li>
              +{formatNumber(REFERRAL_POINT_VALUES.signupInvitee)} · {t.points.earn.referralSignupFriend}
            </li>
            <li>
              +{formatNumber(REFERRAL_POINT_VALUES.firstVideo)} · {t.points.earn.referralFirstVideo}
            </li>
            <li>
              +{formatNumber(REFERRAL_POINT_VALUES.firstBattle)} · {t.points.earn.referralFirstBattle}
            </li>
            <li>
              +{formatNumber(REFERRAL_POINT_VALUES.click)} · {t.points.earn.referralClick}
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/90 p-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
          <p className="text-sm font-semibold text-black dark:text-white">{t.points.referralStatsTitle}</p>
          {loading ? (
            <p className="mt-3 text-sm text-zinc-500">{t.profile.loading}</p>
          ) : (
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-zinc-500">{t.points.referralStatsTotal}</dt>
                <dd className="font-bold text-black dark:text-white">{formatNumber(signupCount)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">{t.points.referralStatsWeek}</dt>
                <dd className="font-bold text-black dark:text-white">{formatNumber(stats?.week_signups ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">{t.points.referralStatsVideoBonus}</dt>
                <dd className="font-bold text-black dark:text-white">
                  {formatNumber(stats?.engagement_first_video ?? 0)}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">{t.points.referralStatsBattleBonus}</dt>
                <dd className="font-bold text-black dark:text-white">
                  {formatNumber(stats?.engagement_first_battle ?? 0)}
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white/90 p-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-black dark:text-white">{t.points.referralMilestoneTitle}</p>
          {tierProgress.nextTier ? (
            <span className="text-xs text-zinc-500">
              {formatNumber(tierProgress.current)} / {formatNumber(tierProgress.target)}
            </span>
          ) : (
            <span className="text-xs font-semibold text-amber-500">{t.points.referralMaxTier}</span>
          )}
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-orange-400 transition-all"
            style={{ width: `${tierProgress.progress}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["scout", "recruit", "leader"] as const).map((key) => {
            const tierEntry = key === "scout" ? 1 : key === "recruit" ? 2 : 3;
            const unlocked = (profile.referral_tier ?? 0) >= tierEntry;
            return (
              <span
                key={key}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  unlocked
                    ? "bg-accent/15 text-accent"
                    : "border border-zinc-300 text-zinc-500 dark:border-zinc-700"
                }`}
              >
                {t.points.referralTiers[key]}
              </span>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-zinc-500">{t.points.referralCosmeticHint}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={referralUrl}
          className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-black outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
        />
        <button
          type="button"
          onClick={() => void copyReferralLink()}
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          {copied ? t.points.linkCopied : t.points.copyReferral}
        </button>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-black dark:text-white">{t.points.referralLeaderboardTitle}</h3>
          <div className="flex gap-2">
            {(["week", "all"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setLeaderboardPeriod(period)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  leaderboardPeriod === period
                    ? "bg-accent/20 text-accent"
                    : "border border-zinc-300 text-zinc-500 dark:border-zinc-700"
                }`}
              >
                {period === "week" ? t.points.referralLeaderboardWeek : t.points.referralLeaderboardAll}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-500">{t.profile.loading}</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-sm text-zinc-500">{t.points.referralLeaderboardEmpty}</p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {leaderboard.map((row) => (
              <li key={row.user_id} className="flex items-center gap-3 bg-white/80 px-4 py-3 dark:bg-black/40">
                <span className="w-6 shrink-0 text-sm font-bold text-zinc-500">#{row.rank}</span>
                <div
                  className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 ${getReferralAvatarFrameClass(row.referral_tier)}`}
                >
                  {row.avatar_url ? (
                    <Image src={row.avatar_url} alt="" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                      {(row.display_name || row.username).slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/@${row.username}`}
                    className="truncate text-sm font-semibold text-black hover:text-accent dark:text-white"
                  >
                    {row.display_name}
                  </Link>
                  <p className="text-xs text-zinc-500">@{row.username}</p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-bold text-accent">{formatNumber(row.signup_count)}</p>
                  <p className="text-xs text-zinc-500">{t.points.referralLeaderboardInvites}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
