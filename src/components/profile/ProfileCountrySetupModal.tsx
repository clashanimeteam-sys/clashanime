"use client";

import { useMemo, useState } from "react";
import { KYC_COUNTRIES, getKycCountryByCode, getKycCountryLabel } from "@/lib/kycCountries";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type ProfileCountrySetupModalProps = {
  open: boolean;
  onComplete: () => void;
};

export function ProfileCountrySetupModal({ open, onComplete }: ProfileCountrySetupModalProps) {
  const { t, locale } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [countryCode, setCountryCode] = useState(KYC_COUNTRIES[0]?.code ?? "SA");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSave() {
    if (!supabase) return;

    const country = getKycCountryByCode(countryCode);
    if (!country) {
      setError(t.profile.profileCountryRequired);
      return;
    }

    setSaving(true);
    setError(null);

    const { error: saveError } = await supabase.rpc("set_profile_country", {
      p_country_code: country.code,
      p_country_name: getKycCountryLabel(country, locale),
    });

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    onComplete();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-country-setup-title"
      >
        <h2 id="profile-country-setup-title" className="text-lg font-semibold text-black dark:text-white">
          {t.profile.completeProfileTitle}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.profile.completeProfileDesc}</p>

        <label className="mt-5 block">
          <span className="mb-1 block text-sm font-medium text-black dark:text-white">
            {t.profile.profileCountry}
          </span>
          <select
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:text-white"
          >
            {KYC_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {getKycCountryLabel(country, locale)}
              </option>
            ))}
          </select>
        </label>

        {error ? (
          <p className="mt-3 text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="mt-5 w-full rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {saving ? t.profile.saving : t.profile.saveChanges}
        </button>
      </div>
    </div>
  );
}
