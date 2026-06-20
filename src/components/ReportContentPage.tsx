"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { submitContentReport } from "@/lib/contentReports";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

export function ReportContentPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [videoId, setVideoId] = useState("");
  const [reason, setReason] = useState("copyright");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !supabase) {
      setError(t.legal.reportLoginRequired);
      return;
    }

    const trimmedId = videoId.trim();
    if (!trimmedId) {
      setError(t.legal.reportVideoRequired);
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    const reportReason = details.trim()
      ? `${reason}: ${details.trim()}`
      : reason;

    const ok = await submitContentReport(supabase, trimmedId, user.id, reportReason);

    setSubmitting(false);

    if (ok) {
      setMessage(t.legal.reportSubmitted);
      setVideoId("");
      setDetails("");
      return;
    }

    setError(t.legal.reportFailed);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">{t.legal.reportTitle}</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t.legal.reportIntro}
      </p>

      {!user ? (
        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/login?next=/report" className="font-semibold text-accent hover:underline">
            {t.auth.logIn}
          </Link>{" "}
          {t.legal.reportLoginHint}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="video-id" className="block text-sm font-semibold text-black dark:text-white">
              {t.legal.reportVideoId}
            </label>
            <input
              id="video-id"
              value={videoId}
              onChange={(event) => setVideoId(event.target.value)}
              placeholder={t.legal.reportVideoIdHint}
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-semibold text-black dark:text-white">
              {t.legal.reportReasonLabel}
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white"
            >
              <option value="copyright">{t.legal.reportReasonCopyright}</option>
              <option value="reupload">{t.legal.reportReasonReupload}</option>
              <option value="spam">{t.legal.reportReasonSpam}</option>
              <option value="other">{t.legal.reportReasonOther}</option>
            </select>
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-semibold text-black dark:text-white">
              {t.legal.reportDetailsLabel}
            </label>
            <textarea
              id="details"
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
      )}

      {message ? <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</p> : null}
      {error ? (
        <p className="mt-4 text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      <p className="mt-8 text-xs text-zinc-500">{t.legal.reportDmcaHint}</p>
    </div>
  );
}
