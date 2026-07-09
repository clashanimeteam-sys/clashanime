import type { LevelDefinition } from "@/lib/points";

export type RankLetterSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<RankLetterSize, string> = {
  sm: "h-6 min-w-6 rounded-md px-1 text-[10px]",
  md: "h-8 min-w-8 rounded-lg px-1.5 text-[11px]",
  lg: "h-10 min-w-10 rounded-lg px-1.5 text-xs",
  xl: "h-12 min-w-12 rounded-xl px-2 text-sm",
};

const rankDesign: Record<LevelDefinition["shortLabel"], string> = {
  N: "rank-letter rank-letter-n",
  EX: "rank-letter rank-letter-ex",
  D: "rank-letter rank-letter-d",
  M: "rank-letter rank-letter-m",
  CM: "rank-letter rank-letter-cm",
};

type RankLetterProps = {
  rank: LevelDefinition["shortLabel"];
  size?: RankLetterSize;
  active?: boolean;
  muted?: boolean;
  className?: string;
  title?: string;
};

export function RankLetter({
  rank,
  size = "md",
  active = true,
  muted = false,
  className = "",
  title,
}: RankLetterProps) {
  return (
    <span
      dir="ltr"
      className={`box-border inline-flex shrink-0 items-center justify-center border p-0 font-sans font-black ${sizeClasses[size]} ${rankDesign[rank]} ${
        muted ? "opacity-45 grayscale" : active ? "" : "opacity-70"
      } ${className}`}
      title={title}
      aria-label={title ?? rank}
    >
      <span className="rank-letter-glyph">{rank}</span>
    </span>
  );
}
