"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AcceptPointsWagerInline } from "@/components/exclusives/AcceptPointsWagerInline";
import {
  rejectPointsWagerDuel,
  type PointsWagerInvite,
} from "@/lib/pointsDuels";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type PointsWagerInviteAlertProps = {
  invite: PointsWagerInvite;
  onResolved: () => void;
};

export function PointsWagerInviteAlert({ invite, onResolved }: PointsWagerInviteAlertProps) {
  const { refreshProfile } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const creatorLabel = invite.creatorUsername
    ? `@${invite.creatorUsername}`
    : invite.creatorDisplayName ?? t.exclusives.pointsWagerBadge;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleReject() {
    if (!supabase || rejecting) return;
    setRejecting(true);
    setError(null);

    const { error: rejectError } = await rejectPointsWagerDuel(supabase, invite.id);
    setRejecting(false);

    if (rejectError) {
      setError(t.exclusives.pointsWagerFailed);
      return;
    }

    void refreshProfile();
    onResolved();
  }

  return (
    <div
      className="fixed inset-0 z-[10070] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="points-wager-invite-title"
    >
      <div className="w-full max-w-lg rounded-3xl border-2 border-accent bg-zinc-950 p-5 shadow-[0_0_40px_rgba(249,115,22,0.35)] sm:p-6">
        <div className="flex items-start gap-3">
          <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-accent">
            {invite.creatorAvatarUrl ? (
              <Image
                src={invite.creatorAvatarUrl}
                alt={creatorLabel}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-bold text-accent">
                !
              </span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p id="points-wager-invite-title" className="text-lg font-black text-accent">
              {t.exclusives.pointsWagerInviteAlertTitle}
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              {t.exclusives.pointsWagerInviteAlertBody
                .replace("{user}", creatorLabel)
                .replace("{wager}", String(invite.wager_points))
                .replace("{pot}", String(invite.wager_points * 2))}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <AcceptPointsWagerInline
            duel={invite}
            showReject
            rejecting={rejecting}
            onReject={() => void handleReject()}
            onAccepted={onResolved}
          />
        </div>

        {error ? <p className="mt-3 text-xs font-semibold text-red-500">{error}</p> : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-4">
          <Link
            href="/exclusives"
            className="text-xs font-semibold text-zinc-400 underline-offset-2 hover:text-accent hover:underline"
            onClick={() => router.push("/exclusives")}
          >
            {t.exclusives.viewWagerOnExclusives}
          </Link>
          <p className="text-[11px] text-zinc-500">{t.exclusives.pointsWagerAlertSoundHint}</p>
        </div>
      </div>
    </div>
  );
}
