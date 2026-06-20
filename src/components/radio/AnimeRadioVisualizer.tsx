"use client";

type AnimeRadioVisualizerProps = {
  active: boolean;
  bars?: number;
};

export function AnimeRadioVisualizer({ active, bars = 14 }: AnimeRadioVisualizerProps) {
  return (
    <div className="flex h-14 items-end justify-center gap-1.5 sm:h-16" aria-hidden>
      {Array.from({ length: bars }, (_, index) => (
        <span
          key={index}
          className={`w-1.5 rounded-full bg-gradient-to-t from-accent to-orange-300 sm:w-2 ${
            active ? "origin-bottom animate-[radio-bar_0.85s_ease-in-out_infinite]" : "h-2 opacity-30"
          }`}
          style={
            active
              ? {
                  height: `${28 + ((index * 17) % 55)}%`,
                  animationDelay: `${index * 70}ms`,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
