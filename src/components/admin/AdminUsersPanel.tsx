"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { canManageUsers, type UserRole } from "@/lib/admin";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type UserRow = Profile & {
  video_count?: number;
};

export function AdminUsersPanel() {
  const { profile: currentProfile } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const canManage = canManageUsers(currentProfile);

  const loadUsers = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("id, username, display_name, role, is_banned, created_at, updated_at, avatar_url, banner_url, bio")
      .order("created_at", { ascending: false })
      .limit(200);

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    const counts = await Promise.all(
      rows.map(async (row) => {
        const { count } = await supabase
          .from("videos")
          .select("*", { count: "exact", head: true })
          .eq("user_id", row.id);
        return { id: row.id, count: count ?? 0 };
      }),
    );

    const countMap = new Map(counts.map((entry) => [entry.id, entry.count]));

    setUsers(
      rows.map((row) => ({
        ...row,
        video_count: countMap.get(row.id) ?? 0,
      })),
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function updateUser(userId: string, patch: Partial<Pick<Profile, "role" | "is_banned">>) {
    if (!supabase || !canManage) return;

    setMessage(null);
    setError(null);

    const { error: updateError } = await supabase.from("profiles").update(patch).eq("id", userId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(t.admin.saved);
    await loadUsers();
  }

  const filtered = users.filter((user) => {
    const haystack = `${user.username} ${user.display_name ?? ""}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  if (!canManage) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400">
        {t.admin.adminOnly}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.usersTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.usersSubtitle}</p>
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.admin.searchUsers}
        className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-accent"
      />

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3 text-start">{t.admin.table.user}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.role}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.videos}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.status}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-zinc-800">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{user.display_name ?? user.username}</div>
                    <div className="text-zinc-500">@{user.username}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role ?? "user"}
                      onChange={(event) =>
                        updateUser(user.id, { role: event.target.value as UserRole })
                      }
                      disabled={user.id === currentProfile?.id}
                      className="rounded-lg border border-zinc-700 bg-black px-2 py-1 text-white"
                    >
                      <option value="user">{t.admin.roles.user}</option>
                      <option value="moderator">{t.admin.roles.moderator}</option>
                      <option value="admin">{t.admin.roles.admin}</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{user.video_count ?? 0}</td>
                  <td className="px-4 py-3">
                    {user.is_banned ? (
                      <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300">
                        {t.admin.banned}
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
                        {t.admin.active}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateUser(user.id, { is_banned: !user.is_banned })}
                        disabled={user.id === currentProfile?.id}
                        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 disabled:opacity-50"
                      >
                        {user.is_banned ? t.admin.unban : t.admin.ban}
                      </button>
                      <Link
                        href={`/channel/${user.username}`}
                        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500"
                      >
                        {t.admin.viewChannel}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
