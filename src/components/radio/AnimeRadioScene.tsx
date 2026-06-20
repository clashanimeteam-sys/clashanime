"use client";

type AnimeRadioSceneProps = {
  active: boolean;
  accentFrom: string;
  accentTo: string;
};

const FLOATERS = [
  { left: "8%", top: "18%", size: 18, delay: "0s", glyph: "♪" },
  { left: "82%", top: "12%", size: 14, delay: "0.8s", glyph: "★" },
  { left: "18%", top: "72%", size: 12, delay: "1.4s", glyph: "♫" },
  { left: "76%", top: "68%", size: 16, delay: "0.3s", glyph: "✦" },
  { left: "48%", top: "8%", size: 10, delay: "1.8s", glyph: "♪" },
  { left: "62%", top: "84%", size: 13, delay: "1.1s", glyph: "☆" },
  { left: "32%", top: "52%", size: 11, delay: "2.2s", glyph: "⚡" },
  { left: "90%", top: "48%", size: 15, delay: "0.5s", glyph: "♪" },
];

const SPARKS = [
  { left: "22%", top: "28%", delay: "0s" },
  { left: "68%", top: "22%", delay: "0.7s" },
  { left: "54%", top: "62%", delay: "1.3s" },
  { left: "10%", top: "58%", delay: "1.9s" },
];

export function AnimeRadioScene({ active, accentFrom, accentTo }: AnimeRadioSceneProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent ${active ? "animate-[aurora-drift_3s_ease-in-out_infinite]" : "opacity-20"}`}
      />

      {active ? (
        <>
          <div
            className="absolute left-1/2 top-0 h-full w-24 -translate-x-1/2 animate-[aurora-drift_6s_ease-in-out_infinite]"
            style={{
              background: `linear-gradient(180deg, ${accentFrom}22 0%, transparent 55%, ${accentTo}18 100%)`,
            }}
          />
          <div className="absolute inset-0 animate-[backdrop-crossfade_5s_ease-in-out_infinite_alternate] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_45%)]" />
        </>
      ) : null}

      {FLOATERS.map((item) => (
        <span
          key={`${item.left}-${item.top}`}
          className={`absolute text-accent drop-shadow-[0_0_8px_rgba(249,115,22,0.65)] ${active ? "animate-[radio-float_4.5s_ease-in-out_infinite]" : "opacity-15"}`}
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            fontSize: item.size,
          }}
        >
          {item.glyph}
        </span>
      ))}

      {SPARKS.map((spark) => (
        <span
          key={`${spark.left}-${spark.top}`}
          className={`absolute h-1 w-1 rounded-full bg-white ${active ? "animate-[live-dot_1.4s_ease-in-out_infinite]" : "opacity-20"}`}
          style={{ left: spark.left, top: spark.top, animationDelay: spark.delay }}
        />
      ))}

      <span
        className={`absolute left-[12%] top-[42%] h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(249,115,22,0.8)] ${active ? "animate-[live-dot_1.6s_ease-in-out_infinite]" : "opacity-30"}`}
      />
      <span
        className={`absolute right-[14%] top-[36%] h-1.5 w-1.5 rounded-full bg-orange-300 shadow-[0_0_10px_rgba(251,191,36,0.7)] ${active ? "animate-[live-dot_2s_ease-in-out_infinite]" : "opacity-30"}`}
        style={{ animationDelay: "0.4s" }}
      />
      <span
        className={`absolute right-[28%] bottom-[18%] h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.7)] ${active ? "animate-[live-dot_1.8s_ease-in-out_infinite]" : "opacity-30"}`}
        style={{ animationDelay: "0.9s" }}
      />
    </div>
  );
}
