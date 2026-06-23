import type { LevelDefinition } from "@/lib/points";

export type RankLetterSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<RankLetterSize, string> = {
  sm: "h-6 w-6 rounded-md text-[10px]",
  md: "h-8 w-8 rounded-lg text-xs",
  lg: "h-10 w-10 rounded-lg text-sm",
  xl: "h-14 w-14 rounded-xl text-xl",
};

const rankDesign: Record<LevelDefinition["rank"], string> = {
  E: "rank-letter rank-letter-e",
  C: "rank-letter rank-letter-c",
  A: "rank-letter rank-letter-a",
  S: "rank-letter rank-letter-s",
};

type RankLetterProps = {
  rank: LevelDefinition["rank"];
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
      aria-label={rank}
    >
      <span className={`rank-letter-glyph rank-letter-glyph-${rank.toLowerCase()}`}>{rank}</span>
    </span>
  );
}
