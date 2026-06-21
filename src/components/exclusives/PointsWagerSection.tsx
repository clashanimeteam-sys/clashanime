"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AcceptPointsWagerInline } from "@/components/exclusives/AcceptPointsWagerInline";
import { CreatePointsWagerModal } from "@/components/exclusives/CreatePointsWagerModal";
import { getSignupUrl } from "@/lib/subscriptionGate";
import {
  fetchOpenPointsWagerDuels,
  type PointsWagerDuelRow,
} from "@/lib/pointsDuels";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type PointsWagerSectionProps = {
  publicDuels: PointsWagerDuelRow[];
};

export function PointsWagerSection({ publicDuels }: PointsWagerSectionProps) {
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [myDuels, setMyDuels] = useState<PointsWagerDuelRow[]>([]);

  const loadMyDuels = useCallback(async () => {
    if (!supabase || !user) {
      setMyDuels([]);
      return;
    }
    const rows = await fetchOpenPointsWagerDuels(supabase, user.id);
    setMyDuels(rows);
  }, [supabase, user]);

  useEffect(() => {
    void loadMyDuels();
  }, [loadMyDuels]);

  const pendingInvites = myDuels.filter(
    (duel) => duel.status === "pending" && duel.opponent_id === user?.id,
  );
  const myOpenDuels = myDuels.filter(
    (duel) => duel.creator_id === user?.id && duel.status === "pending",
  );
  const activeDuels = [...myDuels.filter((d) => d.status === "active"), ...publicDuels.filter(
    (d) => d.status === "active" && !myDuels.some((mine) => mine.id === d.id),
  )].slice(0, 6);

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-50 via-white to-yellow-100 p-5 shadow-md shadow-amber-500/10 dark:border-amber-400/30 dark:from-amber-500/10 dark:via-zinc-950/70 dark:to-yellow-600/10 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                {t.exclusives.pointsWagerBadge}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                {t.exclusives.pointsWagerTitle}
              </h2>
              <p className="mt-3 text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-200">
                {t.exclusives.pointsWagerDesc}
              </p>
            </div>

            {user ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-amber-500 px-7 py-3.5 text-base font-extrabold text-zinc-950 shadow-lg shadow-amber-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {t.exclusives.startPointsWager}
              </button>
            ) : (
              <Link
                href={getSignupUrl()}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-amber-500 px-7 py-3.5 text-base font-extrabold text-zinc-950 shadow-lg shadow-amber-500/30"
              >
                {t.exclusives.startPointsWager}
              </Link>
            )}
          </div>

          {pendingInvites.length > 0 ? (
            <div className="space-y-3 rounded-xl border border-amber-300/40 bg-white/70 p-4 dark:border-amber-400/20 dark:bg-black/30">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {t.exclusives.incomingWagerInvites}
              </h3>
              {pendingInvites.map((duel) => (
                <AcceptPointsWagerInline
                  key={duel.id}
                  duel={duel}
                  onAccepted={() => void loadMyDuels()}
                />
              ))}
            </div>
          ) : null}

          {myOpenDuels.length > 0 ? (
            <div className="space-y-2 rounded-xl border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-black/30">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {t.exclusives.yourOpenWagers}
              </h3>
              {myOpenDuels.map((duel) => (
                <Link
                  key={duel.id}
                  href={`/duel/points/${duel.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
                >
                  <span>
                    @{duel.opponent_username} · {duel.wager_points} {t.points.pointsLabel}
                  </span>
                  <span className="font-semibold text-amber-600">{t.exclusives.waitingOpponent}</span>
                </Link>
              ))}
            </div>
          ) : null}

          {activeDuels.length > 0 ? (
            <div className="space-y-2 rounded-xl border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-black/30">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {t.exclusives.activePointsDuels}
              </h3>
              {activeDuels.map((duel) => (
                <Link
                  key={duel.id}
                  href={`/duel/points/${duel.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-sm transition-colors hover:border-amber-400 dark:border-zinc-800"
                >
                  <span>
                    @{duel.opponent_username} · {t.exclusives.potLabel.replace("{pot}", String(duel.wager_points * 2))}
                  </span>
                  <span className="font-semibold text-accent">{t.exclusives.watchDuel}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <CreatePointsWagerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => void loadMyDuels()}
      />
    </>
  );
}
