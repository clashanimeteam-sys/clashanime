"use client";

import type { ReactNode } from "react";

type ClashFireFrameProps = {
  rank: number;
  children: ReactNode;
};

function getClashTier(rank: number): "champion" | "podium" | "arena" | null {
  if (rank === 1) return "champion";
  if (rank <= 3) return "podium";
  if (rank <= 10) return "arena";
  return null;
}

const tierStyles = {
  champion: {
    wrapper: "shadow-[0_0_40px_rgba(251,191,36,0.45),0_0_80px_rgba(249,115,22,0.25)]",
    ring: "from-amber-400 via-orange-500 to-red-600",
    fire: "from-amber-500/80 via-orange-600/60 to-transparent opacity-90",
  },
  podium: {
    wrapper: "shadow-[0_0_28px_rgba(249,115,22,0.35)]",
    ring: "from-orange-400 via-red-500 to-amber-500",
    fire: "from-orange-500/70 via-red-600/45 to-transparent opacity-75",
  },
  arena: {
    wrapper: "shadow-[0_0_18px_rgba(179,27,27,0.28)]",
    ring: "from-red-500 via-orange-600 to-red-700",
    fire: "from-red-600/55 via-orange-600/35 to-transparent opacity-60",
  },
};

export function ClashFireFrame({ rank, children }: ClashFireFrameProps) {
  const tier = getClashTier(rank);
  if (!tier) return <>{children}</>;

  const styles = tierStyles[tier];

  return (
    <div className={`relative rounded-2xl p-[2px] ${styles.wrapper}`}>
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${styles.ring} opacity-80`}
        aria-hidden
      />
      <div className="relative rounded-[calc(1rem-1px)] bg-white dark:bg-black">{children}</div>
    </div>
  );
}

export function ClashThumbnailFire({ rank }: { rank: number }) {
  const tier = getClashTier(rank);
  if (!tier) return null;

  const styles = tierStyles[tier];

  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t ${styles.fire}`}
      />
      {tier === "champion" ? (
        <span aria-hidden className="pointer-events-none absolute end-3 top-3 text-lg">
          🔥
        </span>
      ) : null}
    </>
  );
}
