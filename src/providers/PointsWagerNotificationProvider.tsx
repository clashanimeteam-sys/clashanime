"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PointsWagerInviteAlert } from "@/components/duel/PointsWagerInviteAlert";
import {
  fetchIncomingPointsWagerInvites,
  type PointsWagerInvite,
} from "@/lib/pointsDuels";
import {
  isPointsWagerAlertSoundActive,
  startPointsWagerAlertSound,
  stopPointsWagerAlertSound,
} from "@/lib/pointsWagerAlertSound";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

const POLL_MS = 6000;

type PointsWagerNotificationProviderProps = {
  children: ReactNode;
};

export function PointsWagerNotificationProvider({ children }: PointsWagerNotificationProviderProps) {
  const { user, loading } = useAuth();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [activeInvite, setActiveInvite] = useState<PointsWagerInvite | null>(null);
  const pendingQueueRef = useRef<PointsWagerInvite[]>([]);
  const soundUnlockRef = useRef(false);

  const syncSound = useCallback((invite: PointsWagerInvite | null) => {
    if (invite) {
      startPointsWagerAlertSound();
    } else if (isPointsWagerAlertSoundActive()) {
      stopPointsWagerAlertSound();
    }
  }, []);

  const showNextInvite = useCallback(() => {
    const next = pendingQueueRef.current.shift() ?? null;
    setActiveInvite(next);
    syncSound(next);
  }, [syncSound]);

  const refreshInvites = useCallback(async () => {
    if (!supabase || !user?.id) {
      pendingQueueRef.current = [];
      setActiveInvite(null);
      stopPointsWagerAlertSound();
      return;
    }

    const invites = await fetchIncomingPointsWagerInvites(supabase, user.id);
    pendingQueueRef.current = invites;

    if (!invites.length) {
      setActiveInvite(null);
      stopPointsWagerAlertSound();
      return;
    }

    setActiveInvite((current) => {
      if (current && invites.some((invite) => invite.id === current.id)) {
        syncSound(current);
        return current;
      }

      const next = invites[0];
      syncSound(next);
      pendingQueueRef.current = invites.slice(1);
      return next;
    });
  }, [supabase, syncSound, user?.id]);

  useEffect(() => {
    if (loading) return;

    if (!user?.id) {
      pendingQueueRef.current = [];
      setActiveInvite(null);
      stopPointsWagerAlertSound();
      return;
    }

    void refreshInvites();
    const interval = window.setInterval(() => void refreshInvites(), POLL_MS);

    return () => {
      window.clearInterval(interval);
      stopPointsWagerAlertSound();
    };
  }, [loading, refreshInvites, user?.id]);

  useEffect(() => {
    if (!supabase || !user?.id) return;

    const channel = supabase
      .channel(`points-wager-invites-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "points_wager_duels",
          filter: `opponent_id=eq.${user.id}`,
        },
        () => {
          void refreshInvites();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refreshInvites, supabase, user?.id]);

  useEffect(() => {
    if (!activeInvite || soundUnlockRef.current) return;

    function unlockSound() {
      soundUnlockRef.current = true;
      if (activeInvite) {
        startPointsWagerAlertSound();
      }
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
    }

    window.addEventListener("pointerdown", unlockSound, { once: true });
    window.addEventListener("keydown", unlockSound, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
    };
  }, [activeInvite]);

  const handleResolved = useCallback(() => {
    showNextInvite();
    void refreshInvites();
  }, [refreshInvites, showNextInvite]);

  return (
    <>
      {children}
      {activeInvite ? (
        <PointsWagerInviteAlert invite={activeInvite} onResolved={handleResolved} />
      ) : null}
    </>
  );
}
