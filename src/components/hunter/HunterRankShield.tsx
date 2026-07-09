"use client";

import { useId } from "react";
import type { HunterLevel, LevelDefinition } from "@/lib/points";
import { getLevelDefinition } from "@/lib/points";
import { RANK_SHIELD_SIZES, type RankShieldSize } from "@/lib/rankVisuals";

type HunterRankShieldProps = {
  level?: HunterLevel;
  rank?: LevelDefinition["shortLabel"];
  size?: RankShieldSize;
  active?: boolean;
  muted?: boolean;
  highlighted?: boolean;
  className?: string;
  title?: string;
};

const SHIELD_PATH =
  "M32 4 L56 12 L56 34 C56 46 44 58 32 62 C20 58 8 46 8 34 L8 12 Z";

function shortLabelToLevel(rank: LevelDefinition["shortLabel"]): HunterLevel {
  if (rank === "EX") return 2;
  if (rank === "D") return 3;
  if (rank === "M") return 4;
  if (rank === "CM") return 5;
  return 1;
}

function RankEmblem({ level }: { level: HunterLevel }) {
  switch (level) {
    case 1:
      return (
        <>
          <circle cx="32" cy="30" r="5" fill="currentColor" opacity="0.35" />
          <path
            d="M32 18v8M28 26c0-2.2 1.8-4 4-4s4 1.8 4 4M26 38c2-3 4-4 6-4s4 1 6 4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </>
      );
    case 2:
      return (
        <>
          <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.45" />
          <path d="M32 22v20M22 32h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 12l3 6h-6l3-6z" fill="currentColor" />
        </>
      );
    case 3:
      return (
        <>
          <path
            d="M22 40l10-18 10 18M18 40h28"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M32 24v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 4:
      return (
        <>
          <path
            d="M20 36h24M24 36V28c0-4.4 3.6-8 8-8s8 3.6 8 8v8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M26 24l2-4h8l2 4M28 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="30" r="2.5" fill="currentColor" />
        </>
      );
    case 5:
      return (
        <>
          <path
            d="M32 14l4 10h10l-8 6 3 10-9-6-9 6 3-10-8-6h10l4-10z"
            fill="currentColor"
            opacity="0.95"
          />
          <path
            d="M32 42c-6 0-10-3-10-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </>
      );
    default:
      return null;
  }
}

function shieldGradients(level: HunterLevel, id: string) {
  switch (level) {
    case 1:
      return {
        fill: `url(#${id}-fill)`,
        stroke: "#6ee7b7",
        stops: [
          { offset: "0%", color: "#6ee7b7" },
          { offset: "55%", color: "#059669" },
          { offset: "100%", color: "#064e3b" },
        ],
      };
    case 2:
      return {
        fill: `url(#${id}-fill)`,
        stroke: "#7dd3fc",
        stops: [
          { offset: "0%", color: "#7dd3fc" },
          { offset: "55%", color: "#0284c7" },
          { offset: "100%", color: "#0c4a6e" },
        ],
      };
    case 3:
      return {
        fill: `url(#${id}-fill)`,
        stroke: "#c4b5fd",
        stops: [
          { offset: "0%", color: "#ddd6fe" },
          { offset: "50%", color: "#7c3aed" },
          { offset: "100%", color: "#4c1d95" },
        ],
      };
    case 4:
      return {
        fill: `url(#${id}-fill)`,
        stroke: "#fde68a",
        stops: [
          { offset: "0%", color: "#fde68a" },
          { offset: "45%", color: "#f59e0b" },
          { offset: "100%", color: "#b45309" },
        ],
      };
    case 5:
      return {
        fill: `url(#${id}-fill)`,
        stroke: "#fdba74",
        stops: [
          { offset: "0%", color: "#fde68a" },
          { offset: "35%", color: "#f97316" },
          { offset: "100%", color: "#c2410c" },
        ],
      };
    default:
      return {
        fill: `url(#${id}-fill)`,
        stroke: "#6ee7b7",
        stops: [
          { offset: "0%", color: "#6ee7b7" },
          { offset: "100%", color: "#059669" },
        ],
      };
  }
}

export function HunterRankShield({
  level,
  rank,
  size = "md",
  active = true,
  muted = false,
  highlighted = false,
  className = "",
  title,
}: HunterRankShieldProps) {
  const uid = useId().replace(/:/g, "");
  const shieldLevel = level ?? (rank ? shortLabelToLevel(rank) : getLevelDefinition(1).level);
  const px = RANK_SHIELD_SIZES[size];
  const palette = shieldGradients(shieldLevel, uid);

  return (
    <span
      className={`rank-shield inline-flex shrink-0 ${muted ? "rank-shield-muted" : ""} ${
        highlighted ? "rank-shield-highlighted" : active ? "rank-shield-active" : "rank-shield-inactive"
      } ${className}`}
      style={{ width: px, height: px }}
      title={title}
      aria-label={title}
      role="img"
    >
      <svg viewBox="0 0 64 64" width={px} height={px} className="rank-shield-svg" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-fill`} x1="20%" y1="0%" x2="80%" y2="100%">
            {palette.stops.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
          <filter id={`${uid}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>
        <path
          d={SHIELD_PATH}
          fill={palette.fill}
          stroke={palette.stroke}
          strokeWidth="2.5"
          filter={active && !muted ? `url(#${uid}-glow)` : undefined}
        />
        <g className="rank-shield-emblem" fill="#fff" stroke="#fff" color="#fff">
          <RankEmblem level={shieldLevel} />
        </g>
      </svg>
    </span>
  );
}
