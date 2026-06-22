import type { Locale } from "@/lib/types";

/** BCP-47 locale tag; Arabic uses Latin digits (1234567890). */
export function getIntlLocale(locale: Locale): string {
  switch (locale) {
    case "ar":
      return "ar-u-nu-latn";
    case "ja":
      return "ja-JP";
    default:
      return "en-US";
  }
}

export function formatNumber(value: number, locale: Locale = "en"): string {
  return new Intl.NumberFormat(getIntlLocale(locale)).format(value);
}

export function formatDateTime(
  value: Date | string | number,
  locale: Locale = "en",
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(getIntlLocale(locale), options).format(date);
}

export function formatCurrencyUsd(
  amount: number,
  locale: Locale = "en",
  options?: Pick<Intl.NumberFormatOptions, "minimumFractionDigits" | "maximumFractionDigits">,
): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(amount);
}
