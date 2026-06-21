"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { uploadMediaFile } from "@/lib/mediaUpload";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

export type PayoutKycStatus = "none" | "pending" | "approved" | "rejected";

export type PayoutKycSubmission = {
  id: string;
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
  onStatusChange?: (status: PayoutKycStatus) => void;
};

const MAX_ID_IMAGE_BYTES = 10 * 1024 * 1024;

export function ClashWalletKycSection({ userId, onStatusChange }: ClashWalletKycSectionProps) {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [submission, setSubmission] = useState<PayoutKycSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
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

  const loadSubmission = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    const { data } = await supabase
      .from("payout_kyc_submissions")
      .select("id, phone, address, id_document_url, status, admin_notes, created_at, updated_at")
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
        p_phone: phone.trim(),
        p_address: address.trim(),
        p_id_document_url: uploaded.publicUrl,
      });

      if (rpcError) {
        setError(rpcError.message);
        setSubmitting(false);
        return;
      }

      setMessage(t.wallet.kycSubmitSuccess);
      setPhone("");
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
      <div className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
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
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/50"
    >
      <p className="text-lg font-semibold text-black dark:text-white">{t.wallet.kycTitle}</p>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.wallet.kycDesc}</p>

      {status === "rejected" ? (
        <p className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {submission?.admin_notes
            ? `${t.wallet.kycRejectedTitle}: ${submission.admin_notes}`
            : t.wallet.kycRejectedDesc}
        </p>
      ) : null}

      <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {t.wallet.kycPhoneLabel}
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder={t.wallet.kycPhonePlaceholder}
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

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
        className="mt-4 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
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
