"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
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
};

export function NotificationBell() {
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const unreadCount = rows.filter((row) => !row.read_at).length;

  const loadNotifications = useCallback(async () => {
    if (!supabase || !user) return;

    setLoading(true);

    const [notificationsResult, prefsResult] = await Promise.all([
      supabase
        .from("user_notifications")
        .select("id, type, title, body, link, read_at, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("user_notification_preferences")
        .select("in_app_enabled")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    if (!notificationsResult.error) {
      setRows(notificationsResult.data ?? []);
    }

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

    await supabase
      .from("user_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);

    setRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, read_at: new Date().toISOString() } : row,
      ),
    );
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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          void loadNotifications();
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-950"
        aria-label={t.notifications.bellLabel}
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
        <span className="absolute -bottom-0.5 -end-0.5 flex h-4 w-4 items-center justify-center overflow-hidden rounded-full bg-white shadow dark:bg-black">
          <Image src="/clash-mark.svg" alt="" width={14} height={14} className="h-3.5 w-3.5" />
        </span>
        {enabled && unreadCount > 0 ? (
          <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute end-0 top-full z-[10040] mt-2 w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div>
              <p className="text-sm font-semibold text-black dark:text-white">{t.notifications.title}</p>
              <p className="text-xs text-zinc-500">{t.notifications.subtitle}</p>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="text-xs font-medium text-accent hover:underline"
              >
                {t.notifications.markAllRead}
              </button>
            ) : null}
          </div>

          <label className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => void toggleEnabled(event.target.checked)}
              className="h-4 w-4 rounded border-zinc-400 text-accent"
            />
            <span>{t.notifications.enableInApp}</span>
          </label>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-sm text-zinc-500">{t.notifications.loading}</p>
            ) : !enabled ? (
              <p className="px-4 py-6 text-sm text-zinc-500">{t.notifications.disabledHint}</p>
            ) : rows.length === 0 ? (
              <p className="px-4 py-6 text-sm text-zinc-500">{t.notifications.empty}</p>
            ) : (
              rows.map((row) => {
                const content = (
                  <div
                    className={`border-b border-zinc-100 px-4 py-3 last:border-b-0 dark:border-zinc-900 ${
                      row.read_at ? "opacity-70" : "bg-accent/5"
                    }`}
                  >
                    <p className="text-sm font-semibold text-black dark:text-white">{row.title}</p>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{row.body}</p>
                    <p className="mt-2 text-[10px] text-zinc-400">
                      {new Date(row.created_at).toLocaleString()}
                    </p>
                  </div>
                );

                if (row.link) {
                  return (
                    <Link
                      key={row.id}
                      href={row.link}
                      onClick={() => void markRead(row.id)}
                      className="block hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => void markRead(row.id)}
                    className="block w-full text-start hover:bg-zinc-50 dark:hover:bg-zinc-900"
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
