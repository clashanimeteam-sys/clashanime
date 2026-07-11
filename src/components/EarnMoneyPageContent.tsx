"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getEarnMoneyCopy } from "@/lib/earnMoneyCopy";
import {
  EARN_MONEY_TASK_TYPES,
  type EarnMoneySubmissionStatus,
  type EarnMoneyTaskType,
} from "@/lib/earnMoney";
import { getSignupUrl } from "@/lib/subscriptionGate";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { usePageTitle } from "@/providers/PageTitleProvider";

type SubmissionRow = {
  id: string;
  task_type: EarnMoneyTaskType;
  content_url: string;
  status: EarnMoneySubmissionStatus;
  reward_cents: number;
  created_at: string;
};

const taskIcons: Record<EarnMoneyTaskType, string> = {
  youtube: "▶",
  forum: "💬",
  blog: "✍",
};

function TaskCard({
  task,
  copy,
  rewardLabel,
  selected,
  onSelect,
  labels,
}: {
  task: EarnMoneyTaskType;
  copy: ReturnType<typeof getEarnMoneyCopy>["tasks"][EarnMoneyTaskType];
  rewardLabel: string;
  selected: boolean;
  onSelect: () => void;
  labels: Pick<ReturnType<typeof getEarnMoneyCopy>, "stepsLabel" | "termsLabel" | "selectTask" | "selectedTask">;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-3xl border p-5 transition-all sm:p-6 ${
        selected
          ? "border-accent bg-gradient-to-br from-accent/15 via-orange-500/5 to-transparent shadow-lg shadow-accent/10"
          : "border-zinc-200 bg-white hover:border-accent/40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-accent/30"
      }`}
    >
      <div className="pointer-events-none absolute -end-8 -top-8 h-28 w-28 rounded-full bg-accent/10 blur-2xl" aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-orange-600 text-lg text-white shadow-md shadow-accent/30">
            {taskIcons[task]}
          </span>
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">{copy.title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{copy.subtitle}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          {rewardLabel}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{labels.stepsLabel}</p>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {copy.steps.map((step) => (
              <li key={step} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{labels.termsLabel}</p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {copy.terms.map((term) => (
              <li key={term}>• {term}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
          selected
            ? "bg-accent text-white"
            : "border border-zinc-300 text-zinc-800 hover:border-accent hover:text-accent dark:border-zinc-700 dark:text-zinc-200"
        }`}
      >
        {selected ? `✓ ${labels.selectedTask}` : labels.selectTask}
      </button>
    </article>
  );
}

export function EarnMoneyPageContent() {
  const { locale, t } = useLocale();
  const [rewardUsd, setRewardUsd] = useState(2);
  const copy = useMemo(() => getEarnMoneyCopy(locale, rewardUsd), [locale, rewardUsd]);
  usePageTitle(copy.pageTitle);
  const { user } = useAuth();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [selectedTask, setSelectedTask] = useState<EarnMoneyTaskType>("youtube");
  const [contentUrl, setContentUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    if (!supabase || !user) return;
    void supabase.rpc("complete_watch_onboarding");
  }, [supabase, user]);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/earn-money/settings", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { settings?: { rewardUsd?: number } } | null) => {
        if (!cancelled && payload?.settings?.rewardUsd) {
          setRewardUsd(payload.settings.rewardUsd);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const loadSubmissions = useCallback(async () => {
    if (!supabase || !user) {
      setSubmissions([]);
      return;
    }

    setLoadingSubmissions(true);
    const { data } = await supabase
      .from("earn_money_submissions")
      .select("id, task_type, content_url, status, reward_cents, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    setSubmissions((data as SubmissionRow[] | null) ?? []);
    setLoadingSubmissions(false);
  }, [supabase, user]);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/earn-money/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: selectedTask,
          contentUrl: contentUrl.trim(),
          notes: notes.trim() || null,
          locale,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? copy.submitError);
        return;
      }

      setContentUrl("");
      setNotes("");
      setMessage(copy.submitSuccess);
      await loadSubmissions();
    } catch {
      setError(copy.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  function statusLabel(status: EarnMoneySubmissionStatus, rewardCents?: number) {
    if (status === "approved") {
      return getEarnMoneyCopy(locale, (rewardCents ?? Math.round(rewardUsd * 100)) / 100).statusApproved;
    }
    if (status === "rejected") return copy.statusRejected;
    return copy.statusPending;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 text-white shadow-2xl dark:border-zinc-800 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(227,49,36,0.35),transparent_45%)]" aria-hidden />
        <div className="pointer-events-none absolute -bottom-10 -start-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" aria-hidden />
        <div className="relative">
          <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
            {copy.rewardBadge}
          </span>
          <h1 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl">{copy.heroTitle}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">{copy.heroSubtitle}</p>
          <p className="mt-4 text-sm font-semibold text-amber-200">{copy.rewardPerTask}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/profile#wallet"
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/30 transition hover:opacity-90"
            >
              {copy.walletCta}
            </Link>
            {user ? (
              <Link
                href="/watch"
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {locale === "ar" ? "شاهد الأنمي الآن" : locale === "ja" ? "アニメを視聴" : "Watch anime now"}
              </Link>
            ) : null}
            <Link
              href="/profile#referral"
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t.nav.inviteFriends}
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <h2 className="text-lg font-bold text-black dark:text-white">{copy.howItWorksTitle}</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {copy.howItWorksSteps.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">{copy.referralNote}</p>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold text-black dark:text-white">{copy.pageTitle}</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {EARN_MONEY_TASK_TYPES.map((task) => (
            <TaskCard
              key={task}
              task={task}
              copy={copy.tasks[task]}
              rewardLabel={copy.rewardBadge}
              selected={selectedTask === task}
              onSelect={() => setSelectedTask(task)}
              labels={copy}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-300/40 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">{copy.warningTitle}</h3>
        <p className="mt-1 text-sm text-amber-800 dark:text-amber-100/90">{copy.warningBody}</p>
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <h2 className="text-lg font-bold text-black dark:text-white">{copy.submitTitle}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{copy.submitSubtitle}</p>

        {!user ? (
          <p className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-black dark:text-zinc-300">
            {copy.loginRequired}{" "}
            <Link href={getSignupUrl("/earn")} className="font-semibold text-accent hover:underline">
              {copy.loginCta}
            </Link>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{copy.taskLabel}</label>
              <select
                value={selectedTask}
                onChange={(event) => setSelectedTask(event.target.value as EarnMoneyTaskType)}
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-black dark:text-white"
              >
                {EARN_MONEY_TASK_TYPES.map((task) => (
                  <option key={task} value={task}>
                    {copy.tasks[task].title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{copy.urlLabel}</label>
              <input
                type="url"
                required
                value={contentUrl}
                onChange={(event) => setContentUrl(event.target.value)}
                placeholder={copy.urlPlaceholder}
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-black dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{copy.notesLabel}</label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder={copy.notesPlaceholder}
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-black dark:text-white"
              />
            </div>
            {message ? <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p> : null}
            {error ? (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {submitting ? copy.submitting : copy.submitButton}
            </button>
          </form>
        )}

        {user ? (
          <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-500">{copy.yourSubmissions}</h3>
            {loadingSubmissions ? (
              <p className="mt-3 text-sm text-zinc-500">...</p>
            ) : submissions.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">—</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {submissions.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm dark:border-zinc-800"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-black dark:text-white">{copy.tasks[row.task_type].title}</p>
                      <a
                        href={row.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-xs text-accent hover:underline"
                      >
                        {row.content_url}
                      </a>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        row.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : row.status === "rejected"
                            ? "bg-red-500/15 text-red-600 dark:text-red-300"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {statusLabel(row.status, row.reward_cents)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
