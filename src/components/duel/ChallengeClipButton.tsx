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
  variant?: "card" | "overlay";
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

  if (loading || isOwnVideo) return null;

  const buttonClassName =
    variant === "overlay"
      ? "inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent/20 hover:text-accent"
      : "inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent transition-colors hover:border-accent hover:bg-accent/15 dark:border-accent/40 dark:bg-accent/15 dark:text-accent";

  function handleClick() {
    if (!user) return;
    setOpen(true);
  }

  return (
    <>
      {user ? (
        <button type="button" onClick={handleClick} className={buttonClassName}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
            <path d="M13 6l6.5 6.5-4 4L6 10l4-4z" />
            <path d="M8 8l8 8" />
          </svg>
          {t.exclusives.challengeClipButton}
        </button>
      ) : (
        <Link href={getSignupUrl()} className={buttonClassName}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
            <path d="M13 6l6.5 6.5-4 4L6 10l4-4z" />
            <path d="M8 8l8 8" />
          </svg>
          {t.exclusives.challengeClipButton}
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
