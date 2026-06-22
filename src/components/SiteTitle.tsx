"use client";

import { Fredoka } from "next/font/google";

const doodleFont = Fredoka({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type SiteTitleProps = {
  primary: string;
  secondary: string;
  variant?: "hero" | "sidebar";
};

/** Google Doodle-style palette — warm clash + classic multi-color anime word */
const CLASH_COLORS = ["#ef4444", "#f97316", "#facc15", "#dc2626", "#fb923c"] as const;
const ANIME_COLORS = ["#4285f4", "#ea4335", "#fbbc04", "#4285f4", "#34a853"] as const;

const LETTER_TILTS = [-4, 2, -2, 3, -3, 2, -3, 1, -2, 3, -1] as const;

function DoodleLetter({
  char,
  color,
  index,
  peek,
}: {
  char: string;
  color: string;
  index: number;
  peek?: boolean;
}) {
  if (char === " ") {
    return <span className="inline-block w-[0.22em]" aria-hidden />;
  }

  const tilt = LETTER_TILTS[index % LETTER_TILTS.length];

  return (
    <span
      className={`doodle-letter-slot ${peek ? "doodle-letter-slot-peek" : ""}`}
      style={{ "--doodle-tilt": `${tilt}deg` } as React.CSSProperties}
    >
      {peek ? (
        <span className="doodle-peek" aria-hidden>
          <svg viewBox="0 0 48 64" className="h-[0.72em] w-[0.52em]" fill="none">
            <path
              d="M24 8c-8 0-14 6-14 14 0 4 2 8 5 10v2c-3 2-5 6-5 10 0 7 6 12 14 12s14-5 14-12c0-4-2-8-5-10v-2c3-2 5-6 5-10 0-8-6-14-14-14Z"
              fill="#1d4ed8"
            />
            <path
              d="M10 18c-4-6-2-14 6-16M38 18c4-6 2-14-6-16M16 6l4 8M32 6l-4 8"
              stroke="#172554"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="19" cy="26" r="2" fill="#fff" />
            <circle cx="29" cy="26" r="2" fill="#fff" />
            <path d="M20 32c2 2 6 2 8 0" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M8 42l6-10M40 42l-6-10" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
      ) : null}
      <span
        className="doodle-bubble-letter"
        style={
          {
            "--doodle-fill": color,
            "--doodle-depth": color,
          } as React.CSSProperties
        }
      >
        {char}
      </span>
    </span>
  );
}

export function SiteTitle({ primary, secondary, variant = "hero" }: SiteTitleProps) {
  const primaryChars = [...primary.toUpperCase()];
  const secondaryChars = [...secondary.toUpperCase()];
  const wrapClass =
    variant === "sidebar" ? "doodle-logo-wrap doodle-logo-wrap-sidebar" : "doodle-logo-wrap";

  return (
    <div className={`${wrapClass} ${doodleFont.className}`}>
      <div className="doodle-logo-shadow" aria-hidden />
      <h1 className="doodle-logo" aria-label={`${primary} ${secondary}`}>
        <span className="doodle-word doodle-word-clash">
          {primaryChars.map((char, index) => (
            <DoodleLetter
              key={`c-${index}`}
              char={char}
              color={CLASH_COLORS[index % CLASH_COLORS.length]}
              index={index}
            />
          ))}
        </span>
        <span className="doodle-word-gap" aria-hidden />
        <span className="doodle-word doodle-word-anime">
          {secondaryChars.map((char, index) => (
            <DoodleLetter
              key={`a-${index}`}
              char={char}
              color={ANIME_COLORS[index % ANIME_COLORS.length]}
              index={primaryChars.length + index}
              peek={char === "A" && index === 0}
            />
          ))}
        </span>
      </h1>
      <div className="doodle-spark doodle-spark-1" aria-hidden>
        ✦
      </div>
      <div className="doodle-spark doodle-spark-2" aria-hidden>
        ★
      </div>
    </div>
  );
}
