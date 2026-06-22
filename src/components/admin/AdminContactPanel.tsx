"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { ContactMessageStatus } from "@/lib/contactMessages";
import { useLocale } from "@/providers/LocaleProvider";

type ContactRow = {
  id: string;
  user_id: string | null;
  email: string;
  whatsapp: string | null;
  message: string;
  locale: string;
  status: ContactMessageStatus;
  admin_reply: string | null;
  created_at: string;
  username?: string | null;
};

export function AdminContactPanel() {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [messages, setMessages] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | "all">("open");
  const [draftReplies, setDraftReplies] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    let query = supabase
      .from("contact_messages")
      .select("id, user_id, email, whatsapp, message, locale, status, admin_reply, created_at")
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
    const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))] as string[];

    const { data: profiles } = userIds.length
      ? await supabase.from("profiles").select("id, username").in("id", userIds)
      : { data: [] };

    const usernameMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]));

    setMessages(
      rows.map((row) => ({
        ...row,
        username: row.user_id ? (usernameMap.get(row.user_id) ?? null) : null,
      })),
    );
    setDraftReplies(
      Object.fromEntries(rows.map((row) => [row.id, row.admin_reply ?? ""])),
    );
    setLoading(false);
  }, [supabase, statusFilter]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  async function updateMessage(
    id: string,
    status: ContactMessageStatus,
    adminReply?: string,
  ) {
    if (!supabase) return;

    setMessage(null);
    setError(null);

    const { data: authData } = await supabase.auth.getUser();

    const { error: updateError } = await supabase
      .from("contact_messages")
      .update({
        status,
        admin_reply: adminReply ?? draftReplies[id] ?? null,
        handled_by: authData.user?.id ?? null,
        handled_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(t.admin.saved);
    await loadMessages();
  }

  async function sendReplyEmail(id: string) {
    const reply = draftReplies[id]?.trim() ?? "";
    if (reply.length < 5) {
      setError(t.admin.contactReplyPlaceholder);
      return;
    }

    setSendingId(id);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/contact/send-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: id, reply }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error || t.admin.contactReplyFailed);
        return;
      }

      setMessage(t.admin.contactReplySent);
      await loadMessages();
    } catch {
      setError(t.admin.contactReplyFailed);
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.contactTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.contactSubtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["open", "replied", "closed", "all"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === status
                ? "bg-accent text-white"
                : "border border-zinc-700 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {status === "all" ? t.admin.allStatuses : t.admin.contactStatuses[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="space-y-4">
          {messages.map((row) => (
            <article key={row.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-white">{row.email}</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(row.created_at).toLocaleString()} · {row.locale}
                    {row.username ? ` · @${row.username}` : ""}
                  </p>
                  {row.whatsapp ? (
                    <p className="mt-1 text-sm text-zinc-400">
                      WhatsApp:{" "}
                      <a href={`https://wa.me/${row.whatsapp.replace(/\D/g, "")}`} className="text-accent hover:underline" target="_blank" rel="noreferrer">
                        {row.whatsapp}
                      </a>
                    </p>
                  ) : null}
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                    {row.message}
                  </p>
                </div>
                <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] font-semibold uppercase text-zinc-300">
                  {t.admin.contactStatuses[row.status]}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-xs font-medium text-zinc-400">{t.admin.contactReply}</label>
                <textarea
                  rows={3}
                  value={draftReplies[row.id] ?? ""}
                  onChange={(event) =>
                    setDraftReplies((current) => ({ ...current, [row.id]: event.target.value }))
                  }
                  placeholder={t.admin.contactReplyPlaceholder}
                  className="w-full rounded-xl border border-zinc-700 bg-black px-3 py-2 text-sm text-zinc-200 outline-none focus:border-accent"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:${row.email}`}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                >
                  {t.footer.contact}
                </a>
                <button
                  type="button"
                  onClick={() => updateMessage(row.id, row.status, draftReplies[row.id])}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                >
                  {t.admin.saveContactReply}
                </button>
                <button
                  type="button"
                  onClick={() => sendReplyEmail(row.id)}
                  disabled={sendingId === row.id}
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {sendingId === row.id ? t.admin.sendingContactReply : t.admin.sendContactReplyEmail}
                </button>
                <button
                  type="button"
                  onClick={() => updateMessage(row.id, "replied", draftReplies[row.id])}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  {t.admin.markContactReplied}
                </button>
                <button
                  type="button"
                  onClick={() => updateMessage(row.id, "closed", draftReplies[row.id])}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                >
                  {t.admin.markContactClosed}
                </button>
              </div>
            </article>
          ))}

          {messages.length === 0 && (
            <p className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
              {t.admin.noContactMessages}
            </p>
          )}
        </div>
      )}

      {message && <p className="text-sm text-emerald-400">{message}</p>}
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
