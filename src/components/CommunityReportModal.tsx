"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ModalPortal } from "@/components/ModalPortal";
import { submitCommunityPostReport } from "@/lib/contentReports";
import type { CommunityReportReason } from "@/lib/reportReasons";
import { createBrowserClient } from "@/lib/supabase/client";
import { useScrollLock } from "@/lib/useScrollLock";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import Link from "next/link";
import { getSignupUrl } from "@/lib/subscriptionGate";

type CommunityReportModalProps = {
  open: boolean;
  onClose: () => void;
  postId: string;
  postPreview?: string;
};

export function CommunityReportModal({
  open,
  onClose,
  postId,
  postPreview,
}: CommunityReportModalProps) {
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [reason, setReason] = useState<CommunityReportReason>("off_topic");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !user) return;

    setSubmitting(true);
    setError(null);
    setMessage(null);

    const ok = await submitCommunityPostReport(supabase, {
      postId,
      reporterId: user.id,
      reason,
      details: details.trim() || null,
    });

    setSubmitting(false);

    if (ok) {
      setMessage(t.communityFeed.reportSubmitted);
      window.setTimeout(onClose, 1200);
      return;
    }

    setError(t.communityFeed.actionFailed);
  }

  if (!open) return null;

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center">
        <button
          type="button"
          aria-label={t.auth.close}
          className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div
          role="dialog"
          aria-modal="true"
          className="relative z-10 m-4 max-h-[min(92dvh,760px)] w-[min(100%,42rem)] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">{t.communityFeed.reportTitle}</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.communityFeed.reportIntro}</p>
              {postPreview ? (
                <p className="mt-2 line-clamp-2 text-xs font-semibold text-zinc-500">{postPreview}</p>
              ) : null}
            </div>
            <button type="button" onClick={onClose} aria-label={t.auth.close} className="rounded-full p-2 text-zinc-500">
              ✕
            </button>
          </div>

          {!user ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <Link href={getSignupUrl("/community")} className="font-semibold text-accent hover:underline">
                {t.auth.signUp}
              </Link>{" "}
              {t.communityFeed.loginToReport}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="community-report-reason" className="block text-sm font-semibold text-black dark:text-white">
                  {t.communityFeed.reportReasonLabel}
                </label>
                <select
                  id="community-report-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value as CommunityReportReason)}
                  className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
                >
                  <option value="off_topic">{t.communityFeed.reportReasonOffTopic}</option>
                  <option value="adult">{t.communityFeed.reportReasonAdult}</option>
                  <option value="spam">{t.communityFeed.reportReasonSpam}</option>
                  <option value="harassment">{t.communityFeed.reportReasonHarassment}</option>
                  <option value="other">{t.communityFeed.reportReasonOther}</option>
                </select>
              </div>

              <div>
                <label htmlFor="community-report-details" className="block text-sm font-semibold text-black dark:text-white">
                  {t.communityFeed.reportDetailsLabel}
                </label>
                <textarea
                  id="community-report-details"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  rows={4}
                  placeholder={t.communityFeed.reportDetailsHint}
                  className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting ? t.communityFeed.reportSubmitting : t.communityFeed.reportSubmit}
              </button>
            </form>
          )}

          {message ? <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</p> : null}
          {error ? (
            <p className="mt-4 text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </ModalPortal>
  );
}
