"use client";

import { useMemo } from "react";
import { getKycCountryByCode, KYC_COUNTRIES, type KycCountry } from "@/lib/kycCountries";

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
  const selectedCountry = useMemo(
    () => getKycCountryByCode(countryCode) ?? KYC_COUNTRIES[0]!,
    [countryCode],
  );

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {countryLabel}
        <div className="relative mt-2 inline-flex w-full max-w-[5.5rem]">
          <select
            value={countryCode}
            onChange={(event) => onCountryChange(event.target.value)}
            aria-label={countryLabel}
            className="w-full appearance-none rounded-xl border border-zinc-300 bg-white py-2.5 pe-8 ps-3 text-xl leading-none text-transparent dark:border-zinc-700 dark:bg-zinc-950"
          >
            {KYC_COUNTRIES.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-base text-zinc-900 dark:text-zinc-100"
              >
                {country.flag} {country.dialCode}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-xl leading-none"
          >
            {selectedCountry.flag}
          </span>
          <span className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
            ▾
          </span>
        </div>
      </label>

      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {phoneLabel}
        <div className="mt-2 flex overflow-hidden rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950">
          <div className="flex shrink-0 items-center border-e border-zinc-200 bg-zinc-50 px-3 dark:border-zinc-800 dark:bg-zinc-900">
            <DialCodeBadge country={selectedCountry} />
          </div>
          <input
            type="tel"
            inputMode="tel"
            value={localPhone}
            onChange={(event) => onLocalPhoneChange(event.target.value)}
            placeholder={phonePlaceholder}
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none dark:text-white"
          />
        </div>
      </label>
    </div>
  );
}

function DialCodeBadge({ country }: { country: KycCountry }) {
  return (
    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200" dir="ltr">
      {country.dialCode}
    </span>
  );
}
