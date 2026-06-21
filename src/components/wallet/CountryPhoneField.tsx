"use client";

import { useMemo } from "react";
import {
  getKycCountryByCode,
  getKycCountryLabel,
  KYC_COUNTRIES,
  type KycCountry,
} from "@/lib/kycCountries";
import { useLocale } from "@/providers/LocaleProvider";

type CountryPhoneFieldProps = {
  countryCode: string;
  localPhone: string;
  onCountryChange: (code: string) => void;
  onLocalPhoneChange: (value: string) => void;
  countryLabel: string;
  phoneLabel: string;
  phonePlaceholder: string;
};

export function CountryPhoneField({
  countryCode,
  localPhone,
  onCountryChange,
  onLocalPhoneChange,
  countryLabel,
  phoneLabel,
  phonePlaceholder,
}: CountryPhoneFieldProps) {
  const { locale } = useLocale();

  const selectedCountry = useMemo(
    () => getKycCountryByCode(countryCode) ?? KYC_COUNTRIES[0]!,
    [countryCode],
  );

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {countryLabel}
        <div className="relative mt-2">
          <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-lg">
            {selectedCountry.flag}
          </span>
          <select
            value={countryCode}
            onChange={(event) => onCountryChange(event.target.value)}
            className="w-full appearance-none rounded-xl border border-zinc-300 bg-white py-2.5 ps-11 pe-10 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            {KYC_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {getKycCountryLabel(country, locale)} ({country.dialCode})
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-zinc-400">▾</span>
        </div>
      </label>

      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {phoneLabel}
        <div className="mt-2 flex overflow-hidden rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950">
          <div className="flex shrink-0 items-center gap-2 border-e border-zinc-200 bg-zinc-50 px-3 dark:border-zinc-800 dark:bg-zinc-900">
            <CountryBadge country={selectedCountry} locale={locale} />
          </div>
          <input
            type="tel"
            inputMode="tel"
            value={localPhone}
            onChange={(event) => onLocalPhoneChange(event.target.value)}
            placeholder={phonePlaceholder}
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
          />
        </div>
      </label>
    </div>
  );
}

function CountryBadge({ country, locale }: { country: KycCountry; locale: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
      <span className="text-base leading-none">{country.flag}</span>
      <span>{country.dialCode}</span>
      <span className="hidden text-xs font-normal text-zinc-500 sm:inline">
        {getKycCountryLabel(country, locale)}
      </span>
    </span>
  );
}
