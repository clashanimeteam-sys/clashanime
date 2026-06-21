"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  acceptPointsWagerDuel,
  fetchUserApprovedClipsForWager,
  type PointsWagerDuelRow,
} from "@/lib/pointsDuels";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type AcceptPointsWagerInlineProps = {
  duel: PointsWagerDuelRow;
  onAccepted?: () => void;
};

export function AcceptPointsWagerInline({ duel, onAccepted }: AcceptPointsWagerInlineProps) {
  const { user, refreshProfile } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [clips, setClips] = useState<Awaited<ReturnType<typeof fetchUserApprovedClipsForWager>>>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !user) return;
    void fetchUserApprovedClipsForWager(supabase, user.id).then((rows) => {
      setClips(rows);
      setSelectedClipId(rows[0]?.id ?? null);
    });
  }, [supabase, user]);

  async function handleAccept() {
    if (!supabase || !selectedClipId) return;
    setSubmitting(true);
    setError(null);

    const { error: acceptError } = await acceptPointsWagerDuel(supabase, duel.id, selectedClipId);
    setSubmitting(false);

    if (acceptError) {
      setError(t.exclusives.pointsWagerFailed);
      return;
    }

    void refreshProfile();
    onAccepted?.();
    router.push(`/duel/points/${duel.id}`);
  }

  return (
    <div className="rounded-xl border border-amber-300/30 bg-amber-50/50 p-3 dark:border-amber-400/20 dark:bg-amber-500/5">
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
        {t.exclusives.wagerInviteFrom.replace("{wager}", String(duel.wager_points))}
      </p>
      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
        {t.exclusives.wagerPotPreview.replace("{pot}", String(duel.wager_points * 2))}
      </p>

      {clips.length > 0 ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {clips.slice(0, 4).map((clip) => (
            <button
              key={clip.id}
              type="button"
              onClick={() => setSelectedClipId(clip.id)}
              className={`flex items-center gap-2 rounded-lg border p-2 text-start ${
                selectedClipId === clip.id ? "border-accent bg-accent/10" : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <span className="relative block h-12 w-9 shrink-0 overflow-hidden rounded bg-black">
                <Image src={clip.thumbnail_url} alt={clip.title} fill className="object-cover" unoptimized />
              </span>
              <span className="line-clamp-2 text-xs font-semibold">{clip.title}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-zinc-500">{t.exclusives.noClipsToChallenge}</p>
      )}

      {error ? <p className="mt-2 text-xs font-semibold text-red-600">{error}</p> : null}

      <button
        type="button"
        disabled={submitting || !selectedClipId}
        onClick={() => void handleAccept()}
        className="mt-3 w-full rounded-full bg-accent px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
      >
        {submitting ? t.exclusives.acceptingWager : t.exclusives.acceptWagerDuel}
      </button>
    </div>
  );
}
