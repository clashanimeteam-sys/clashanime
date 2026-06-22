"use client";

import { Orbitron } from "next/font/google";
import { useId, type CSSProperties } from "react";

const titleFont = Orbitron({
  subsets: ["latin"],
  weight: ["800", "900"],
});

type ElementalSiteTitleProps = {
  primary: string;
  secondary: string;
};

/** Fire → green → blue arc like the reference poster */
const ANIME_TONES = [
  { top: "#fde047", bottom: "#ea580c", glow: "rgba(249,115,22,0.7)" },
  { top: "#bef264", bottom: "#ca8a04", glow: "rgba(234,179,8,0.65)" },
  null,
  { top: "#67e8f9", bottom: "#2563eb", glow: "rgba(56,189,248,0.85)" },
  { top: "#93c5fd", bottom: "#1d4ed8", glow: "rgba(59,130,246,0.85)" },
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

function ThunderBolt() {
  const id = useId().replace(/:/g, "");

  return (
    <span className="elemental-lightning-slot" aria-hidden>
      <svg viewBox="0 0 32 58" className="elemental-lightning-svg" fill="none">
        <path
          d="M18 1 4 32h11l-5 25 22-38H19l5-18Z"
          fill={`url(#bolt-${id})`}
          stroke="#ecfccb"
          strokeWidth="1.4"
        />
        <path d="M10 18h12M8 28h10" stroke="#bbf7d0" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <defs>
          <linearGradient id={`bolt-${id}`} x1="16" y1="1" x2="16" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.35" stopColor="#4ade80" />
            <stop offset="1" stopColor="#16a34a" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

function ClashLetter({ char }: { char: string }) {
  const letter = (
    <span className="elemental-letter elemental-letter-clash">
      <span className="elemental-letter-stone" aria-hidden />
      <span className="elemental-letter-fire">{char}</span>
    </span>
  );

  if (char === "A") {
    return (
      <span className="elemental-letter-slot elemental-letter-slot-hat">
        <StrawHat />
        {letter}
      </span>
    );
  }

  return letter;
}

function AnimeLetter({ char, index }: { char: string; index: number }) {
  if (char === "I") {
    return <ThunderBolt />;
  }

  const tone = ANIME_TONES[index] ?? ANIME_TONES[0];

  return (
    <span
      className="elemental-letter elemental-letter-anime"
      style={
        {
          "--anime-top": tone.top,
          "--anime-bottom": tone.bottom,
          "--anime-glow": tone.glow,
        } as CSSProperties
      }
    >
      <span className="elemental-letter-stone" aria-hidden />
      <span className="elemental-letter-shock">{char}</span>
    </span>
  );
}

export function ElementalSiteTitle({ primary, secondary }: ElementalSiteTitleProps) {
  const clashChars = [...primary.toUpperCase().trim()];
  const animeChars = [...secondary.toUpperCase().trim()];

  return (
    <div className={`elemental-title-wrap ${titleFont.className}`}>
      <span className="elemental-fx elemental-smoke" aria-hidden />
      <span className="elemental-fx elemental-spark elemental-spark-1" aria-hidden />
      <span className="elemental-fx elemental-spark elemental-spark-2" aria-hidden />
      <span className="elemental-fx elemental-spark elemental-spark-3" aria-hidden />
      <span className="elemental-fx elemental-thunder-flash" aria-hidden />

      <h1 className="elemental-title" aria-label={`${primary}${secondary}`}>
        <span className="elemental-row elemental-row-clash">
          {clashChars.map((char, index) => (
            <ClashLetter key={`c-${index}`} char={char} />
          ))}
        </span>
        <span className="elemental-row elemental-row-anime elemental-row-thunder">
          {animeChars.map((char, index) => (
            <AnimeLetter key={`a-${index}`} char={char} index={index} />
          ))}
        </span>
      </h1>
    </div>
  );
}
