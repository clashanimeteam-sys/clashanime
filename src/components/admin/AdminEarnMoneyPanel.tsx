"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { notifyAdminReviewCountsChanged } from "@/lib/adminReviewCounts";
import type { EarnMoneySubmissionStatus, EarnMoneyTaskType } from "@/lib/earnMoney";
import { useLocale } from "@/providers/LocaleProvider";

type EarnMoneyRow = {
  id: string;
  user_id: string;
  task_type: EarnMoneyTaskType;
  content_url: string;
  notes: string | null;
  locale: string;
  status: EarnMoneySubmissionStatus;
  reward_cents: number;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  username: string | null;
  display_name: string | null;
};

export function AdminEarnMoneyPanel() {
  const { t, formatDateTime } = useLocale();
  const [submissions, setSubmissions] = useState<EarnMoneyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<EarnMoneySubmissionStatus | "all">("pending");
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const query = statusFilter === "all" ? "" : `?status=${statusFilter}`;
    const response = await fetch(`/api/admin/earn-money${query}`, { cache: "no-store" });
    const payload = (await response.json()) as { submissions?: EarnMoneyRow[]; error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Failed to load");
      setLoading(false);
      return;
    }

    const rows = payload.submissions ?? [];
    setSubmissions(rows);
    setDraftNotes(Object.fromEntries(rows.map((row) => [row.id, row.admin_note ?? ""])));
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  async function reviewSubmission(id: string, action: "approve" | "reject") {
    setReviewingId(id);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/earn-money", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: id,
        action,
        adminNote: draftNotes[id] || null,
      }),
    });

    const payload = (await response.json()) as { error?: string };
    setReviewingId(null);

    if (!response.ok) {
      setError(payload.error ?? "Review failed");
      return;
    }

    setMessage(action === "approve" ? t.admin.earnMoneyApproved : t.admin.earnMoneyRejected);
    notifyAdminReviewCountsChanged();
    await loadSubmissions();
  }

  function taskLabel(task: EarnMoneyTaskType) {
    return t.admin.earnMoneyTasks[task];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.earnMoneyTitle}</h1>
        <p className="mt-1 text-sm text-zinc-400">{t.admin.earnMoneySubtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              statusFilter === status
                ? "bg-accent text-white"
                : "border border-zinc-700 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {status === "all" ? t.admin.allStatuses : t.admin.earnMoneyStatuses[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((row) => (
            <article key={row.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white">{taskLabel(row.task_type)}</p>
                  <p className="mt-1 text-xs text-zinc-500">{formatDateTime(row.created_at)}</p>
                  {row.username ? (
                    <Link href={`/channel/${row.username}`} className="mt-1 inline-block text-xs font-semibold text-accent hover:underline">
                      @{row.username}
                      {row.display_name ? ` (${row.display_name})` : ""}
                    </Link>
                  ) : null}
                </div>
                <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold text-amber-200">
                  ${(row.reward_cents / 100).toFixed(2)}
                </span>
              </div>

              <a
                href={row.content_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block break-all text-sm text-sky-300 hover:underline"
              >
                {row.content_url}
              </a>

              {row.notes ? (
                <p className="mt-3 rounded-xl border border-zinc-800 bg-black/40 p-3 text-sm text-zinc-300">{row.notes}</p>
              ) : null}

              {row.status === "pending" ? (
                <>
                  <textarea
                    value={draftNotes[row.id] ?? ""}
                    onChange={(event) =>
                      setDraftNotes((current) => ({ ...current, [row.id]: event.target.value }))
                    }
                    rows={2}
                    placeholder={t.admin.earnMoneyNotePlaceholder}
                    className="mt-3 w-full rounded-xl border border-zinc-700 bg-black px-3 py-2 text-sm text-white"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={reviewingId === row.id}
                      onClick={() => reviewSubmission(row.id, "approve")}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                    >
                      {reviewingId === row.id ? t.wallet.processing : t.admin.approveEarnMoney}
                    </button>
                    <button
                      type="button"
                      disabled={reviewingId === row.id}
                      onClick={() => reviewSubmission(row.id, "reject")}
                      className="rounded-lg border border-red-800 px-3 py-1.5 text-xs font-semibold text-red-300 hover:border-red-600 disabled:opacity-60"
                    >
                      {t.admin.rejectEarnMoney}
                    </button>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-xs font-semibold text-zinc-400">
                  {t.admin.earnMoneyStatuses[row.status]}
                  {row.admin_note ? ` — ${row.admin_note}` : ""}
                </p>
              )}
            </article>
          ))}

          {submissions.length === 0 ? (
            <p className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">{t.admin.noEarnMoneySubmissions}</p>
          ) : null}
        </div>
      )}

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
