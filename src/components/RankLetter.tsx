import type { LevelDefinition } from "@/lib/points";

export type RankLetterSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<RankLetterSize, string> = {
  sm: "h-7 min-w-7 text-[11px] rounded-lg",
  md: "h-9 min-w-9 text-sm rounded-xl",
  lg: "h-11 min-w-11 text-base rounded-xl",
  xl: "h-16 min-w-16 text-2xl rounded-2xl",
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
      className={`inline-flex items-center justify-center border font-display font-black leading-none tracking-tight ${sizeClasses[size]} ${rankDesign[rank]} ${
        muted ? "opacity-45 grayscale" : active ? "" : "opacity-70"
      } ${className}`}
      title={title}
      aria-label={rank}
    >
      {rank}
    </span>
  );
}
