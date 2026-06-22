import type { Locale } from "@/lib/types";
import { getIntlLocale } from "@/lib/formatLocale";

export type ClashSeason = {
  id: string;
  name: string;
  starts_at: string;
  ends_at: string;
  status: "scheduled" | "active" | "ended";
  prize_rank_1_cents: number;
  prize_rank_2_cents: number;
  prize_rank_3_cents: number;
};

export type ClashSeasonPrizes = {
  rank1Cents: number;
  rank2Cents: number;
  rank3Cents: number;
};

export const DEFAULT_SEASON_PRIZES: ClashSeasonPrizes = {
  rank1Cents: 100000,
  rank2Cents: 50000,
  rank3Cents: 25000,
};

export function getSeasonPrizes(season: ClashSeason | null | undefined): ClashSeasonPrizes {
  if (!season) return DEFAULT_SEASON_PRIZES;

  return {
    rank1Cents: season.prize_rank_1_cents ?? DEFAULT_SEASON_PRIZES.rank1Cents,
    rank2Cents: season.prize_rank_2_cents ?? DEFAULT_SEASON_PRIZES.rank2Cents,
    rank3Cents: season.prize_rank_3_cents ?? DEFAULT_SEASON_PRIZES.rank3Cents,
  };
}

export function formatPrizeUsd(cents: number, locale: string): string {
  const intlLocale = getIntlLocale(
    locale === "ja" ? "ja" : locale === "ar" ? "ar" : "en",
  );
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function dollarsToCents(value: string | number): number {
  const dollars = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(dollars) || dollars < 0) return 0;
  return Math.round(dollars * 100);
}

export function centsToDollarsInput(cents: number): string {
  return (cents / 100).toFixed(0);
}

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
