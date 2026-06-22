"use client";

import { Orbitron } from "next/font/google";

const titleFont = Orbitron({
  subsets: ["latin"],
  weight: ["800", "900"],
});

type ElementalSiteTitleProps = {
  primary: string;
  secondary: string;
};

function LightningStrike() {
  return (
    <span className="elemental-lightning-slot" aria-hidden>
      <svg viewBox="0 0 32 64" className="elemental-lightning-svg" fill="none">
        <path
          d="M18 2 6 34h10l-4 28 20-36H22l6-24Z"
          fill="url(#bolt-fill)"
          stroke="#ecfeff"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="bolt-fill" x1="16" y1="2" x2="16" y2="62" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.45" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

function FireSlash() {
  return (
    <span className="elemental-slash-slot" aria-hidden>
      <svg viewBox="0 0 48 56" className="elemental-slash-svg" fill="none">
        <path
          d="M8 48c8-14 6-28 14-38 2 10 8 16 6 26 6-4 10-10 12-18-2 16-10 24-18 30"
          fill="url(#slash-fire)"
          opacity="0.95"
        />
        <path
          d="M26 8c6 8 8 18 4 28M20 18l12 8"
          stroke="#fef08a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="slash-fire" x1="24" y1="8" x2="24" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fde047" />
            <stop offset="0.5" stopColor="#f97316" />
            <stop offset="1" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

function ClashLetter({ char, index }: { char: string; index: number }) {
  if (index === 0) {
    return (
      <span className="elemental-letter-slot">
        <FireSlash />
        <span className="elemental-letter elemental-letter-clash">{char}</span>
      </span>
    );
  }

  return <span className="elemental-letter elemental-letter-clash">{char}</span>;
}

function AnimeLetter({ char }: { char: string }) {
  if (char === "I") {
    return <LightningStrike />;
  }

  return <span className="elemental-letter elemental-letter-anime">{char}</span>;
}

export function ElementalSiteTitle({ primary, secondary }: ElementalSiteTitleProps) {
  const clashChars = [...primary.toUpperCase().trim()];
  const animeChars = [...secondary.toUpperCase().trim()];

  return (
    <div className={`elemental-title-wrap ${titleFont.className}`}>
      <span className="elemental-ember elemental-ember-1" aria-hidden />
      <span className="elemental-ember elemental-ember-2" aria-hidden />
      <span className="elemental-ember elemental-ember-3" aria-hidden />
      <h1 className="elemental-title" aria-label={`${primary}${secondary}`}>
        <span className="elemental-row elemental-row-clash">
          {clashChars.map((char, index) => (
            <ClashLetter key={`c-${index}`} char={char} index={index} />
          ))}
        </span>
        <span className="elemental-row elemental-row-anime">
          {animeChars.map((char, index) => (
            <AnimeLetter key={`a-${index}`} char={char} />
          ))}
        </span>
      </h1>
    </div>
  );
}
