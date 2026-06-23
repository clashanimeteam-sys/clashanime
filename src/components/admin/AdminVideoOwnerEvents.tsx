"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type OwnerEventRow = {
  id: string;
  action: "update" | "delete";
  previous_title: string | null;
  new_title: string | null;
  created_at: string;
  video_id: string | null;
  user_id: string;
  username?: string | null;
};

type AdminVideoOwnerEventsProps = {
  limit?: number;
  className?: string;
};

export function AdminVideoOwnerEvents({ limit = 15, className = "" }: AdminVideoOwnerEventsProps) {
  const { t, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [rows, setRows] = useState<OwnerEventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    void (async () => {
      const { data, error } = await supabase
        .from("video_owner_events")
        .select("id, action, previous_title, new_title, created_at, video_id, user_id")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error || !data) {
        setRows([]);
        setLoading(false);
        return;
      }

      const userIds = [...new Set(data.map((row) => row.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]));

      setRows(
        data.map((row) => ({
          ...(row as OwnerEventRow),
          username: profileMap.get(row.user_id) ?? null,
        })),
      );
      setLoading(false);
    })();
  }, [supabase, limit]);

  return (
    <section className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-white">{t.admin.videoOwnerEvents.title}</h2>
        <p className="mt-1 text-sm text-zinc-400">{t.admin.videoOwnerEvents.subtitle}</p>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-zinc-500">{t.admin.loading}</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{t.admin.videoOwnerEvents.empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-800">
          {rows.map((row) => {
            const actionLabel =
              row.action === "update"
                ? t.admin.videoOwnerEvents.updated
                : t.admin.videoOwnerEvents.deleted;
            const title =
              row.action === "update"
                ? `${row.previous_title ?? "—"} → ${row.new_title ?? "—"}`
                : (row.previous_title ?? "—");

            return (
              <li key={row.id} className="py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {actionLabel}
                      {row.username ? (
                        <span className="font-normal text-zinc-400">
                          {" "}
                          · @{row.username}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 truncate text-sm text-zinc-300">{title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatDateTime(row.created_at, { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  {row.video_id ? (
                    <Link
                      href={`/video/${row.video_id}`}
                      className="shrink-0 text-xs font-semibold text-orange-300 hover:text-orange-200"
                    >
                      {t.admin.videoOwnerEvents.viewVideo}
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
