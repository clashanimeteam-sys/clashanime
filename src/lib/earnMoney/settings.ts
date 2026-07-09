export const EARN_MONEY_SETTINGS_KEY = "earn_money_settings";

export type EarnMoneySettings = {
  rewardUsd: number;
};

export const DEFAULT_EARN_MONEY_SETTINGS: EarnMoneySettings = {
  rewardUsd: 2,
};

export function parseEarnMoneySettings(value: unknown): EarnMoneySettings {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_EARN_MONEY_SETTINGS };
  }

  const raw = value as { rewardUsd?: unknown };
  const rewardUsd = Number(raw.rewardUsd);

  if (!Number.isFinite(rewardUsd) || rewardUsd < 0.5 || rewardUsd > 1000) {
    return { ...DEFAULT_EARN_MONEY_SETTINGS };
  }

  return {
    rewardUsd: Math.round(rewardUsd * 100) / 100,
  };
}

export function earnMoneyRewardCents(settings: EarnMoneySettings): number {
  return Math.round(settings.rewardUsd * 100);
}

/** Always Western digits for reward display (even in Arabic UI). */
export function formatEarnMoneyUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatEarnMoneyUsdPlain(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
