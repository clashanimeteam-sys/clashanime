"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { BountyRewardsGrid, getNextRankLabel } from "@/components/BountyRewardsGrid";
import { HunterLevelBadge } from "@/components/HunterLevelBadge";
import {
  canUploadVideos,
  getLevelProgress,
  getReferralUrl,
  POINT_VALUES,
} from "@/lib/points";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import type { Profile } from "@/lib/types";

type PointTransaction = {
  id: string;
  amount: number;
  reason: string;
  created_at: string;
};

type PointsPanelProps = {
  profile: Profile;
  onProfileRefresh?: () => Promise<void>;
};

function getTransactionLabel(
  reason: string,
  labels: Record<string, string>,
) {
  return labels[reason] ?? reason;
}

export function PointsPanel({ profile, onProfileRefresh }: PointsPanelProps) {
  const { t } = useLocale();
  const { refreshProfile } = useAuth();
  const supabase = useMemo(() => createBrowserClient(), []);

  const progress = getLevelProgress(profile.points ?? 0);
  const referralUrl = getReferralUrl(profile.username);
  const uploadUnlocked = canUploadVideos(profile);
  const nextRankLabel = getNextRankLabel(progress.nextLevelKey, t);

  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const loadTransactions = useCallback(async () => {
    if (!supabase) return;

    setLoadingTransactions(true);

    const { data } = await supabase
      .from("point_transactions")
      .select("id, amount, reason, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(8);

    setTransactions(data ?? []);
    setLoadingTransactions(false);
  }, [supabase, profile.id]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  async function copyReferralLink() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function submitVerificationRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || profile.is_verified) return;

    setSubmittingVerification(true);
    setVerificationError(null);
    setVerificationStatus(null);

    const { error } = await supabase.rpc("request_channel_verification", {
      request_message: verificationMessage.trim() || null,
    });

    setSubmittingVerification(false);

    if (error) {
      setVerificationError(error.message);
      return;
    }

    setVerificationStatus(t.points.verificationSubmitted);
    setVerificationMessage("");
    await onProfileRefresh?.();
    await refreshProfile();
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-orange-50/40 p-5 dark:border-zinc-800 dark:from-zinc-950 dark:via-black dark:to-orange-950/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {t.points.systemTitle}
          </p>
          <h2 className="mt-1 text-xl font-bold text-black dark:text-white">{t.points.hunterRank}</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.points.bountyRewardsHint}</p>
        </div>
        <HunterLevelBadge level={profile.level} points={profile.points} size="lg" />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white/90 p-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
          <p className="text-sm text-zinc-500">{t.points.totalPoints}</p>
          <p className="mt-1 text-3xl font-black text-black dark:text-white">
            {(profile.points ?? 0).toLocaleString()}
          </p>
          {progress.next ? (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                <span>
                  {nextRankLabel
                    ? `${t.points.nextLevel}: ${nextRankLabel}`
                    : t.points.nextLevel}
                </span>
                <span>{progress.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-orange-400 transition-all"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {t.points.pointsToNext.replace("{count}", progress.pointsToNext.toLocaleString())}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-xs font-semibold text-amber-500">{t.points.maxLevelReached}</p>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/90 p-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
          <p className="text-sm font-semibold text-black dark:text-white">{t.points.perksTitle}</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <li>{uploadUnlocked ? "✓" : "○"} {t.points.perks.voteComment}</li>
            <li>{uploadUnlocked ? "✓" : "○"} {t.points.perks.upload}</li>
            <li>{progress.level >= 3 ? "✓" : "○"} {t.points.perks.doubleVote}</li>
            <li>{progress.level >= 4 || profile.is_verified ? "✓" : "○"} {t.points.perks.legend}</li>
          </ul>
        </div>
      </div>

      <BountyRewardsGrid currentLevel={progress.level} />

      <div className="mt-5 rounded-xl border border-zinc-200 bg-white/90 p-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <h3 className="text-sm font-semibold text-black dark:text-white">{t.points.bountyLogTitle}</h3>
        {loadingTransactions ? (
          <p className="mt-3 text-sm text-zinc-500">{t.profile.loading}</p>
        ) : transactions.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">{t.points.bountyLogEmpty}</p>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-900">
            {transactions.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div>
                  <p className="font-medium text-black dark:text-white">
                    {getTransactionLabel(entry.reason, t.points.transactionReasons)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="shrink-0 font-bold text-accent">+{entry.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-zinc-200 bg-white/90 p-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <h3 className="text-sm font-semibold text-black dark:text-white">{t.points.howToEarn}</h3>
        <ul className="mt-3 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2 dark:text-zinc-300">
          <li>+{POINT_VALUES.referralClick} · {t.points.earn.referralClick}</li>
          <li>+{POINT_VALUES.referralSignup} · {t.points.earn.referralSignup}</li>
          <li>+{POINT_VALUES.videoLike} · {t.points.earn.videoLike}</li>
          <li>+{POINT_VALUES.videoUpload} · {t.points.earn.videoUpload}</li>
          <li>+{POINT_VALUES.communityPost} · {t.points.earn.communityPost}</li>
          <li>+{POINT_VALUES.trendingBonus} · {t.points.earn.trendingBonus}</li>
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-zinc-200 bg-white/90 p-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <h3 className="text-sm font-semibold text-black dark:text-white">{t.points.referralTitle}</h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.points.referralHint}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={referralUrl}
            className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-black outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
          <button
            type="button"
            onClick={copyReferralLink}
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            {copied ? t.points.linkCopied : t.points.copyReferral}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-zinc-200 bg-white/90 p-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
        <h3 className="text-sm font-semibold text-black dark:text-white">{t.points.verificationTitle}</h3>
        {profile.is_verified ? (
          <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{t.points.alreadyVerified}</p>
        ) : progress.level >= 4 ? (
          <p className="mt-2 text-sm text-amber-500">{t.points.legendAutoVerify}</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.points.verificationHint}</p>
            <form onSubmit={submitVerificationRequest} className="mt-3 space-y-3">
              <textarea
                value={verificationMessage}
                onChange={(event) => setVerificationMessage(event.target.value)}
                rows={3}
                placeholder={t.points.verificationPlaceholder}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
              />
              <button
                type="submit"
                disabled={submittingVerification}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-black transition-colors hover:border-accent hover:text-accent disabled:opacity-60 dark:border-zinc-700 dark:text-white"
              >
                {submittingVerification ? t.points.verificationSubmitting : t.points.requestVerification}
              </button>
            </form>
          </>
        )}
        {verificationStatus ? (
          <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{verificationStatus}</p>
        ) : null}
        {verificationError ? (
          <p className="mt-3 text-sm text-red-500" role="alert">
            {verificationError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
