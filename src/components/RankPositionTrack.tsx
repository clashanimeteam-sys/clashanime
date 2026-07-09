"use client";

import { HunterRankShield } from "@/components/hunter/HunterRankShield";
import { getLevelLabel, getLevelProgress, LEVELS, pointsToLevel } from "@/lib/points";
import { getRankProgressGlow, getRankProgressGradient } from "@/lib/rankVisuals";
import { useLocale } from "@/providers/LocaleProvider";

type RankPositionTrackProps = {
  points: number;
};

export function RankPositionTrack({ points }: RankPositionTrackProps) {
  const { t, formatNumber } = useLocale();
  const computedLevel = pointsToLevel(points);
  const position = getLevelProgress(points);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/95 p-5 dark:border-zinc-800 dark:bg-black/85">
      <div className="flex flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
          {t.points.currentPositionTitle}
        </p>

        <div className="mt-4 flex max-w-full items-end justify-center gap-2 overflow-x-auto pb-1 sm:gap-3">
          {LEVELS.map((levelDef) => {
            const isCurrent = levelDef.level === computedLevel;
            const isPast = levelDef.level < computedLevel;

            return (
              <div key={levelDef.level} className="flex min-w-[3.5rem] flex-col items-center gap-2">
                <HunterRankShield
                  level={levelDef.level}
                  size="lg"
                  active={isCurrent || isPast}
                  muted={!isCurrent && !isPast}
                  highlighted={isCurrent}
                  className={isCurrent ? "scale-110" : ""}
                  title={getLevelLabel(levelDef.level, t.points.levels)}
                />
                <span className="max-w-[4.5rem] text-center text-[10px] font-semibold leading-tight text-zinc-500">
                  {getLevelLabel(levelDef.level, t.points.levels)}
                </span>
                {isCurrent ? (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                    {t.points.youAreHere}
                  </span>
                ) : (
                  <span className="h-5" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 w-full max-w-xl rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-start">
              <HunterRankShield
                level={position.current.level}
                size="lg"
                highlighted
                title={getLevelLabel(position.current.level, t.points.levels)}
              />
              <div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  {getLevelLabel(position.current.level, t.points.levels)}
                </p>
                <p className="text-xs opacity-80">
                  {t.points.globalRankPosition
                    .replace("{current}", String(computedLevel))
                    .replace("{total}", String(LEVELS.length))}
                </p>
              </div>
            </div>
            <div className="text-start sm:text-end">
              <p className="text-3xl font-black text-black dark:text-white">{formatNumber(points)}</p>
              <p className="text-xs text-zinc-500">{t.points.totalPoints}</p>
            </div>
          </div>

          {position.next ? (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                <span>
                  {t.points.pointsInRank
                    .replace("{current}", formatNumber(position.pointsInRank))
                    .replace("{max}", formatNumber(position.rankMax))}
                </span>
                <span>{position.tierProgress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="rank-progress-bar h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${position.tierProgress}%`,
                    background: getRankProgressGradient(computedLevel),
                    boxShadow: getRankProgressGlow(computedLevel),
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {position.pointsToNext === 0
                  ? t.points.readyToRankUp.replace(
                      "{rank}",
                      getLevelLabel(position.next.level, t.points.levels),
                    )
                  : t.points.pointsToNext
                      .replace("{count}", formatNumber(position.pointsToNext))
                      .replace(
                        "{rank}",
                        getLevelLabel(position.next.level, t.points.levels),
                      )}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-xs font-semibold text-amber-500">{t.points.maxLevelReached}</p>
          )}
        </div>
      </div>
    </div>
  );
}
