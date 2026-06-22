"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { formatNotificationText } from "@/lib/notifications/formatNotification";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
  metadata?: Record<string, unknown> | null;
};

export function NotificationBell() {
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const unreadCount = rows.filter((row) => !row.read_at).length;

  const loadNotifications = useCallback(async () => {
    if (!supabase || !user) return;

    setLoading(true);

    const prefsPromise = supabase
      .from("user_notification_preferences")
      .select("in_app_enabled")
      .eq("user_id", user.id)
      .maybeSingle();

    const [prefsResult, primaryResult] = await Promise.all([
      prefsPromise,
      supabase
        .from("user_notifications")
        .select("id, type, title, body, link, read_at, created_at, metadata")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    let nextRows: NotificationRow[] = [];

    if (!primaryResult.error && primaryResult.data) {
      nextRows = primaryResult.data as NotificationRow[];
    } else if (
      primaryResult.error &&
      /metadata|column|schema cache/i.test(primaryResult.error.message)
    ) {
      const fallbackResult = await supabase
        .from("user_notifications")
        .select("id, type, title, body, link, read_at, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!fallbackResult.error) {
        nextRows = (fallbackResult.data ?? []).map((row) => ({
          ...row,
          metadata: null,
        }));
      }
    }

    setRows(nextRows);

    if (!prefsResult.error) {
      setEnabled(prefsResult.data?.in_app_enabled ?? true);
    }

    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!user) return;
    void loadNotifications();
    const timer = window.setInterval(() => {
      void loadNotifications();
    }, 60000);
    return () => window.clearInterval(timer);
  }, [user, loadNotifications]);

  useEffect(() => {
    if (!supabase || !user) return;

    const channel = supabase
      .channel(`user-notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const next = payload.new as NotificationRow;
          setRows((current) => {
            if (current.some((row) => row.id === next.id)) return current;
            return [next, ...current].slice(0, 50);
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const next = payload.new as NotificationRow;
          setRows((current) => current.map((row) => (row.id === next.id ? next : row)));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, user]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  async function toggleEnabled(nextEnabled: boolean) {
    if (!supabase || !user) return;

    setEnabled(nextEnabled);

    await supabase.from("user_notification_preferences").upsert(
      {
        user_id: user.id,
        in_app_enabled: nextEnabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (nextEnabled && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }
  }

  async function markRead(id: string) {
    if (!supabase || !user) return;

    const now = new Date().toISOString();
    setRows((current) =>
      current.map((row) => (row.id === id && !row.read_at ? { ...row, read_at: now } : row)),
    );

    await supabase
      .from("user_notifications")
      .update({ read_at: now })
      .eq("id", id)
      .eq("user_id", user.id);
  }

  async function markAllRead() {
    if (!supabase || !user || unreadCount === 0) return;

    const now = new Date().toISOString();
    await supabase
      .from("user_notifications")
      .update({ read_at: now })
      .eq("user_id", user.id)
      .is("read_at", null);

    setRows((current) => current.map((row) => ({ ...row, read_at: row.read_at ?? now })));
  }

  if (!user) return null;

  function renderCountBadge(count: number, className = "") {
    if (count <= 0) return null;

    return (
      <span
        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold leading-none text-white ${className}`.trim()}
      >
        {count > 99 ? "99+" : count}
      </span>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => {
            const next = !current;
            if (!next) setShowSettings(false);
            return next;
          });
          void loadNotifications();
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-950"
        aria-label={
          unreadCount > 0
            ? `${t.notifications.bellLabel} (${unreadCount})`
            : t.notifications.bellLabel
        }
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5 text-zinc-700 dark:text-zinc-200"
          aria-hidden
        >
          <path d="M12 3a5 5 0 0 0-5 5v2.1c0 .5-.2 1-.5 1.4L5.1 14.2A1 1 0 0 0 6 16h12a1 1 0 0 0 .9-1.5l-1.4-2.7a2 2 0 0 1-.5-1.4V8a5 5 0 0 0-5-5Z" />
          <path d="M10 18a2 2 0 0 0 4 0" />
        </svg>
        {unreadCount > 0 ? (
          renderCountBadge(unreadCount, "absolute -top-1 -start-1 shadow-sm")
        ) : null}
      </button>

      {open ? (
        <div className="absolute end-0 top-full z-[10040] mt-2 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setShowSettings((current) => !current)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              aria-label={t.notifications.settingsLabel}
              aria-expanded={showSettings}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
              </svg>
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <p className="text-sm font-semibold text-black dark:text-white">{t.notifications.title}</p>
              {renderCountBadge(unreadCount)}
            </div>

            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="shrink-0 text-xs font-medium text-accent hover:underline"
              >
                {t.notifications.markAllRead}
              </button>
            ) : null}
          </div>

          {showSettings ? (
            <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <div className="flex items-center justify-between gap-3">
                <label className="flex min-w-0 flex-1 items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(event) => void toggleEnabled(event.target.checked)}
                    className="h-4 w-4 rounded border-zinc-400 text-accent"
                  />
                  <span>{t.notifications.enableInApp}</span>
                </label>
                {renderCountBadge(unreadCount)}
              </div>
              <p className="mt-2 text-xs text-zinc-500">{t.notifications.settingsHint}</p>
            </div>
          ) : null}

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-sm text-zinc-500">{t.notifications.loading}</p>
            ) : !enabled ? (
              <p className="px-4 py-6 text-sm text-zinc-500">{t.notifications.disabledHint}</p>
            ) : rows.length === 0 ? (
              <p className="px-4 py-6 text-sm text-zinc-500">{t.notifications.empty}</p>
            ) : (
              rows.map((row) => {
                const isUnread = !row.read_at;
                const formatted = formatNotificationText(row, t.notifications);
                const content = (
                  <div
                    className={`flex items-start gap-3 border-b border-zinc-100 px-4 py-3 last:border-b-0 dark:border-zinc-900 ${
                      isUnread ? "bg-zinc-50 dark:bg-zinc-900/40" : "opacity-80"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-black dark:text-white">{formatted.title}</p>
                        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {formatted.typeLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{formatted.body}</p>
                      <p className="mt-2 text-[10px] text-zinc-400">
                        {new Date(row.created_at).toLocaleString()}
                      </p>
                    </div>
                    {isUnread ? (
                      <span
                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500"
                        aria-hidden
                      />
                    ) : null}
                  </div>
                );

                if (row.link) {
                  return (
                    <Link
                      key={row.id}
                      href={row.link}
                      onClick={() => {
                        if (isUnread) void markRead(row.id);
                      }}
                      className="block transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => {
                      if (isUnread) void markRead(row.id);
                    }}
                    className="block w-full text-start transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    {content}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
