"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChallengeClipModal } from "@/components/duel/ChallengeClipModal";
import { getSignupUrl } from "@/lib/subscriptionGate";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type ChallengeClipButtonProps = {
  challengedVideoId: string;
  challengedVideoTitle: string;
  challengedVideoOwnerId: string | null | undefined;
  variant?: "card" | "overlay" | "compact";
};

export function ChallengeClipButton({
  challengedVideoId,
  challengedVideoTitle,
  challengedVideoOwnerId,
  variant = "card",
}: ChallengeClipButtonProps) {
  const { user, loading } = useAuth();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  const isOwnVideo = useMemo(() => {
    if (!user || !challengedVideoOwnerId) return false;
    return user.id === challengedVideoOwnerId;
  }, [user, challengedVideoOwnerId]);

  const buttonClassName =
    variant === "overlay"
      ? "inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent/20 hover:text-accent disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-white/20 disabled:hover:bg-white/10 disabled:hover:text-white"
      : variant === "compact"
        ? "inline-flex w-full items-center justify-center rounded-full border border-accent/30 bg-accent/10 px-2 py-1 text-[9px] font-bold text-accent transition-colors hover:border-accent hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-45 dark:border-accent/40 dark:bg-accent/15 dark:text-accent"
      : "inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent transition-colors hover:border-accent hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-accent/30 disabled:hover:bg-accent/10 dark:border-accent/40 dark:bg-accent/15 dark:text-accent dark:disabled:hover:border-accent/40 dark:disabled:hover:bg-accent/15";

  function handleClick() {
    if (loading || !user || isOwnVideo) return;
    setOpen(true);
  }

  const iconClass = variant === "compact" ? "h-3 w-3 shrink-0" : "h-4 w-4";
  const labelClass = variant === "compact" ? "truncate" : undefined;

  return (
    <>
      {user && !loading ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={isOwnVideo}
          aria-disabled={isOwnVideo}
          title={isOwnVideo ? t.exclusives.cannotChallengeOwnClip : undefined}
          className={buttonClassName}
        >
          {variant !== "compact" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass} aria-hidden>
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
              <path d="M13 6l6.5 6.5-4 4L6 10l4-4z" />
              <path d="M8 8l8 8" />
            </svg>
          ) : null}
          <span className={labelClass}>{t.exclusives.challengeClipButton}</span>
        </button>
      ) : (
        <Link href={getSignupUrl()} className={buttonClassName}>
          {variant !== "compact" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClass} aria-hidden>
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
              <path d="M13 6l6.5 6.5-4 4L6 10l4-4z" />
              <path d="M8 8l8 8" />
            </svg>
          ) : null}
          <span className={labelClass}>{t.exclusives.challengeClipButton}</span>
        </Link>
      )}

      <ChallengeClipModal
        open={open}
        onClose={() => setOpen(false)}
        challengedVideoId={challengedVideoId}
        challengedVideoTitle={challengedVideoTitle}
      />
    </>
  );
}
