export type ClashSeason = {
  id: string;
  name: string;
  starts_at: string;
  ends_at: string;
  status: "scheduled" | "active" | "ended";
};

export function getSeasonRemainingMs(endsAt: string, nowMs = Date.now()): number {
  return Math.max(new Date(endsAt).getTime() - nowMs, 0);
}

export function formatSeasonCountdown(remainingMs: number) {
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}
