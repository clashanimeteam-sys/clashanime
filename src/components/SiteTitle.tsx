"use client";

type SiteTitleProps = {
  primary: string;
  secondary: string;
};

export function SiteTitle({ primary, secondary }: SiteTitleProps) {
  return (
    <h1 className="font-display text-4xl font-black uppercase tracking-[0.14em] drop-shadow-[0_2px_12px_rgba(255,255,255,0.85)] sm:text-5xl lg:text-6xl dark:drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
      <span className="bg-gradient-to-br from-brand via-red-600 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(179,27,27,0.35)]">
        {primary}
      </span>
      <span className="text-black dark:text-white">{secondary}</span>
    </h1>
  );
}
