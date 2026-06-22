"use client";

import { useEffect, useState } from "react";
import type { ClashArenaStats } from "@/lib/videos";
import { useLocale } from "@/providers/LocaleProvider";

type LiveClashCounterProps = {
  initialStats: ClashArenaStats;
};

const POLL_MS = 20_000;

function formatArenaNumber(value: number, locale: string) {
  return value.toLocaleString(locale === "ar" ? "ar-EG" : locale === "ja" ? "ja-JP" : "en-US");
}

function splitCounterText(template: string, battles: string, fighters: string) {
  const parts = template.split(/(\{battles\}|\{fighters\})/);
  return parts.map((part, index) => {
    if (part === "{battles}") {
      return (
        <span key={`b-${index}`} className="live-clash-stat-group">
          <span className="live-clash-stat live-clash-stat-target">{battles}</span>
          <span className="live-clash-swords" aria-hidden>
            ⚔️
          </span>
        </span>
      );
    }
    if (part === "{fighters}") {
      return (
        <span key={`f-${index}`} className="live-clash-stat live-clash-stat-target">
          {fighters}
        </span>
      );
    }
    return part;
  });
}

export function LiveClashCounter({ initialStats }: LiveClashCounterProps) {
  const { locale, t } = useLocale();
  const [stats, setStats] = useState(initialStats);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const response = await fetch("/api/clash/arena-stats", { cache: "no-store" });
        if (!response.ok) return;
        const next = (await response.json()) as ClashArenaStats;
        if (cancelled) return;
        setStats((current) => {
          if (
            current.activeBattles !== next.activeBattles ||
            current.heroesFighting !== next.heroesFighting
          ) {
            setPulse(true);
            window.setTimeout(() => setPulse(false), 700);
          }
          return next;
        });
      } catch {
        // Keep last known stats when polling fails.
      }
    }

    const timer = window.setInterval(() => {
      void refresh();
    }, POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const battles = formatArenaNumber(stats.activeBattles, locale);
  const fighters = formatArenaNumber(stats.heroesFighting, locale);

  return (
    <div
      className={`live-clash-counter ${pulse ? "live-clash-counter-pulse" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="live-clash-counter-shimmer" aria-hidden />
      <div className="live-clash-counter-head">
        <span className="live-clash-counter-dot" aria-hidden />
        <span className="live-clash-counter-label">{t.home.liveClashCounterTitle}</span>
      </div>
      <p className="live-clash-counter-text">
        {splitCounterText(t.home.liveClashCounter, battles, fighters)}
      </p>
    </div>
  );
}
