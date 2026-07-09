import type { LevelDefinition } from "@/lib/points";
import { HunterRankShield } from "@/components/hunter/HunterRankShield";
import type { RankShieldSize } from "@/lib/rankVisuals";

export type RankLetterSize = RankShieldSize;

type RankLetterProps = {
  rank: LevelDefinition["shortLabel"];
  size?: RankLetterSize;
  active?: boolean;
  muted?: boolean;
  highlighted?: boolean;
  className?: string;
  title?: string;
};

/** @deprecated Use HunterRankShield — kept for existing imports */
export function RankLetter(props: RankLetterProps) {
  return <HunterRankShield {...props} />;
}
