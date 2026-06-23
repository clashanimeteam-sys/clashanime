"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { submitContentReport } from "@/lib/contentReports";
import { getSignupUrl } from "@/lib/subscriptionGate";
import {
  isValidHttpUrl,
  parseVideoId,
  requiresOriginalSource,
  type ReportReason,
} from "@/lib/reportReasons";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type ReportContentFormProps = {
  initialVideoId?: string;
  initialDetails?: string;
  lockVideoId?: boolean;
  onSuccess?: () => void;
};

export function ReportContentForm({
  initialVideoId = "",
  initialDetails = "",
  lockVideoId = false,
  onSuccess,
}: ReportContentFormProps) {
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [videoId, setVideoId] = useState(initialVideoId);
  const [reason, setReason] = useState<ReportReason>("reupload");
  const [originalSourceUrl, setOriginalSourceUrl] = useState("");
  const [details, setDetails] = useState(initialDetails);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const needsOriginalLink = requiresOriginalSource(reason);

  useEffect(() => {
    if (initialDetails) {
      setDetails(initialDetails);
    }
  }, [initialDetails]);

  useEffect(() => {
    if (initialVideoId) {
      setVideoId(initialVideoId);
    }
  }, [initialVideoId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !supabase) {
      setError(t.legal.reportLoginRequired);
      return;
    }

    const trimmedId = parseVideoId(videoId);
    if (!trimmedId) {
      setError(t.legal.reportVideoRequired);
      return;
    }

    if (needsOriginalLink) {
      if (!originalSourceUrl.trim()) {
        setError(t.legal.reportOriginalLinkRequired);
        return;
      }

      if (!isValidHttpUrl(originalSourceUrl)) {
        setError(t.legal.reportOriginalLinkInvalid);
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    const ok = await submitContentReport(supabase, {
      videoId: trimmedId,
      reporterId: user.id,
      reason,
      originalSourceUrl: needsOriginalLink ? originalSourceUrl.trim() : null,
      details: details.trim() || null,
    });

    setSubmitting(false);

    if (ok) {
      setMessage(t.legal.reportSubmitted);
      if (!lockVideoId) {
        setVideoId("");
      }
      setOriginalSourceUrl("");
      setDetails("");
      onSuccess?.();
      return;
    }

    setError(t.legal.reportFailed);
  }

  if (!user) {
    const nextPath = lockVideoId && videoId ? `/report?video=${encodeURIComponent(videoId)}` : "/report";

    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        <Link href={getSignupUrl(nextPath)} className="font-semibold text-accent hover:underline">
          {t.auth.signUp}
        </Link>{" "}
        {t.legal.reportSignupHint}
      </p>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="report-video-id" className="block text-sm font-semibold text-black dark:text-white">
            {t.legal.reportVideoId}
          </label>
          <input
            id="report-video-id"
            value={videoId}
            onChange={(event) => setVideoId(event.target.value)}
            readOnly={lockVideoId}
            placeholder={t.legal.reportVideoIdHint}
            className={`mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white ${
              lockVideoId ? "cursor-default opacity-80" : ""
            }`}
          />
        </div>

        <div>
          <label htmlFor="report-reason" className="block text-sm font-semibold text-black dark:text-white">
            {t.legal.reportReasonLabel}
          </label>
          <select
            id="report-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value as ReportReason)}
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
          >
            <option value="copyright">{t.legal.reportReasonCopyright}</option>
            <option value="reupload">{t.legal.reportReasonReupload}</option>
            <option value="spam">{t.legal.reportReasonSpam}</option>
            <option value="other">{t.legal.reportReasonOther}</option>
          </select>
        </div>

        {needsOriginalLink ? (
          <div>
            <label
              htmlFor="report-original-link"
              className="block text-sm font-semibold text-black dark:text-white"
            >
              {t.legal.reportOriginalLinkLabel}
            </label>
            <input
              id="report-original-link"
              type="url"
              value={originalSourceUrl}
              onChange={(event) => setOriginalSourceUrl(event.target.value)}
              placeholder={t.legal.reportOriginalLinkHint}
              required
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
            />
            <p className="mt-2 text-xs text-zinc-500">{t.legal.reportOriginalLinkHelp}</p>
          </div>
        ) : null}

        <div>
          <label htmlFor="report-details" className="block text-sm font-semibold text-black dark:text-white">
            {needsOriginalLink ? t.legal.reportDetailsOptionalLabel : t.legal.reportDetailsLabel}
          </label>
          <textarea
            id="report-details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            rows={4}
            placeholder={t.legal.reportDetailsHint}
            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? t.legal.reportSubmitting : t.legal.reportSubmit}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</p> : null}
      {error ? (
        <p className="mt-4 text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
