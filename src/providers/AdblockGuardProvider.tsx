"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdblockNoticeModal } from "@/components/AdblockNoticeModal";
import { isStaff } from "@/lib/admin";
import { detectAdblock, isAdblockGuardEnabled, shouldSkipAdblockGuard } from "@/lib/adblockGuard";
import { useAuth } from "@/providers/AuthProvider";

const RECHECK_MS = 45_000;

type AdblockGuardProviderProps = {
  children: ReactNode;
};

export function AdblockGuardProvider({ children }: AdblockGuardProviderProps) {
  const pathname = usePathname();
  const { profile, profileReady } = useAuth();
  const [blocked, setBlocked] = useState(false);
  const [checking, setChecking] = useState(false);
  const timerRef = useRef<number | null>(null);

  const guardActive =
    isAdblockGuardEnabled() &&
    !shouldSkipAdblockGuard(pathname) &&
    !(profileReady && isStaff(profile));

  const runDetection = useCallback(async () => {
    if (!guardActive) {
      setBlocked(false);
      return false;
    }

    const detected = await detectAdblock();
    setBlocked(detected);
    return detected;
  }, [guardActive]);

  useEffect(() => {
    if (!guardActive) {
      setBlocked(false);
      return;
    }

    void runDetection();

    timerRef.current = window.setInterval(() => {
      void runDetection();
    }, RECHECK_MS);

    const handleFocus = () => {
      void runDetection();
    };

    document.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, [guardActive, runDetection]);

  useEffect(() => {
    if (!blocked) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
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
      {children}
      {guardActive && blocked ? (
        <AdblockNoticeModal onRecheck={() => void handleRecheck()} checking={checking} />
      ) : null}
    </>
  );
}
