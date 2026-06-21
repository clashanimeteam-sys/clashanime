export const POINTS_PER_CLASH_COIN = 1000;
export const CLASH_COINS_PER_USD = 1;
export const MIN_WITHDRAWAL_COINS = 50;
export const MIN_WITHDRAWAL_USD = MIN_WITHDRAWAL_COINS * CLASH_COINS_PER_USD;
export const FRAUD_DAILY_POINTS_THRESHOLD = 10000;
export const WITHDRAWAL_REVIEW_HOURS = 48;

export const PAYMENT_METHODS = [
  "paypal",
  "wise",
  "revolut",
  "crypto_usdt",
  "crypto_btc",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type WithdrawalStatus =
  | "pending"
  | "reviewing"
  | "completed"
  | "rejected"
  | "fraud_blocked";

export type CoinTransaction = {
  id: string;
  amount: number;
  reason: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type WithdrawalRequest = {
  id: string;
  coin_amount: number;
  usd_amount: number;
  payment_method: PaymentMethod;
  payment_destination: string;
  status: WithdrawalStatus;
  kyc_acknowledged: boolean;
  fraud_flags: unknown[];
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export function pointsToClashCoins(points: number): number {
  return Math.floor(points / POINTS_PER_CLASH_COIN);
}

export function clashCoinsToUsd(coins: number): number {
  return coins * CLASH_COINS_PER_USD;
}

export function formatClashCoins(coins: number): string {
  return coins.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isValidConversionAmount(points: number): boolean {
  return points >= POINTS_PER_CLASH_COIN && points % POINTS_PER_CLASH_COIN === 0;
}
