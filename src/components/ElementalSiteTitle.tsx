"use client";

import { Fredoka } from "next/font/google";
import { type CSSProperties, type ReactNode } from "react";

const doodleFont = Fredoka({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type ElementalSiteTitleProps = {
  primary: string;
  secondary: string;
};

type MascotPlacement =
  | "top"
  | "inside"
  | "inside-bottom"
  | "behind"
  | "lean"
  | "bolt";

type LetterConfig = {
  color: string;
  tilt: number;
  placement?: MascotPlacement;
  mascot?: ReactNode;
  replace?: ReactNode;
};

/** Google Doodle palette — warm CLASH + classic multi-color ANIME */
const CLASH_CONFIG: LetterConfig[] = [
  {
    color: "#ea4335",
    tilt: -5,
    placement: "inside-bottom",
    mascot: <ChibiSleeping />,
  },
  {
    color: "#fbbc04",
    tilt: 3,
    placement: "top",
    mascot: <ChibiFighter />,
  },
  {
    color: "#4285f4",
    tilt: -2,
    placement: "inside",
    mascot: <ChibiStrawHat />,
  },
  {
    color: "#34a853",
    tilt: 4,
    placement: "lean",
    mascot: <ChibiShocked />,
  },
  {
    color: "#ea4335",
    tilt: -3,
    placement: "top",
    mascot: <ChibiThunderKid />,
  },
];

const ANIME_CONFIG: LetterConfig[] = [
  {
    color: "#4285f4",
    tilt: -3,
    placement: "behind",
    mascot: <ChibiPeek />,
  },
  {
    color: "#ea4335",
    tilt: 2,
    placement: "inside",
    mascot: <ChibiSit />,
  },
  {
    color: "#fbbc04",
    tilt: 0,
    placement: "bolt",
    replace: <DoodleLightning />,
  },
  {
    color: "#4285f4",
    tilt: -4,
    placement: "top",
    mascot: <ChibiPerch />,
  },
  {
    color: "#34a853",
    tilt: 3,
    placement: "inside",
    mascot: <ChibiFlamePet />,
  },
];

function ChibiSleeping() {
  return (
    <svg viewBox="0 0 52 44" className="doodle-mascot-svg" fill="none" aria-hidden>
      <ellipse cx="26" cy="30" rx="14" ry="10" fill="#fff" stroke="#1a1a1a" strokeWidth="1.6" />
      <circle cx="26" cy="16" r="11" fill="#f5f5f4" stroke="#1a1a1a" strokeWidth="1.6" />
      <path d="M18 14c2-4 8-5 11-2" stroke="#78716c" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 18h4M32 18h4" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      <text x="34" y="8" fill="#78716c" fontSize="7" fontFamily="Fredoka, sans-serif">
        zzz
      </text>
      <path d="M8 38c4-2 8-2 12 0" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function ChibiFighter() {
  return (
    <svg viewBox="0 0 48 56" className="doodle-mascot-svg" fill="none" aria-hidden>
      <path d="M24 52V34" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="24" cy="22" rx="11" ry="12" fill="#fecaca" stroke="#1a1a1a" strokeWidth="1.6" />
      <path d="M14 18c2-6 14-6 16 0" fill="#991b1b" stroke="#1a1a1a" strokeWidth="1.4" />
      <circle cx="20" cy="22" r="1.6" fill="#1a1a1a" />
      <circle cx="28" cy="22" r="1.6" fill="#1a1a1a" />
      <path d="M21 27c2 2 4 2 6 0" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 30l8-4M38 30l-8-4" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 8l4 6-6 2 2-8Z" fill="#f97316" stroke="#1a1a1a" strokeWidth="1.2" />
    </svg>
  );
}

function ChibiStrawHat() {
  return (
    <svg viewBox="0 0 52 58" className="doodle-mascot-svg" fill="none" aria-hidden>
      <ellipse cx="26" cy="14" rx="16" ry="4" fill="#facc15" stroke="#1a1a1a" strokeWidth="1.4" />
      <path d="M12 14c2-10 12-14 22-10" fill="#fde047" stroke="#1a1a1a" strokeWidth="1.4" />
      <rect x="16" y="12" width="20" height="4" rx="1" fill="#dc2626" />
      <ellipse cx="26" cy="34" rx="12" ry="13" fill="#fde68a" stroke="#1a1a1a" strokeWidth="1.6" />
      <circle cx="22" cy="32" r="1.8" fill="#1a1a1a" />
      <circle cx="30" cy="32" r="1.8" fill="#1a1a1a" />
      <path d="M22 38c2 3 6 3 8 0" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChibiShocked() {
  return (
    <svg viewBox="0 0 44 54" className="doodle-mascot-svg" fill="none" aria-hidden>
      <ellipse cx="22" cy="28" rx="10" ry="12" fill="#e7e5e4" stroke="#1a1a1a" strokeWidth="1.6" />
      <circle cx="18" cy="26" r="2.2" fill="#fff" stroke="#1a1a1a" strokeWidth="1.2" />
      <circle cx="26" cy="26" r="2.2" fill="#fff" stroke="#1a1a1a" strokeWidth="1.2" />
      <circle cx="18" cy="26" r="1" fill="#1a1a1a" />
      <circle cx="26" cy="26" r="1" fill="#1a1a1a" />
      <ellipse cx="22" cy="33" rx="3" ry="4" fill="#1a1a1a" />
      <path d="M22 40v10" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <text x="28" y="10" fill="#dc2626" fontSize="8" fontWeight="700" fontFamily="Fredoka, sans-serif">
        !!!
      </text>
    </svg>
  );
}

function ChibiThunderKid() {
  return (
    <svg viewBox="0 0 46 58" className="doodle-mascot-svg" fill="none" aria-hidden>
      <path d="M23 54V36" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="23" cy="24" rx="10" ry="11" fill="#dbeafe" stroke="#1a1a1a" strokeWidth="1.6" />
      <path d="M14 16c2-5 12-5 14 0" fill="#1e3a8a" stroke="#1a1a1a" strokeWidth="1.3" />
      <circle cx="19" cy="24" r="1.5" fill="#1a1a1a" />
      <circle cx="27" cy="24" r="1.5" fill="#1a1a1a" />
      <path d="M28 6 22 20h6l-4 14 12-20h-7l3-8Z" fill="#fde047" stroke="#1a1a1a" strokeWidth="1.2" />
    </svg>
  );
}

function ChibiPeek() {
  return (
    <svg viewBox="0 0 48 64" className="doodle-mascot-svg doodle-mascot-svg-peek" fill="none" aria-hidden>
      <path
        d="M24 8c-8 0-14 6-14 14 0 4 2 8 5 10v2c-3 2-5 6-5 10 0 7 6 12 14 12s14-5 14-12c0-4-2-8-5-10v-2c3-2 5-6 5-10 0-8-6-14-14-14Z"
        fill="#1d4ed8"
        stroke="#172554"
        strokeWidth="1.6"
      />
      <path d="M10 18c-4-6-2-14 6-16M38 18c4-6 2-14-6-16" stroke="#172554" strokeWidth="2" strokeLinecap="round" />
      <circle cx="19" cy="26" r="2" fill="#fff" />
      <circle cx="29" cy="26" r="2" fill="#fff" />
      <path d="M20 32c2 2 6 2 8 0" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChibiSit() {
  return (
    <svg viewBox="0 0 44 50" className="doodle-mascot-svg" fill="none" aria-hidden>
      <ellipse cx="22" cy="30" rx="11" ry="9" fill="#fff" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="22" cy="16" r="9" fill="#fecdd3" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d="M14 12c2-4 12-4 14 0" fill="#881337" stroke="#1a1a1a" strokeWidth="1.2" />
      <circle cx="18" cy="16" r="1.4" fill="#1a1a1a" />
      <circle cx="26" cy="16" r="1.4" fill="#1a1a1a" />
      <path d="M19 20h6" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChibiPerch() {
  return (
    <svg viewBox="0 0 48 54" className="doodle-mascot-svg" fill="none" aria-hidden>
      <path d="M24 50V32" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="24" cy="20" rx="10" ry="11" fill="#fef3c7" stroke="#1a1a1a" strokeWidth="1.5" />
      <rect x="14" y="8" width="20" height="8" rx="2" fill="#1a1a1a" />
      <rect x="16" y="6" width="16" height="4" rx="1" fill="#44403c" />
      <circle cx="20" cy="21" r="1.4" fill="#1a1a1a" />
      <circle cx="28" cy="21" r="1.4" fill="#1a1a1a" />
      <path d="M21 26c2 2 4 2 6 0" stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ChibiFlamePet() {
  return (
    <svg viewBox="0 0 54 52" className="doodle-mascot-svg" fill="none" aria-hidden>
      <ellipse cx="20" cy="28" rx="9" ry="10" fill="#bbf7d0" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="17" cy="26" r="1.3" fill="#1a1a1a" />
      <circle cx="23" cy="26" r="1.3" fill="#1a1a1a" />
      <path d="M34 34c6-8 10-16 8-24-6 4-10 12-8 20 2-6 6-10 10-12-4 8-6 14-4 18" fill="#fb923c" stroke="#1a1a1a" strokeWidth="1.2" />
      <path d="M38 38c2-4 4-8 3-12" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DoodleLightning() {
  return (
    <span className="doodle-bolt-letter" aria-hidden>
      <svg viewBox="0 0 28 52" className="doodle-bolt-svg" fill="none">
        <path d="M16 1 5 28h9l-3 23 17-31H18l5-19Z" fill="#fde047" stroke="#1a1a1a" strokeWidth="1.4" />
        <path d="M10 16h10M8 26h8" stroke="#fef08a" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function DoodleLetter({
  char,
  config,
  row,
}: {
  char: string;
  config: LetterConfig;
  row: "clash" | "anime";
}) {
  if (config.replace) {
    return (
      <span
        className={`doodle-letter-slot doodle-letter-slot-${row}`}
        style={{ "--doodle-tilt": `${config.tilt}deg` } as CSSProperties}
      >
        {config.replace}
      </span>
    );
  }

  const placement = config.placement ?? "top";

  return (
    <span
      className={`doodle-letter-slot doodle-letter-slot-${row} doodle-letter-slot-${placement}`}
      style={{ "--doodle-tilt": `${config.tilt}deg` } as CSSProperties}
    >
      {config.mascot ? (
        <span className={`doodle-mascot doodle-mascot-${placement}`}>{config.mascot}</span>
      ) : null}
      <span
        className="doodle-bubble-letter"
        style={
          {
            "--doodle-fill": config.color,
          } as CSSProperties
        }
      >
        {char}
      </span>
    </span>
  );
}

export function ElementalSiteTitle({ primary, secondary }: ElementalSiteTitleProps) {
  const clashChars = [..."CLASH"];
  const animeChars = [..."ANIME"];

  return (
    <div
      dir="ltr"
      className={`doodle-logo-ltr doodle-logo-wrap doodle-logo-wrap-sidebar doodle-logo-wrap-interactive ${doodleFont.className}`}
    >
      <div className="doodle-logo-shadow" aria-hidden />
      <span className="doodle-fx doodle-fire-glow" aria-hidden />
      <span className="doodle-fx doodle-thunder-glow" aria-hidden />

      <h1 className="doodle-logo" aria-label={`${primary}${secondary}`}>
        <span className="doodle-word doodle-word-clash">
          {clashChars.map((char, index) => (
            <DoodleLetter
              key={`c-${index}`}
              char={char}
              config={CLASH_CONFIG[index % CLASH_CONFIG.length]}
              row="clash"
            />
          ))}
        </span>
        <span className="doodle-word doodle-word-anime">
          {animeChars.map((char, index) => (
            <DoodleLetter
              key={`a-${index}`}
              char={char}
              config={ANIME_CONFIG[index % ANIME_CONFIG.length]}
              row="anime"
            />
          ))}
        </span>
      </h1>

      <div className="doodle-spark doodle-spark-1" aria-hidden>
        ✦
      </div>
      <div className="doodle-spark doodle-spark-2" aria-hidden>
        ⚡
      </div>
      <div className="doodle-ember doodle-ember-1" aria-hidden />
      <div className="doodle-ember doodle-ember-2" aria-hidden />
    </div>
  );
}
