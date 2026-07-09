"use client";

import { RankLetter } from "@/components/RankLetter";
import { getBountiesForLevel, getLevelLabel, LEVELS } from "@/lib/points";
import { useLocale } from "@/providers/LocaleProvider";

type BountyRewardsGridProps = {
  currentLevel: number;
};

export function BountyRewardsGrid({ currentLevel }: BountyRewardsGridProps) {
  const { t, formatNumber, formatDateTime } = useLocale();

  return (
    <div className="mt-5">
      <h3 className="text-sm font-semibold text-black dark:text-white">{t.points.bountyRewardsTitle}</h3>
      <p className="mt-1 text-xs text-zinc-500">{t.points.bountyRewardsHint}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {LEVELS.map((levelDef) => {
          const unlocked = currentLevel >= levelDef.level;
          const bounties = getBountiesForLevel(levelDef.level);

          return (
            <article
              key={levelDef.level}
              className={`rounded-xl border p-4 ${
                unlocked
                  ? "border-accent/40 bg-accent/5"
                  : "border-zinc-200 bg-zinc-50 opacity-80 dark:border-zinc-800 dark:bg-zinc-950"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <RankLetter
                  rank={levelDef.shortLabel}
                  size="md"
                  active={unlocked}
                  muted={!unlocked}
                  title={getLevelLabel(levelDef.level, t.points.levels)}
                />
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    unlocked ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800"
                  }`}
                >
                  {unlocked ? t.points.bountyUnlocked : t.points.bountyLocked}
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                {getLevelLabel(levelDef.level, t.points.levels)}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {levelDef.maxPoints
                  ? `${formatNumber(levelDef.minPoints)} – ${formatNumber(levelDef.maxPoints)} ${t.points.pointsLabel}`
                  : `${formatNumber(levelDef.minPoints)}+ ${t.points.pointsLabel}`}
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
