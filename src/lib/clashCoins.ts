export const POINTS_PER_DOLLAR = 1000;
export const MIN_CONVERSION_POINTS = 100;
export const CONVERSION_POINTS_STEP = 100;
export const CENTS_PER_DOLLAR = 100;
export const MIN_WITHDRAWAL_CENTS = 5000;
export const MIN_WITHDRAWAL_USD = MIN_WITHDRAWAL_CENTS / CENTS_PER_DOLLAR;
export const FRAUD_DAILY_POINTS_THRESHOLD = 10000;
export const WITHDRAWAL_REVIEW_HOURS = 48;

export const PAYMENT_METHOD = "bank_transfer" as const;

export type PaymentMethod = typeof PAYMENT_METHOD;

export type BankTransferDetails = {
  iban: string;
  accountHolderName: string;
  recipientEmail: string;
};

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
  payment_details?: BankTransferDetails | Record<string, unknown>;
  status: WithdrawalStatus;
  kyc_acknowledged: boolean;
  fraud_flags: unknown[];
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export function pointsToCents(points: number): number {
  return Math.floor((points * CENTS_PER_DOLLAR) / POINTS_PER_DOLLAR);
}

export function pointsToUsd(points: number): number {
  return pointsToCents(points) / CENTS_PER_DOLLAR;
}

export function centsToUsd(cents: number): number {
  return cents / CENTS_PER_DOLLAR;
}

export function usdToCents(usd: number): number {
  return Math.round(usd * CENTS_PER_DOLLAR);
}

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / CENTS_PER_DOLLAR);
}

export function formatUsd(usd: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd);
}

export function formatConversionPreviewAmount(usd: number, locale?: string): string {
  if (locale === "ar") {
    return `${usd.toFixed(2)} US$`;
  }
  return formatUsd(usd);
}

export function isValidConversionAmount(points: number): boolean {
  return (
    points >= MIN_CONVERSION_POINTS &&
    points % CONVERSION_POINTS_STEP === 0
  );
}

export function parseUsdInput(value: string): number | null {
  const normalized = value.replace(/[^0-9.,]/g, "").replace(",", ".");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.round(parsed * CENTS_PER_DOLLAR);
}
