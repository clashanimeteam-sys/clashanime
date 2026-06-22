"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ACCOUNT_DELETE_CONFIRM_WORD } from "@/lib/email/accountDeletedEmail";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

export function DeleteAccountSection() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { t, locale } = useLocale();
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expectedWord = ACCOUNT_DELETE_CONFIRM_WORD[locale];
  const canDelete = confirmChecked && confirmText.trim() === expectedWord && !deleting;

  const hint = useMemo(
    () => t.profile.deleteAccountTypeWord.replace("{word}", expectedWord),
    [expectedWord, t.profile.deleteAccountTypeWord],
  );

  async function handleDelete() {
    if (!canDelete) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmChecked: true,
          confirmText: confirmText.trim(),
          locale,
        }),
      });

      const payload = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok) {
        if (payload.error === "confirmation_word_mismatch") {
          setError(t.profile.deleteAccountWordMismatch);
        } else if (payload.error === "confirmation_required") {
          setError(t.profile.deleteAccountConfirmRequired);
        } else {
          setError(payload.error ?? t.profile.deleteAccountFailed);
        }
        setDeleting(false);
        return;
      }

      await signOut();
      router.replace("/?account_deleted=1");
    } catch {
      setError(t.profile.deleteAccountFailed);
      setDeleting(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/60 p-5 dark:border-red-900/50 dark:bg-red-950/20">
      <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
        {t.profile.deleteAccountTitle}
      </h2>
      <p className="mt-2 text-sm text-red-700/90 dark:text-red-200/90">
        {t.profile.deleteAccountWarning}
      </p>

      <label className="mt-4 flex items-start gap-3 text-sm text-red-800 dark:text-red-100">
        <input
          type="checkbox"
          checked={confirmChecked}
          onChange={(event) => {
            setConfirmChecked(event.target.checked);
            setError(null);
          }}
          className="mt-1 h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
        />
        <span>{t.profile.deleteAccountCheckbox}</span>
      </label>

      <label className="mt-4 block">
        <span className="mb-1 block text-sm font-medium text-red-800 dark:text-red-100">
          {hint}
        </span>
        <input
          value={confirmText}
          onChange={(event) => {
            setConfirmText(event.target.value);
            setError(null);
          }}
          placeholder={expectedWord}
          className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-black outline-none focus:border-red-400 dark:border-red-900 dark:bg-black dark:text-white"
          autoComplete="off"
          spellCheck={false}
        />
      </label>

      {error ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleDelete}
        disabled={!canDelete}
        className="mt-4 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? t.profile.deleteAccountDeleting : t.profile.deleteAccountButton}
      </button>
    </div>
  );
}
