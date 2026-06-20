"use client";

type AnimeRadioVisualizerProps = {
  active: boolean;
  bars?: number;
  compact?: boolean;
  mini?: boolean;
};

export function AnimeRadioVisualizer({
  active,
  bars = 14,
  compact = false,
  mini = false,
}: AnimeRadioVisualizerProps) {
  const barCount = mini ? 8 : compact ? 10 : bars;
  const containerClass = mini
    ? "h-6 gap-0.5"
    : compact
      ? "h-9 gap-1"
      : "h-14 gap-1.5 sm:h-16";
  const barClass = mini ? "w-0.5" : compact ? "w-1 sm:w-1.5" : "w-1.5 sm:w-2";

  return (
    <div className={`flex items-end justify-center ${containerClass}`} aria-hidden>
      {Array.from({ length: barCount }, (_, index) => (
        <span
          key={index}
          className={`${barClass} rounded-full bg-gradient-to-t from-accent to-orange-300 ${
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
