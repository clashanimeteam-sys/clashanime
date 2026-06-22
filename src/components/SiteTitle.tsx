"use client";

type SiteTitleProps = {
  primary: string;
  secondary: string;
};

function AnimatedLetter({
  char,
  index,
  variant,
}: {
  char: string;
  index: number;
  variant: "primary" | "secondary";
}) {
  if (char === " ") {
    return <span className="inline-block w-[0.35em]" aria-hidden />;
  }

  const enterDelay = `${index * 0.07}s`;
  const floatDelay = `${index * 0.11}s`;
  const trailDelay = `${index * 0.11}s`;

  return (
    <span
      className="anime-title-letter relative inline-block will-change-transform"
      style={
        {
          "--enter-delay": enterDelay,
          "--float-delay": floatDelay,
          "--trail-delay": trailDelay,
        } as React.CSSProperties
      }
    >
      <span
        className={`anime-title-trail pointer-events-none absolute inset-0 select-none ${
          variant === "primary" ? "anime-title-trail-primary" : "anime-title-trail-secondary"
        }`}
        aria-hidden
      >
        {char}
      </span>
      <span
        className={
          variant === "primary"
            ? "relative bg-gradient-to-br from-brand via-red-600 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(179,27,27,0.35)]"
            : "relative text-black dark:text-white"
        }
      >
        {char}
      </span>
    </span>
  );
}

function splitLetters(text: string, startIndex: number, variant: "primary" | "secondary") {
  return [...text].map((char, offset) => (
    <AnimatedLetter key={`${variant}-${startIndex + offset}`} char={char} index={startIndex + offset} variant={variant} />
  ));
}

export function SiteTitle({ primary, secondary }: SiteTitleProps) {
  const secondaryStart = primary.length + 1;

  return (
    <div className="anime-title-wrap relative inline-block max-w-full">
      <div className="anime-title-speed-lines pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <span className="anime-title-speed-line anime-title-speed-line-1" />
        <span className="anime-title-speed-line anime-title-speed-line-2" />
        <span className="anime-title-speed-line anime-title-speed-line-3" />
      </div>
      <div className="anime-title-aura pointer-events-none absolute -inset-x-6 -inset-y-3 rounded-[2rem] opacity-70" aria-hidden />

      <h1 className="anime-title-heading relative font-display text-4xl font-black uppercase tracking-[0.14em] sm:text-5xl lg:text-6xl">
        {splitLetters(primary, 0, "primary")}
        <span className="inline-block w-[0.28em]" aria-hidden />
        {splitLetters(secondary, secondaryStart, "secondary")}
      </h1>
    </div>
  );
}
