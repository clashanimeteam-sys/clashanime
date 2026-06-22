"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type EmailRow = {
  id: string;
  user_id: string;
  email_to: string;
  email_type: string;
  locale: string;
  subject: string | null;
  resend_id: string | null;
  status: "pending" | "sent" | "failed";
  error_message: string | null;
  created_at: string;
  sent_at: string | null;
  username?: string | null;
};

export function AdminEmailsPanel() {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [rows, setRows] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | EmailRow["status"]>("all");

  const loadRows = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    let query = supabase
      .from("transactional_emails")
      .select(
        "id, user_id, email_to, email_type, locale, subject, resend_id, status, error_message, created_at, sent_at",
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

    const emailRows = data ?? [];
    const userIds = [...new Set(emailRows.map((row) => row.user_id).filter(Boolean))];

    const { data: profiles } = userIds.length
      ? await supabase.from("profiles").select("id, username").in("id", userIds)
      : { data: [] as Array<{ id: string; username: string }> };

    const usernameById = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]));

    setRows(
      emailRows.map((row) => ({
        ...row,
        username: usernameById.get(row.user_id) ?? null,
      })),
    );
    setLoading(false);
  }, [supabase, statusFilter]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.emailsTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.emailsSubtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "sent", "pending", "failed"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === status
                ? "bg-accent/20 text-accent"
                : "border border-zinc-700 text-zinc-400 hover:text-white"
            }`}
          >
            {status === "all" ? t.admin.emailsFilterAll : t.admin.emailStatuses[status]}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-zinc-400">{t.admin.noEmails}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3 text-start font-medium">{t.admin.emailsTable.when}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.emailsTable.to}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.emailsTable.type}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.emailsTable.locale}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.emailsTable.status}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.emailsTable.user}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {rows.map((row) => (
                <tr key={row.id} className="bg-black/40">
                  <td className="px-4 py-3 text-zinc-300">
                    {new Date(row.sent_at ?? row.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{row.email_to}</td>
                  <td className="px-4 py-3 text-zinc-300">{row.email_type}</td>
                  <td className="px-4 py-3 uppercase text-zinc-400">{row.locale}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.status === "sent"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : row.status === "failed"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {t.admin.emailStatuses[row.status]}
                    </span>
                    {row.error_message ? (
                      <p className="mt-1 text-xs text-red-400">{row.error_message}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {row.username ? `@${row.username}` : row.user_id.slice(0, 8)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
