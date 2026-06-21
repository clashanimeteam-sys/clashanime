"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModalPortal } from "@/components/ModalPortal";
import { createVideoDuel, fetchUserApprovedClips } from "@/lib/videoDuels";
import { getSignupUrl } from "@/lib/subscriptionGate";
import { createBrowserClient } from "@/lib/supabase/client";
import { useScrollLock } from "@/lib/useScrollLock";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type ChallengeClipModalProps = {
  open: boolean;
  onClose: () => void;
  challengedVideoId: string;
  challengedVideoTitle: string;
};

export function ChallengeClipModal({
  open,
  onClose,
  challengedVideoId,
  challengedVideoTitle,
}: ChallengeClipModalProps) {
  const { user, refreshProfile } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [clips, setClips] = useState<
    Awaited<ReturnType<typeof fetchUserApprovedClips>>
  >([]);
  const [loadingClips, setLoadingClips] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    void fetchUserApprovedClips(supabase, user.id).then((rows) => {
      if (cancelled) return;
      const eligible = rows.filter((clip) => clip.id !== challengedVideoId);
      setClips(eligible);
      setSelectedClipId(eligible[0]?.id ?? null);
      setLoadingClips(false);
    });

    return () => {
      cancelled = true;
    };
  }, [open, supabase, user, challengedVideoId]);

  async function handleCreateDuel() {
    if (!supabase || !user || !selectedClipId) return;

    setSubmitting(true);
    setError(null);

    const { duelId, error: duelError } = await createVideoDuel(
      supabase,
      challengedVideoId,
      selectedClipId,
    );

    setSubmitting(false);

    if (duelError || !duelId) {
      setError(t.exclusives.challengeFailed);
      return;
    }

    void refreshProfile();
    onClose();
    router.push(`/duel/${duelId}`);
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

        <div
          role="dialog"
          aria-modal="true"
          className="relative z-10 m-4 max-h-[min(92dvh,760px)] w-[min(100%,42rem)] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                {t.exclusives.challengeClipModalTitle}
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {t.exclusives.challengeClipModalDesc}
              </p>
              <p className="mt-2 line-clamp-2 text-xs font-semibold text-zinc-500">
                {challengedVideoTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white"
              aria-label={t.auth.close}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!user ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              {t.exclusives.loginToChallenge}{" "}
              <Link href={getSignupUrl()} className="font-semibold text-accent hover:underline">
                {t.auth.signUp}
              </Link>
            </div>
          ) : loadingClips ? (
            <p className="text-sm text-zinc-500">{t.exclusives.loadingClips}</p>
          ) : clips.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.exclusives.noClipsToChallenge}</p>
              <Link
                href="/upload"
                className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t.home.upload}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {t.exclusives.pickYourClip}
              </p>
              <div className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
                {clips.map((clip) => {
                  const selected = selectedClipId === clip.id;
                  return (
                    <button
                      key={clip.id}
                      type="button"
                      onClick={() => setSelectedClipId(clip.id)}
                      className={`flex items-center gap-3 rounded-xl border p-2 text-start transition-colors ${
                        selected
                          ? "border-accent bg-accent/10"
                          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                      }`}
                    >
                      <span className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-black">
                        <Image
                          src={clip.thumbnail_url}
                          alt={clip.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-white">
                          {clip.title}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

              <button
                type="button"
                disabled={!selectedClipId || submitting}
                onClick={() => void handleCreateDuel()}
                className="w-full rounded-full bg-accent px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? t.exclusives.creatingChallengeDuel : t.exclusives.startChallengeDuel}
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
