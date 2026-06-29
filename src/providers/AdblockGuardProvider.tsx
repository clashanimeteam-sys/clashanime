"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdblockNoticeModal } from "@/components/AdblockNoticeModal";
import { isStaff } from "@/lib/admin";
import {
  detectAdblock,
  isAdblockGuardEnabled,
  shouldSkipAdblockGuard,
  watchAdblockBaits,
} from "@/lib/adblockGuard";
import { useAuth } from "@/providers/AuthProvider";

const RECHECK_MS = 12_000;

type AdblockGuardProviderProps = {
  children: ReactNode;
};

export function AdblockGuardProvider({ children }: AdblockGuardProviderProps) {
  const pathname = usePathname();
  const { profile, profileReady } = useAuth();
  const [blocked, setBlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const timerRef = useRef<number | null>(null);
  const detectingRef = useRef(false);

  const guardActive =
    isAdblockGuardEnabled() &&
    !shouldSkipAdblockGuard(pathname) &&
    !(profileReady && isStaff(profile));

  const runDetection = useCallback(async () => {
    if (!guardActive) {
      setBlocked(false);
      return false;
    }
    if (detectingRef.current) return false;

    detectingRef.current = true;
    try {
      const detected = await detectAdblock();
      setBlocked(detected);
      return detected;
    } finally {
      detectingRef.current = false;
    }
  }, [guardActive]);

  useEffect(() => {
    if (!guardActive) {
      setBlocked(false);
      return;
    }

    const initialTimer = window.setTimeout(() => {
      void runDetection();
    }, 900);

    timerRef.current = window.setInterval(() => {
      void runDetection();
    }, RECHECK_MS);

    const handleFocus = () => {
      void runDetection();
    };

    const stopWatchingBaits = watchAdblockBaits(() => {
      void runDetection();
    });

    document.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearTimeout(initialTimer);
      if (timerRef.current) window.clearInterval(timerRef.current);
      stopWatchingBaits();
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, [guardActive, runDetection]);

  useEffect(() => {
    if (!guardActive) return;
    void runDetection();
  }, [guardActive, pathname, runDetection]);

  useEffect(() => {
    if (!blocked) {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-adblock-locked");
      return;
    }

    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-adblock-locked", "true");
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-adblock-locked");
    };
  }, [blocked]);

  const handleRecheck = useCallback(async () => {
    setChecking(true);
    const stillBlocked = await runDetection();
    setChecking(false);
    if (stillBlocked) {
      window.location.reload();
    }
  }, [runDetection]);

  return (
    <>
      <div aria-hidden={blocked} inert={blocked ? true : undefined}>
        {children}
      </div>
      {guardActive && blocked ? (
        <AdblockNoticeModal onRecheck={() => void handleRecheck()} checking={checking} />
      ) : null}
    </>
  );
}
