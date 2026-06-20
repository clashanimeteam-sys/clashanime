"use client";

import { getLevelProgress, LEVELS, LEVEL_STYLES, pointsToLevel } from "@/lib/points";
import { useLocale } from "@/providers/LocaleProvider";

type RankPositionTrackProps = {
  points: number;
  storedLevel?: number | null;
};

export function RankPositionTrack({ points, storedLevel }: RankPositionTrackProps) {
  const { t } = useLocale();
  const computedLevel = pointsToLevel(points);
  const position = getLevelProgress(points);
  const currentStyle = LEVEL_STYLES[position.current.rank];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/95 p-5 dark:border-zinc-800 dark:bg-black/85">
      <div className="flex flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
          {t.points.currentPositionTitle}
        </p>

        <div className="mt-4 flex items-end justify-center gap-3 sm:gap-5">
          {LEVELS.map((levelDef) => {
            const style = LEVEL_STYLES[levelDef.rank];
            const isCurrent = levelDef.level === computedLevel;
            const isPast = levelDef.level < computedLevel;

            return (
              <div key={levelDef.level} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl border text-lg font-black sm:h-16 sm:w-16 ${
                    isCurrent
                      ? `${style.badge} ${style.glow} scale-110 ring-2 ${style.ring}`
                      : isPast
                        ? `${style.badge} opacity-80`
                        : "border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
                  }`}
                >
                  {levelDef.rank}
                </div>
                <p
                  className={`max-w-[4.5rem] text-[10px] font-bold leading-tight sm:text-xs ${
                    isCurrent ? "text-accent" : "text-zinc-500"
                  }`}
                >
                  {t.points.levels[levelDef.key]}
                </p>
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

        <div className={`mt-5 w-full max-w-xl rounded-xl border p-4 ${currentStyle.badge}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-start">
              <p className="text-sm font-bold text-black dark:text-white">
                {t.points.rank} {position.current.rank} · {t.points.levels[position.current.key]}
              </p>
              <p className="mt-1 text-xs opacity-80">
                {t.points.globalRankPosition
                  .replace("{current}", String(computedLevel))
                  .replace("{total}", String(LEVELS.length))}
              </p>
            </div>
            <div className="text-start sm:text-end">
              <p className="text-3xl font-black text-black dark:text-white">{points.toLocaleString()}</p>
              <p className="text-xs opacity-80">{t.points.totalPoints}</p>
            </div>
          </div>

          {position.next ? (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs opacity-80">
                <span>
                  {t.points.pointsInRank
                    .replace("{current}", position.pointsInRank.toLocaleString())
                    .replace("{max}", position.rankMax.toLocaleString())}
                </span>
                <span>{position.tierProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-orange-400"
                  style={{ width: `${position.tierProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs opacity-80">
                {position.pointsToNext === 0
                  ? t.points.readyToRankUp.replace("{rank}", t.points.levels[position.next.key])
                  : t.points.pointsToNext
                      .replace("{count}", position.pointsToNext.toLocaleString())
                      .replace("{rank}", t.points.levels[position.next.key])}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-xs font-semibold text-amber-500">{t.points.maxLevelReached}</p>
          )}
        </div>

        {storedLevel != null && storedLevel !== computedLevel ? (
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">{t.points.levelSyncNote}</p>
        ) : null}
      </div>
    </div>
  );
}

export function getNextRankLabel(
  nextLevelKey: ReturnType<typeof getLevelProgress>["nextLevelKey"],
  t: { points: { levels: Record<string, string> } },
) {
  if (!nextLevelKey) return null;
  return t.points.levels[nextLevelKey];
}
