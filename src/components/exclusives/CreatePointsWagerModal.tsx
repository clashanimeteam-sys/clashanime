"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ModalPortal } from "@/components/ModalPortal";
import { UsernameSuggestInput } from "@/components/UsernameSuggestInput";
import {
  createPointsWagerDuel,
  fetchUserApprovedClipsForWager,
} from "@/lib/pointsDuels";
import { getSignupUrl } from "@/lib/subscriptionGate";
import { createBrowserClient } from "@/lib/supabase/client";
import { useScrollLock } from "@/lib/useScrollLock";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type CreatePointsWagerModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export function CreatePointsWagerModal({ open, onClose, onCreated }: CreatePointsWagerModalProps) {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [opponentUsername, setOpponentUsername] = useState("");
  const [wagerPoints, setWagerPoints] = useState(50);
  const [clips, setClips] = useState<Awaited<ReturnType<typeof fetchUserApprovedClipsForWager>>>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [loadingClips, setLoadingClips] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availablePoints = profile?.points ?? 0;
  const minWager = 10;

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !supabase || !user) {
      setClips([]);
      setSelectedClipId(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoadingClips(true);

    void fetchUserApprovedClipsForWager(supabase, user.id).then((rows) => {
      if (cancelled) return;
      setClips(rows);
      setSelectedClipId(rows[0]?.id ?? null);
      setLoadingClips(false);
    });

    return () => {
      cancelled = true;
    };
  }, [open, supabase, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !user || !selectedClipId) return;

    setSubmitting(true);
    setError(null);

    const { duelId, error: duelError } = await createPointsWagerDuel(
      supabase,
      opponentUsername,
      selectedClipId,
      wagerPoints,
    );

    setSubmitting(false);

    if (duelError || !duelId) {
      setError(t.exclusives.pointsWagerFailed);
      return;
    }

    void refreshProfile();
    onClose();
    onCreated?.();
    router.push(`/duel/points/${duelId}`);
  }

  if (!open) return null;

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center">
        <button
          type="button"
          aria-label={t.auth.close}
          className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="relative z-10 m-4 max-h-[min(92dvh,760px)] w-[min(100%,42rem)] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
        >
          <h2 className="text-xl font-bold text-black dark:text-white">
            {t.exclusives.pointsWagerModalTitle}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {t.exclusives.pointsWagerModalDesc}
          </p>

          {!user ? (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              {t.exclusives.loginToPointsWager}{" "}
              <Link href={getSignupUrl()} className="font-semibold text-accent hover:underline">
                {t.auth.signUp}
              </Link>
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {t.exclusives.yourBalance}: {availablePoints.toLocaleString()} {t.points.pointsLabel}
              </p>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {t.exclusives.inviteOpponent}
                </span>
                <UsernameSuggestInput
                  value={opponentUsername}
                  onChange={setOpponentUsername}
                  excludeUserId={user.id}
                  placeholder="@username"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {t.exclusives.wagerAmount}
                </span>
                <input
                  type="number"
                  min={minWager}
                  max={Math.max(minWager, availablePoints)}
                  value={wagerPoints}
                  onChange={(event) => setWagerPoints(Number(event.target.value))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  required
                />
                <span className="text-xs text-zinc-500">
                  {t.exclusives.wagerPotPreview.replace("{pot}", String(wagerPoints * 2))}
                </span>
              </label>

              {loadingClips ? (
                <p className="text-sm text-zinc-500">{t.exclusives.loadingClips}</p>
              ) : clips.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.exclusives.noClipsToChallenge}</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {t.exclusives.pickYourClip}
                  </p>
                  <div className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
                    {clips.map((clip) => (
                      <button
                        key={clip.id}
                        type="button"
                        onClick={() => setSelectedClipId(clip.id)}
                        className={`flex items-center gap-3 rounded-xl border p-2 text-start ${
                          selectedClipId === clip.id
                            ? "border-accent bg-accent/10"
                            : "border-zinc-200 dark:border-zinc-800"
                        }`}
                      >
                        <span className="relative block h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-black">
                          <Image src={clip.thumbnail_url} alt={clip.title} fill className="object-cover" unoptimized />
                        </span>
                        <span className="line-clamp-2 text-sm font-semibold">{clip.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={submitting || !selectedClipId || availablePoints < minWager}
                className="w-full rounded-full bg-accent px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {submitting ? t.exclusives.creatingPointsWager : t.exclusives.startPointsWager}
              </button>
            </div>
          )}
        </form>
      </div>
    </ModalPortal>
  );
}
