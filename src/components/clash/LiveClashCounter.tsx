"use client";

import { useEffect, useState } from "react";
import type { ClashArenaStats } from "@/lib/videos";
import { formatNumber } from "@/lib/formatLocale";
import { useLocale } from "@/providers/LocaleProvider";

type LiveClashCounterProps = {
  initialStats: ClashArenaStats;
};

const POLL_MS = 20_000;

function StatPill({
  value,
  showSwords = false,
  pulse = false,
}: {
  value: string;
  showSwords?: boolean;
  pulse?: boolean;
}) {
  return (
    <span className={`live-clash-pill ${pulse ? "live-clash-pill-flash" : ""}`}>
      <span className="live-clash-pill-value">{value}</span>
      {showSwords ? (
        <span className="live-clash-pill-swords" aria-hidden>
          ⚔️
        </span>
      ) : null}
    </span>
  );
}

function splitCounterText(
  template: string,
  battles: string,
  fighters: string,
  pulse: boolean,
) {
  const parts = template.split(/(\{battles\}|\{fighters\})/);
  return parts.map((part, index) => {
    if (part === "{battles}") {
      return <StatPill key={`b-${index}`} value={battles} showSwords pulse={pulse} />;
    }
    if (part === "{fighters}") {
      return <StatPill key={`f-${index}`} value={fighters} pulse={pulse} />;
    }
    return (
      <span key={`t-${index}`} className="live-clash-copy">
        {part}
      </span>
    );
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

  const battles = formatNumber(stats.activeBattles, locale);
  const fighters = formatNumber(stats.heroesFighting, locale);

  return (
    <div className="live-clash-counter" role="status" aria-live="polite" aria-atomic="true">
      <div className="live-clash-counter-accent" aria-hidden />
      <div className="live-clash-counter-inner">
        <div className="live-clash-counter-head">
          <span className="live-clash-counter-dot" aria-hidden />
          <span className="live-clash-counter-label">{t.home.liveClashCounterTitle}</span>
        </div>
        <p className="live-clash-counter-line">
          {splitCounterText(t.home.liveClashCounter, battles, fighters, pulse)}
        </p>
      </div>
    </div>
  );
}
