"use client";

import { useLocale } from "@/providers/LocaleProvider";

type ClashVsFlameProps = {
  className?: string;
};

export function ClashVsFlame({ className = "" }: ClashVsFlameProps) {
  const { t } = useLocale();

  return (
    <div
      aria-hidden
      className={`pointer-events-none flex flex-col items-center ${className}`}
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-[clash-glow-pulse_1.6s_ease-in-out_infinite] rounded-full bg-orange-500/25 blur-xl" />
        <span className="absolute inset-1 animate-[clash-fire-flicker_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 opacity-90 shadow-[0_0_24px_rgba(249,115,22,0.85)]" />
        <span className="relative font-display text-xs font-black uppercase tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          {t.home.clashVs}
        </span>
        <span className="absolute -top-1 text-sm animate-[clash-fire-flicker_1.2s_ease-in-out_infinite]">
          🔥
        </span>
        <span className="absolute -bottom-0.5 text-[10px] animate-[clash-fire-flicker_1.8s_ease-in-out_infinite]">
          🔥
        </span>
      </div>
      <span className="mt-1 rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-orange-300 backdrop-blur-sm">
        {t.home.clashBattle}
      </span>
    </div>
  );
}

export function ClashRivalCornerFlame({ side }: { side: "start" | "end" }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute top-2 z-20 flex items-center gap-0.5 rounded-full border border-orange-400/50 bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 px-1.5 py-0.5 text-[10px] font-black text-white shadow-[0_0_14px_rgba(249,115,22,0.75)] animate-[clash-glow-pulse_1.8s_ease-in-out_infinite] ${
        side === "start" ? "start-2" : "end-2"
      }`}
    >
      <span className="animate-[clash-fire-flicker_1.3s_ease-in-out_infinite]">🔥</span>
    </span>
  );
}
