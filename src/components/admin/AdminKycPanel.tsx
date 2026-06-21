"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type KycSubmission = {
  id: string;
  user_id: string;
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
  username?: string | null;
};

const STATUS_FILTERS = ["all", "pending", "approved", "rejected"] as const;

export function AdminKycPanel() {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [submissions, setSubmissions] = useState<KycSubmission[]>([]);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("pending");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    let query = supabase
      .from("payout_kyc_submissions")
      .select(
        "id, user_id, first_name, last_name, country_code, country_name, phone, address, id_document_url, status, admin_notes, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    const userIds = [...new Set(rows.map((row) => row.user_id))];
    let profileMap = new Map<string, string>();

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);
      profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]));
    }

    setSubmissions(
      rows.map((row) => ({
        ...row,
        username: profileMap.get(row.user_id) ?? null,
      })) as KycSubmission[],
    );
    setLoading(false);
  }, [supabase, statusFilter]);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  async function resolveSubmission(submissionId: string, status: "approved" | "rejected", notes?: string) {
    if (!supabase) return;

    setMessage(null);
    setError(null);

    const { error: rpcError } = await supabase.rpc("resolve_payout_kyc", {
      p_submission_id: submissionId,
      p_status: status,
      p_admin_notes: notes ?? null,
    });

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    setMessage(t.admin.saved);
    await loadSubmissions();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.kycTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.kycSubtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
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
            {status === "all" ? t.admin.allStatuses : t.admin.kycStatuses[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : submissions.length === 0 ? (
        <p className="text-sm text-zinc-400">{t.admin.noKycSubmissions}</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <article
              key={submission.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    @{submission.username ?? submission.user_id.slice(0, 8)}
                  </p>
                  {(submission.first_name || submission.last_name) && (
                    <p className="mt-1 text-sm text-zinc-200">
                      {[submission.first_name, submission.last_name].filter(Boolean).join(" ")}
                    </p>
                  )}
                  <span className="mt-2 inline-flex rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-200">
                    {t.admin.kycStatuses[submission.status]}
                  </span>
                  {submission.country_name ? (
                    <p className="mt-3 text-xs text-zinc-300">
                      {t.wallet.kycCountryLabel}: {submission.country_name}
                      {submission.country_code ? ` (${submission.country_code})` : ""}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-zinc-300">
                    {t.wallet.kycPhoneLabel}: {submission.phone}
                  </p>
                  <p className="mt-1 text-xs text-zinc-300">
                    {t.wallet.kycAddressLabel}: {submission.address}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(submission.created_at).toLocaleString()}
                  </p>
                  {submission.admin_notes ? (
                    <p className="mt-2 text-xs text-amber-300">{submission.admin_notes}</p>
                  ) : null}
                </div>

                <a
                  href={submission.id_document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-xl border border-zinc-700"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={submission.id_document_url}
                    alt={t.wallet.kycIdLabel}
                    className="h-36 w-56 object-cover"
                  />
                </a>
              </div>

              {submission.status === "pending" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => resolveSubmission(submission.id, "approved")}
                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    {t.admin.approveKyc}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const notes = window.prompt(t.admin.kycRejectNotesPrompt);
                      if (notes === null) return;
                      void resolveSubmission(submission.id, "rejected", notes);
                    }}
                    className="rounded-full bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    {t.admin.rejectKyc}
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
