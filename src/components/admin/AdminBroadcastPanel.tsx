"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_SEASON_BROADCAST } from "@/lib/email/broadcastEmail";
import { getPublicSiteUrl } from "@/lib/email/emailLayout";
import { useLocale } from "@/providers/LocaleProvider";

type BroadcastUser = {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  created_at: string;
};

type CampaignRow = {
  id: string;
  subject: string;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  status: string;
  created_at: string;
  completed_at: string | null;
};

export function AdminBroadcastPanel() {
  const { t } = useLocale();
  const [users, setUsers] = useState<BroadcastUser[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const [subject, setSubject] = useState(DEFAULT_SEASON_BROADCAST.subject);
  const [message, setMessage] = useState(DEFAULT_SEASON_BROADCAST.body);
  const [ctaLabel, setCtaLabel] = useState(DEFAULT_SEASON_BROADCAST.ctaLabel);
  const [ctaUrl, setCtaUrl] = useState(getPublicSiteUrl());

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [usersResponse, campaignsResponse] = await Promise.all([
      fetch("/api/admin/broadcast/users"),
      fetch("/api/admin/broadcast/history"),
    ]);

    const usersPayload = (await usersResponse.json()) as {
      users?: BroadcastUser[];
      error?: string;
    };

    if (!usersResponse.ok) {
      setError(usersPayload.error ?? t.admin.broadcastLoadFailed);
      setLoading(false);
      return;
    }

    setUsers(usersPayload.users ?? []);

    if (campaignsResponse.ok) {
      const campaignsPayload = (await campaignsResponse.json()) as { campaigns?: CampaignRow[] };
      setCampaigns(campaignsPayload.campaigns ?? []);
    }

    setLoading(false);
  }, [t.admin.broadcastLoadFailed]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const canSend = useMemo(
    () =>
      !sending &&
      confirmChecked &&
      subject.trim().length >= 5 &&
      message.trim().length >= 20 &&
      users.length > 0,
    [confirmChecked, message, sending, subject, users.length],
  );

  async function handleSend() {
    if (!canSend) return;

    const confirmed = window.confirm(
      t.admin.broadcastConfirm.replace("{count}", String(users.length)),
    );
    if (!confirmed) return;

    setSending(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/broadcast/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          ctaLabel: ctaLabel.trim() || null,
          ctaUrl: ctaUrl.trim() || getPublicSiteUrl(),
          confirm: true,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        sentCount?: number;
        failedCount?: number;
        recipientCount?: number;
      };

      if (!response.ok) {
        setError(payload.error ?? t.admin.broadcastSendFailed);
        setSending(false);
        return;
      }

      setResult(
        t.admin.broadcastSendSuccess
          .replace("{sent}", String(payload.sentCount ?? 0))
          .replace("{total}", String(payload.recipientCount ?? 0))
          .replace("{failed}", String(payload.failedCount ?? 0)),
      );
      setConfirmChecked(false);
      await loadData();
    } catch {
      setError(t.admin.broadcastSendFailed);
    }

    setSending(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.broadcastTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.broadcastSubtitle}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="space-y-4 rounded-xl border border-zinc-800 bg-black/40 p-5">
          <h2 className="text-lg font-semibold text-white">{t.admin.broadcastComposeTitle}</h2>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-300">
              {t.admin.broadcastSubjectLabel}
            </span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-300">
              {t.admin.broadcastMessageLabel}
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={16}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
            />
            <p className="mt-2 text-xs text-zinc-500">{t.admin.broadcastPersonalizeHint}</p>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-300">
                {t.admin.broadcastCtaLabel}
              </span>
              <input
                value={ctaLabel}
                onChange={(event) => setCtaLabel(event.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-zinc-300">
                {t.admin.broadcastCtaUrlLabel}
              </span>
              <input
                value={ctaUrl}
                onChange={(event) => setCtaUrl(event.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              />
            </label>
          </div>

          <label className="flex items-start gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(event) => setConfirmChecked(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-600"
            />
            <span>{t.admin.broadcastConfirmCheckbox}</span>
          </label>

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? t.admin.broadcastSending : t.admin.broadcastSendButton}
          </button>

          {result ? <p className="text-sm text-emerald-400">{result}</p> : null}
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </section>

        <section className="rounded-xl border border-zinc-800 bg-black/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">{t.admin.broadcastUsersTitle}</h2>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
              {users.length}
            </span>
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-zinc-400">{t.admin.loading}</p>
          ) : users.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-400">{t.admin.broadcastNoUsers}</p>
          ) : (
            <div className="mt-4 max-h-[640px] overflow-y-auto rounded-lg border border-zinc-800">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-zinc-900 text-zinc-400">
                  <tr>
                    <th className="px-3 py-2 text-start font-medium">{t.admin.broadcastUsersTable.email}</th>
                    <th className="px-3 py-2 text-start font-medium">{t.admin.broadcastUsersTable.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {users.map((row) => (
                    <tr key={row.id}>
                      <td className="px-3 py-2 text-zinc-300">{row.email}</td>
                      <td className="px-3 py-2 text-zinc-400">
                        {row.display_name ?? (row.username ? `@${row.username}` : "—")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-zinc-800 bg-black/40 p-5">
        <h2 className="text-lg font-semibold text-white">{t.admin.broadcastHistoryTitle}</h2>
        {campaigns.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">{t.admin.broadcastNoHistory}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-800">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 text-start font-medium">{t.admin.broadcastHistoryTable.when}</th>
                  <th className="px-4 py-3 text-start font-medium">{t.admin.broadcastHistoryTable.subject}</th>
                  <th className="px-4 py-3 text-start font-medium">{t.admin.broadcastHistoryTable.sent}</th>
                  <th className="px-4 py-3 text-start font-medium">{t.admin.broadcastHistoryTable.failed}</th>
                  <th className="px-4 py-3 text-start font-medium">{t.admin.broadcastHistoryTable.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {campaigns.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 text-zinc-300">
                      {new Date(row.completed_at ?? row.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{row.subject}</td>
                    <td className="px-4 py-3 text-zinc-300">
                      {row.sent_count}/{row.recipient_count}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{row.failed_count}</td>
                    <td className="px-4 py-3 text-zinc-300">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
