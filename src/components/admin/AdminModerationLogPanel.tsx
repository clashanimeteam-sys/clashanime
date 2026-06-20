"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getModerationStatusLabel } from "@/lib/moderation";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type ModerationLogRow = {
  id: string;
  action: string;
  previous_status: string | null;
  new_status: string | null;
  notes: string | null;
  created_at: string;
  video_id: string | null;
  target_user_id: string | null;
  staff_id: string;
  video_title?: string | null;
  staff_username?: string | null;
  target_username?: string | null;
};

export function AdminModerationLogPanel() {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [rows, setRows] = useState<ModerationLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLog = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("moderation_actions")
      .select(
        "id, action, previous_status, new_status, notes, created_at, video_id, target_user_id, staff_id",
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const entries = data ?? [];
    const videoIds = [...new Set(entries.map((row) => row.video_id).filter(Boolean))] as string[];
    const userIds = [
      ...new Set(
        entries
          .flatMap((row) => [row.staff_id, row.target_user_id])
          .filter(Boolean),
      ),
    ] as string[];

    let videoMap = new Map<string, string>();
    if (videoIds.length > 0) {
      const { data: videos } = await supabase.from("videos").select("id, title").in("id", videoIds);
      videoMap = new Map((videos ?? []).map((video) => [video.id, video.title]));
    }

    let profileMap = new Map<string, string>();
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);
      profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]));
    }

    setRows(
      entries.map((row) => ({
        ...row,
        video_title: row.video_id ? (videoMap.get(row.video_id) ?? null) : null,
        staff_username: profileMap.get(row.staff_id) ?? null,
        target_username: row.target_user_id
          ? (profileMap.get(row.target_user_id) ?? null)
          : null,
      })),
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadLog();
  }, [loadLog]);

  function actionLabel(action: string) {
    const labels = t.admin.moderationActions;
    if (action in labels) {
      return labels[action as keyof typeof labels];
    }
    return action;
  }

  function statusLabel(status: string | null) {
    if (!status) return "—";
    if (status === "approved" || status === "rejected" || status === "review" || status === "pending") {
      return getModerationStatusLabel(status, t.moderation);
    }
    return status;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.moderationLogTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.moderationLogSubtitle}</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3 text-start">{t.admin.table.time}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.action}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.staff}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.video}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.target}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.statusChange}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-zinc-800">
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{actionLabel(row.action)}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    @{row.staff_username ?? "unknown"}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {row.video_id ? (
                      <Link href={`/video/${row.video_id}`} className="text-accent hover:underline">
                        {row.video_title ?? row.video_id.slice(0, 8)}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {row.target_username ? `@${row.target_username}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {statusLabel(row.previous_status)} → {statusLabel(row.new_status)}
                    {row.notes ? (
                      <span className="mt-1 block text-xs text-zinc-500">{row.notes}</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="p-6 text-sm text-zinc-400">{t.admin.noModerationLog}</p>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
