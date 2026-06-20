"use client";

type AnimeRadioSceneProps = {
  active: boolean;
  accentFrom: string;
  accentTo: string;
};

const FLOATERS = [
  { left: "8%", top: "18%", size: 18, delay: "0s" },
  { left: "82%", top: "12%", size: 14, delay: "0.8s" },
  { left: "18%", top: "72%", size: 12, delay: "1.4s" },
  { left: "76%", top: "68%", size: 16, delay: "0.3s" },
  { left: "48%", top: "8%", size: 10, delay: "1.8s" },
  { left: "62%", top: "84%", size: 13, delay: "1.1s" },
];

export function AnimeRadioScene({ active, accentFrom, accentTo }: AnimeRadioSceneProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -left-16 top-0 h-56 w-56 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accentFrom}55 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute -right-10 bottom-0 h-64 w-64 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accentTo}44 0%, transparent 72%)`,
        }}
      />

      {FLOATERS.map((item) => (
        <span
          key={`${item.left}-${item.top}`}
          className={`absolute text-accent ${active ? "animate-[radio-float_4.5s_ease-in-out_infinite]" : "opacity-20"}`}
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            fontSize: item.size,
          }}
        >
          ♪
        </span>
      ))}

      <span
        className={`absolute left-[12%] top-[42%] h-2 w-2 rounded-full bg-accent ${active ? "animate-[live-dot_1.6s_ease-in-out_infinite]" : "opacity-30"}`}
      />
      <span
        className={`absolute right-[14%] top-[36%] h-1.5 w-1.5 rounded-full bg-orange-300 ${active ? "animate-[live-dot_2s_ease-in-out_infinite]" : "opacity-30"}`}
        style={{ animationDelay: "0.4s" }}
      />
      <span
        className={`absolute right-[28%] bottom-[18%] h-2 w-2 rounded-full bg-violet-400 ${active ? "animate-[live-dot_1.8s_ease-in-out_infinite]" : "opacity-30"}`}
        style={{ animationDelay: "0.9s" }}
      />
    </div>
  );
}
