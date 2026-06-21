"use client";

export function ClashArenaBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(249,115,22,0.22),transparent_55%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(249,115,22,0.28),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(179,27,27,0.12),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(251,191,36,0.1),transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      <div className="absolute -left-24 top-24 h-64 w-64 animate-[clash-aurora_14s_ease-in-out_infinite] rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute -right-20 top-40 h-72 w-72 animate-[clash-aurora_18s_ease-in-out_infinite_reverse] rounded-full bg-red-600/10 blur-3xl" />

      {[
        { left: "8%", top: "18%", delay: "0s", size: "h-1 w-1" },
        { left: "22%", top: "62%", delay: "1.2s", size: "h-1.5 w-1.5" },
        { left: "78%", top: "28%", delay: "0.6s", size: "h-1 w-1" },
        { left: "88%", top: "58%", delay: "1.8s", size: "h-1.5 w-1.5" },
        { left: "48%", top: "8%", delay: "2.4s", size: "h-1 w-1" },
      ].map((spark) => (
        <span
          key={`${spark.left}-${spark.top}`}
          className={`absolute ${spark.size} rounded-full bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.9)] animate-[clash-ember-rise_4s_ease-out_infinite]`}
          style={{ left: spark.left, top: spark.top, animationDelay: spark.delay }}
        />
      ))}
    </div>
  );
}
