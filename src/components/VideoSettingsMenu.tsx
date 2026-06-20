"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { useRequireSubscription } from "@/hooks/useRequireSubscription";
import { useVideoOverlay } from "@/providers/VideoOverlayProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

type VideoSettingsMenuProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  videoId: string;
  title: string;
  disabled?: boolean;
};

export function VideoSettingsMenu({
  videoRef,
  videoId,
  title,
  disabled = false,
}: VideoSettingsMenuProps) {
  const { t } = useLocale();
  const { user } = useAuth();
  const { openReport } = useVideoOverlay();
  const { requireSubscription } = useRequireSubscription();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    setMuted(element.muted);
    setSpeed(element.playbackRate || 1);

    const syncMuted = () => setMuted(element.muted);
    element.addEventListener("volumechange", syncMuted);
    return () => element.removeEventListener("volumechange", syncMuted);
  }, [videoRef, open]);

  function showStatus(message: string) {
    setStatus(message);
    window.setTimeout(() => setStatus(null), 2000);
  }

  function applySpeed(nextSpeed: number) {
    const element = videoRef.current;
    if (!element) return;

    element.playbackRate = nextSpeed;
    setSpeed(nextSpeed);
  }

  function toggleMute() {
    const element = videoRef.current;
    if (!element) return;

    element.muted = !element.muted;
    setMuted(element.muted);
  }

  async function toggleFullscreen() {
    const element = videoRef.current;
    if (!element) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    } catch {
      showStatus(t.video.actionFailed);
    }
  }

  async function copyLink() {
    if (!requireSubscription()) return;

    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/video/${videoId}`
        : `https://www.clashanime.com/video/${videoId}`;

    try {
      await navigator.clipboard.writeText(url);
      showStatus(t.video.linkCopied);
    } catch {
      showStatus(t.video.actionFailed);
    }
  }

  function handleReport() {
    if (!requireSubscription(`/report?video=${videoId}`)) return;

    setOpen(false);
    openReport({ videoId, title });
  }

  if (disabled) return null;

  return (
    <div ref={menuRef} className="absolute end-4 top-4 z-30">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={t.video.settings}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden
        >
          <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {open ? (
        <div className="absolute end-0 top-12 w-56 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950/95 text-white shadow-xl backdrop-blur-md">
          <div className="border-b border-zinc-800 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
              {t.video.settings}
            </p>
          </div>

          <div className="px-4 py-3">
            <p className="mb-2 text-xs font-semibold text-zinc-400">{t.video.playbackSpeed}</p>
            <div className="flex flex-wrap gap-1.5">
              {SPEEDS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => applySpeed(value)}
                  className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                    speed === value
                      ? "bg-accent text-white"
                      : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  }`}
                >
                  {value === 1 ? t.video.normalSpeed : `${value}x`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 border-t border-zinc-800 px-2 py-2">
            <button
              type="button"
              onClick={toggleMute}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-800"
            >
              {muted ? t.video.unmute : t.video.mute}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-800"
            >
              {t.video.fullscreen}
            </button>

            <button
              type="button"
              onClick={copyLink}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-800"
            >
              {t.video.copyLink}
            </button>

            <button
              type="button"
              onClick={handleReport}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-zinc-800"
            >
              {t.video.report}
            </button>
          </div>
        </div>
      ) : null}

      {status ? (
        <p className="absolute end-0 top-12 mt-2 w-56 text-end text-xs font-semibold text-zinc-300">
          {status}
        </p>
      ) : null}
    </div>
  );
}
