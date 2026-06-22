"use client";

import { Fredoka, Orbitron } from "next/font/google";
import { useId } from "react";

const clashFont = Orbitron({
  subsets: ["latin"],
  weight: ["800", "900"],
});

const animeFont = Fredoka({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type ElementalSiteTitleProps = {
  primary: string;
  secondary: string;
};

const ANIME_TONES = [
  { top: "#fda4af", bottom: "#e11d48" },
  { top: "#d8b4fe", bottom: "#9333ea" },
  null,
  { top: "#7dd3fc", bottom: "#0284c7" },
  { top: "#86efac", bottom: "#16a34a" },
] as const;

function StrawHat() {
  const id = useId().replace(/:/g, "");

  return (
    <span className="elemental-hat-slot" aria-hidden>
      <svg viewBox="0 0 64 40" className="elemental-hat-svg" fill="none">
        <ellipse cx="32" cy="30" rx="28" ry="7" fill={`url(#hat-brim-${id})`} />
        <path
          d="M14 28c2-12 10-18 18-18s16 6 18 18"
          fill={`url(#hat-top-${id})`}
          stroke="#ca8a04"
          strokeWidth="1.2"
        />
        <path d="M12 28h40" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="18" y="24" width="28" height="5" rx="2" fill="#dc2626" />
        <path d="M20 26.5h24" stroke="#991b1b" strokeWidth="1" strokeLinecap="round" />
        <defs>
          <linearGradient id={`hat-top-${id}`} x1="32" y1="10" x2="32" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fde047" />
            <stop offset="1" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id={`hat-brim-${id}`} x1="32" y1="23" x2="32" y2="37" gradientUnits="userSpaceOnUse">
            <stop stopColor="#facc15" />
            <stop offset="1" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

function LightningStrike() {
  const id = useId().replace(/:/g, "");

  return (
    <span className="elemental-lightning-slot" aria-hidden>
      <svg viewBox="0 0 28 52" className="elemental-lightning-svg" fill="none">
        <path
          d="M16 1 5 28h9l-3 23 17-31H18l5-19Z"
          fill={`url(#bolt-${id})`}
          stroke="#fff"
          strokeWidth="1.2"
        />
        <defs>
          <linearGradient id={`bolt-${id}`} x1="14" y1="1" x2="14" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.5" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

function ClashLetter({ char }: { char: string }) {
  if (char === "A") {
    return (
      <span className="elemental-letter-slot elemental-letter-slot-hat">
        <StrawHat />
        <span className="elemental-letter elemental-letter-clash">{char}</span>
      </span>
    );
  }

  return <span className="elemental-letter elemental-letter-clash">{char}</span>;
}

function AnimeLetter({ char, index }: { char: string; index: number }) {
  if (char === "I") {
    return <LightningStrike />;
  }

  const tone = ANIME_TONES[index % ANIME_TONES.length] ?? ANIME_TONES[0];

  return (
    <span
      className="elemental-letter elemental-letter-anime"
      style={
        {
          "--anime-top": tone.top,
          "--anime-bottom": tone.bottom,
        } as React.CSSProperties
      }
    >
      {char}
    </span>
  );
}

export function ElementalSiteTitle({ primary, secondary }: ElementalSiteTitleProps) {
  const clashChars = [...primary.toUpperCase().trim()];
  const animeChars = [...secondary.toUpperCase().trim()];

  return (
    <div className={`elemental-title-wrap ${clashFont.className}`}>
      <span className="elemental-glow elemental-glow-clash" aria-hidden />
      <span className="elemental-glow elemental-glow-anime" aria-hidden />
      <h1 className="elemental-title" aria-label={`${primary}${secondary}`}>
        <span className="elemental-row elemental-row-clash">
          {clashChars.map((char, index) => (
            <ClashLetter key={`c-${index}`} char={char} />
          ))}
        </span>
        <span className={`elemental-row elemental-row-anime ${animeFont.className}`}>
          {animeChars.map((char, index) => (
            <AnimeLetter key={`a-${index}`} char={char} index={index} />
          ))}
        </span>
      </h1>
    </div>
  );
}
