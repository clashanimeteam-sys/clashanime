"use client";

import { getBountiesForLevel, getLevelDefinition, LEVELS, LEVEL_STYLES } from "@/lib/points";
import { useLocale } from "@/providers/LocaleProvider";

type BountyRewardsGridProps = {
  currentLevel: number;
};

export function BountyRewardsGrid({ currentLevel }: BountyRewardsGridProps) {
  const { t } = useLocale();

  return (
    <div className="mt-5">
      <h3 className="text-sm font-semibold text-black dark:text-white">{t.points.bountyRewardsTitle}</h3>
      <p className="mt-1 text-xs text-zinc-500">{t.points.bountyRewardsHint}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {LEVELS.map((levelDef) => {
          const style = LEVEL_STYLES[levelDef.rank];
          const unlocked = currentLevel >= levelDef.level;
          const bounties = getBountiesForLevel(levelDef.level);

          return (
            <article
              key={levelDef.level}
              className={`rounded-xl border p-4 transition-all ${
                unlocked
                  ? `border-accent/40 bg-accent/5 ${style.glow}`
                  : "border-zinc-200 bg-zinc-50 opacity-80 dark:border-zinc-800 dark:bg-zinc-950"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md border text-xs font-black ${style.badge}`}
                >
                  {levelDef.rank}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    unlocked ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800"
                  }`}
                >
                  {unlocked ? t.points.bountyUnlocked : t.points.bountyLocked}
                </span>
              </div>
              <h4 className="mt-3 text-sm font-bold text-black dark:text-white">
                {t.points.levels[levelDef.key]}
              </h4>
              <p className="mt-1 text-xs text-zinc-500">
                {levelDef.maxPoints
                  ? `${levelDef.minPoints.toLocaleString()} – ${levelDef.maxPoints.toLocaleString()} ${t.points.pointsLabel}`
                  : `${levelDef.minPoints.toLocaleString()}+ ${t.points.pointsLabel}`}
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                {bounties.map((rewardKey) => (
                  <li key={rewardKey} className="flex items-start gap-1.5">
                    <span className="text-accent">{unlocked ? "◆" : "◇"}</span>
                    <span>{t.points.perks[rewardKey]}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function getNextRankLabel(
  nextLevelKey: ReturnType<typeof getLevelDefinition>["key"] | null | undefined,
  t: { points: { levels: Record<string, string> } },
) {
  if (!nextLevelKey) return null;
  return t.points.levels[nextLevelKey];
}
