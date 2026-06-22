"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DuelArenaContent } from "@/components/duel/DuelArenaContent";
import { AcceptPointsWagerInline } from "@/components/exclusives/AcceptPointsWagerInline";
import {
  cancelPointsWagerDuel,
  resolvePointsWagerDuel,
} from "@/lib/pointsDuels";
import type { PointsWagerDuelRecord } from "@/lib/pointsDuels";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type PointsWagerDuelContentProps = {
  duel: PointsWagerDuelRecord;
};

export function PointsWagerDuelContent({ duel }: PointsWagerDuelContentProps) {
  const { user, refreshProfile } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const pageTitle =
    duel.status === "pending"
      ? t.exclusives.pointsWagerTitle
      : duel.status === "completed"
        ? t.exclusives.wagerCompleted
        : duel.status === "cancelled"
          ? t.exclusives.wagerCancelled
          : t.exclusives.pointsWagerTitle;
  usePageTitle(pageTitle);
  const supabase = useMemo(() => createBrowserClient(), []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCreator = user?.id === duel.creator_id;
  const isOpponent = user?.id === duel.opponent_id;
  const pot = duel.wager_points * 2;

  async function handleResolve() {
    if (!supabase) return;
    setSubmitting(true);
    setError(null);
    const { error: resolveError } = await resolvePointsWagerDuel(supabase, duel.id);
    setSubmitting(false);
    if (resolveError) {
      setError(t.exclusives.pointsWagerFailed);
      return;
    }
    void refreshProfile();
    router.refresh();
  }

  async function handleCancel() {
    if (!supabase) return;
    setSubmitting(true);
    setError(null);
    const { error: cancelError } = await cancelPointsWagerDuel(supabase, duel.id);
    setSubmitting(false);
    if (cancelError) {
      setError(t.exclusives.pointsWagerFailed);
      return;
    }
    void refreshProfile();
    router.push("/exclusives");
  }

  if (duel.status === "pending") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-wide text-amber-600 dark:text-amber-300">
          {t.exclusives.pointsWagerBadge}
        </p>
        <p className="mt-3 text-base text-zinc-700 dark:text-zinc-300">
          {t.exclusives.wagerPotPreview.replace("{pot}", String(pot))}
        </p>

        {isOpponent ? (
          <div className="mt-6">
            <AcceptPointsWagerInline duel={duel} onAccepted={() => router.refresh()} />
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t.exclusives.waitingOpponentInvite.replace("{user}", `@${duel.opponent_username}`)}
            </p>
            {isCreator ? (
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleCancel()}
                className="mt-4 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-700"
              >
                {t.exclusives.cancelWager}
              </button>
            ) : null}
          </div>
        )}

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

        <Link href="/exclusives" className="mt-6 inline-flex text-sm font-semibold text-accent hover:underline">
          {t.exclusives.backToExclusives}
        </Link>
      </div>
    );
  }

  if (duel.status === "completed" || duel.status === "cancelled") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
        {duel.winner_id ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t.exclusives.wagerWinnerPot.replace("{pot}", String(pot))}
          </p>
        ) : null}
        <Link href="/exclusives" className="mt-6 inline-flex text-sm font-semibold text-accent hover:underline">
          {t.exclusives.backToExclusives}
        </Link>
      </div>
    );
  }

  if (!duel.opponentVideo) {
    return null;
  }

  return (
    <DuelArenaContent
      left={duel.creatorVideo}
      right={duel.opponentVideo}
      badge={t.exclusives.pointsWagerBadge}
      title={t.exclusives.pointsWagerTitle}
      description={t.exclusives.pointsWagerArenaDesc.replace("{pot}", String(pot))}
      actions={
        isCreator || isOpponent ? (
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleResolve()}
            className="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50"
          >
            {submitting ? t.exclusives.resolvingWager : t.exclusives.finalizeWager}
          </button>
        ) : undefined
      }
    />
  );
}
