"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CountryPhoneField } from "@/components/wallet/CountryPhoneField";
import {
  buildFullPhoneNumber,
  DEFAULT_KYC_COUNTRY,
  getKycCountryByCode,
  getKycCountryLabel,
} from "@/lib/kycCountries";
import { uploadMediaFile } from "@/lib/mediaUpload";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

export type PayoutKycStatus = "none" | "pending" | "approved" | "rejected";

export type PayoutKycSubmission = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  country_code: string | null;
  country_name: string | null;
  phone: string;
  address: string;
  id_document_url: string;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

type ClashWalletKycSectionProps = {
  userId: string;
  embedded?: boolean;
  onStatusChange?: (status: PayoutKycStatus) => void;
};

const MAX_ID_IMAGE_BYTES = 10 * 1024 * 1024;

export function ClashWalletKycSection({
  userId,
  embedded = false,
  onStatusChange,
}: ClashWalletKycSectionProps) {
  const { t, locale } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [submission, setSubmission] = useState<PayoutKycSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState(DEFAULT_KYC_COUNTRY.code);
  const [localPhone, setLocalPhone] = useState("");
  const [address, setAddress] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const status: PayoutKycStatus = submission
    ? submission.status === "approved"
      ? "approved"
      : submission.status === "rejected"
        ? "rejected"
        : "pending"
    : "none";

  const containerClassName = embedded
    ? "rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 p-5 dark:border-amber-900/40 dark:from-amber-950/20 dark:via-zinc-950 dark:to-orange-950/10"
    : "rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/50";

  const loadSubmission = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    const { data } = await supabase
      .from("payout_kyc_submissions")
      .select(
        "id, first_name, last_name, country_code, country_name, phone, address, id_document_url, status, admin_notes, created_at, updated_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setSubmission((data as PayoutKycSubmission | null) ?? null);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    void loadSubmission();
  }, [loadSubmission]);

  useEffect(() => {
    onStatusChange?.(status);
  }, [onStatusChange, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const country = getKycCountryByCode(countryCode) ?? DEFAULT_KYC_COUNTRY;
    const fullPhone = buildFullPhoneNumber(country, localPhone);

    if (!idFile) {
      setError(t.wallet.kycIdRequired);
      setSubmitting(false);
      return;
    }

    if (!idFile.type.startsWith("image/")) {
      setError(t.wallet.kycInvalidImage);
      setSubmitting(false);
      return;
    }

    if (idFile.size > MAX_ID_IMAGE_BYTES) {
      setError(t.wallet.kycImageTooLarge);
      setSubmitting(false);
      return;
    }

    try {
      const extension = idFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const uploaded = await uploadMediaFile({
        folder: "kyc",
        filename: `id-${Date.now()}.${extension}`,
        file: idFile,
      });

      const { error: rpcError } = await supabase!.rpc("submit_payout_kyc", {
        p_first_name: firstName.trim(),
        p_last_name: lastName.trim(),
        p_country_code: country.code,
        p_country_name: getKycCountryLabel(country, locale),
        p_phone: fullPhone,
        p_address: address.trim(),
        p_id_document_url: uploaded.publicUrl,
      });

      if (rpcError) {
        setError(rpcError.message);
        setSubmitting(false);
        return;
      }

      setMessage(t.wallet.kycSubmitSuccess);
      setFirstName("");
      setLastName("");
      setCountryCode(DEFAULT_KYC_COUNTRY.code);
      setLocalPhone("");
      setAddress("");
      setIdFile(null);
      await loadSubmission();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : t.wallet.kycSubmitFailed);
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className={containerClassName}>
        <p className="text-sm text-zinc-500">{t.wallet.kycLoading}</p>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{t.wallet.kycApprovedTitle}</p>
        <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">{t.wallet.kycApprovedDesc}</p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">{t.wallet.kycPendingTitle}</p>
        <p className="mt-2 text-sm text-amber-800 dark:text-amber-400">{t.wallet.kycPendingDesc}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={containerClassName}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-lg">
          🪪
        </div>
        <div>
          <p className="text-lg font-semibold text-black dark:text-white">{t.wallet.kycTitle}</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.wallet.kycDesc}</p>
        </div>
      </div>

      {status === "rejected" ? (
        <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {submission?.admin_notes
            ? `${t.wallet.kycRejectedTitle}: ${submission.admin_notes}`
            : t.wallet.kycRejectedDesc}
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t.wallet.kycFirstNameLabel}
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder={t.wallet.kycFirstNamePlaceholder}
            className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t.wallet.kycLastNameLabel}
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder={t.wallet.kycLastNamePlaceholder}
            className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
      </div>

      <div className="mt-4">
        <CountryPhoneField
          countryCode={countryCode}
          localPhone={localPhone}
          onCountryChange={setCountryCode}
          onLocalPhoneChange={setLocalPhone}
          countryLabel={t.wallet.kycCountryLabel}
          phoneLabel={t.wallet.kycPhoneLabel}
          phonePlaceholder={t.wallet.kycPhoneLocalPlaceholder}
        />
      </div>

      <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {t.wallet.kycAddressLabel}
        <textarea
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder={t.wallet.kycAddressPlaceholder}
          rows={3}
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {t.wallet.kycIdLabel}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setIdFile(event.target.files?.[0] ?? null)}
          className="mt-2 block w-full text-sm text-zinc-600 file:me-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-700 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-200"
        />
      </label>
      <p className="mt-2 text-xs text-zinc-500">{t.wallet.kycIdHint}</p>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-full bg-gradient-to-r from-amber-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto"
      >
        {submitting ? t.wallet.processing : t.wallet.kycSubmitButton}
      </button>

      {message ? (
        <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
