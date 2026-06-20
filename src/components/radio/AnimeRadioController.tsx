"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_RADIO_VOLUME } from "@/lib/animeRadio";
import { createBrowserClient } from "@/lib/supabase/client";
import { fetchPublicSiteFlags } from "@/lib/siteSettings";
import { useAnimeRadio } from "@/providers/AnimeRadioProvider";

function isRadioBlockedRoute(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth/") ||
    pathname === "/login" ||
    pathname === "/signup"
  );
}

export function AnimeRadioController() {
  const pathname = usePathname();
  const { isPlaying, pausedByUser, play, pause, setVolume } = useAnimeRadio();
  const isPlayingRef = useRef(isPlaying);
  const pausedByUserRef = useRef(pausedByUser);
  const resumeAfterVideoRef = useRef(false);
  const autoplayAttemptedRef = useRef(false);
  const [flagsReady, setFlagsReady] = useState(false);
  const [radioEnabled, setRadioEnabled] = useState(true);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  isPlayingRef.current = isPlaying;
  pausedByUserRef.current = pausedByUser;

  useEffect(() => {
    const supabase = createBrowserClient();
    if (!supabase) {
      setFlagsReady(true);
      return;
    }

    void fetchPublicSiteFlags(supabase).then((flags) => {
      setRadioEnabled(flags.animeRadioEnabled);
      setAutoplayEnabled(flags.animeRadioAutoplay);
      setVolume(flags.animeRadioDefaultVolume ?? DEFAULT_RADIO_VOLUME);
      setFlagsReady(true);
    });
  }, [setVolume]);

  useEffect(() => {
    if (pathname.startsWith("/video/")) {
      if (isPlayingRef.current) {
        resumeAfterVideoRef.current = true;
        pause();
      }
      return;
    }

    if (resumeAfterVideoRef.current && radioEnabled && !pausedByUserRef.current) {
      resumeAfterVideoRef.current = false;
      void play();
    }
  }, [pathname, pause, play, radioEnabled]);

  useEffect(() => {
    if (!flagsReady || !radioEnabled || !autoplayEnabled || pausedByUser) return;

    const tryAutoplay = () => {
      if (autoplayAttemptedRef.current || pausedByUserRef.current) return;
      if (isRadioBlockedRoute(pathname) || pathname.startsWith("/video/")) return;

      autoplayAttemptedRef.current = true;
      void play().catch(() => {
        autoplayAttemptedRef.current = false;
      });
    };

    tryAutoplay();

    function unlockOnInteraction(event: PointerEvent) {
      if ((event.target as Element | null)?.closest("[data-radio-controls]")) return;
      if (pausedByUserRef.current) return;
      if (autoplayAttemptedRef.current && isPlayingRef.current) return;
      if (!radioEnabled || !autoplayEnabled) return;
      if (isRadioBlockedRoute(pathname) || pathname.startsWith("/video/")) return;
      autoplayAttemptedRef.current = true;
      void play();
    }

    document.addEventListener("pointerdown", unlockOnInteraction);
    return () => document.removeEventListener("pointerdown", unlockOnInteraction);
  }, [flagsReady, radioEnabled, autoplayEnabled, pausedByUser, pathname, play]);

  return null;
}
