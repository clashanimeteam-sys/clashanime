"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RankLetter } from "@/components/RankLetter";
import { canManageUsers, type UserRole } from "@/lib/admin";
import { getLevelDefinition } from "@/lib/points";
import { logModerationAction } from "@/lib/moderationLog";
import { notifyAdminReviewCountsChanged } from "@/lib/adminReviewCounts";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type UserRow = Profile & {
  video_count?: number;
  community_post_count?: number;
};

type VerificationRequestRow = {
  id: string;
  user_id: string;
  message: string | null;
  created_at: string;
  username?: string;
  display_name?: string | null;
};

export function AdminUsersPanel() {
  const { user, profile: currentProfile } = useAuth();
  const { t, formatNumber, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequestRow[]>([]);
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
      .select("id, username, display_name, role, is_banned, is_verified, points, lifetime_points_earned, level, created_at, updated_at, avatar_url, banner_url, bio, country_code, country_name, youtube_url")
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
        const [{ count: videoCount }, { count: communityPostCount }] = await Promise.all([
          supabase.from("videos").select("*", { count: "exact", head: true }).eq("user_id", row.id),
          supabase
            .from("community_posts")
            .select("*", { count: "exact", head: true })
            .eq("user_id", row.id),
        ]);
        return {
          id: row.id,
          videoCount: videoCount ?? 0,
          communityPostCount: communityPostCount ?? 0,
        };
      }),
    );

    const countMap = new Map(
      counts.map((entry) => [
        entry.id,
        { videoCount: entry.videoCount, communityPostCount: entry.communityPostCount },
      ]),
    );

    setUsers(
      rows.map((row) => ({
        ...row,
        video_count: countMap.get(row.id)?.videoCount ?? 0,
        community_post_count: countMap.get(row.id)?.communityPostCount ?? 0,
      })),
    );

    const { data: requests } = await supabase
      .from("verification_requests")
      .select("id, user_id, message, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    const requestRows = requests ?? [];
    const requestUserIds = [...new Set(requestRows.map((row) => row.user_id))];
    const { data: requestProfiles } = requestUserIds.length
      ? await supabase.from("profiles").select("id, username, display_name").in("id", requestUserIds)
      : { data: [] as Array<{ id: string; username: string; display_name: string | null }> };
    const requestProfileMap = new Map((requestProfiles ?? []).map((profile) => [profile.id, profile]));

    setVerificationRequests(
      requestRows.map((row) => ({
        ...row,
        username: requestProfileMap.get(row.user_id)?.username,
        display_name: requestProfileMap.get(row.user_id)?.display_name ?? null,
      })),
    );

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function updateUser(
    userId: string,
    patch: Partial<Pick<Profile, "role" | "is_banned" | "is_verified">>,
  ) {
    if (!supabase || !canManage || !user) return;

    setMessage(null);
    setError(null);

    const targetUser = users.find((entry) => entry.id === userId);

    const { error: updateError } = await supabase.from("profiles").update(patch).eq("id", userId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    if (patch.is_verified !== undefined) {
      await logModerationAction(supabase, {
        targetUserId: userId,
        staffId: user.id,
        action: patch.is_verified ? "verify_channel" : "unverify_channel",
        notes: targetUser ? `@${targetUser.username}` : null,
      });
    }

    if (patch.is_banned !== undefined) {
      await logModerationAction(supabase, {
        targetUserId: userId,
        staffId: user.id,
        action: patch.is_banned ? "ban_user" : "unban_user",
        notes: targetUser ? `@${targetUser.username}` : null,
      });
    }

    setMessage(t.admin.saved);
    notifyAdminReviewCountsChanged();
    await loadUsers();
  }

  async function handleVerificationRequest(requestId: string, userId: string, approve: boolean) {
    if (!supabase || !user) return;

    setMessage(null);
    setError(null);

    if (approve) {
      const { error: verifyError } = await supabase
        .from("profiles")
        .update({ is_verified: true, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      await logModerationAction(supabase, {
        targetUserId: userId,
        staffId: user.id,
        action: "verify_channel",
      });
    }

    const { error: requestError } = await supabase
      .from("verification_requests")
      .update({
        status: approve ? "approved" : "rejected",
        handled_at: new Date().toISOString(),
        handled_by: user.id,
      })
      .eq("id", requestId);

    if (requestError) {
      setError(requestError.message);
      return;
    }

    setMessage(t.admin.saved);
    notifyAdminReviewCountsChanged();
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

      {verificationRequests.length > 0 ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <h2 className="text-base font-semibold text-amber-200">{t.admin.verificationRequests}</h2>
          <div className="mt-4 space-y-3">
            {verificationRequests.map((request) => (
              <article key={request.id} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">
                      {request.display_name ?? request.username ?? request.user_id}
                    </p>
                    <p className="text-sm text-zinc-500">@{request.username ?? "unknown"}</p>
                    {request.message ? (
                      <p className="mt-2 text-sm text-zinc-300">{request.message}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleVerificationRequest(request.id, request.user_id, true)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {t.admin.approveVerification}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVerificationRequest(request.id, request.user_id, false)}
                      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                    >
                      {t.admin.rejectVerification}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3 text-start">{t.admin.table.user}</th>
                <th className="px-4 py-3 text-start">{t.admin.points}</th>
                <th className="px-4 py-3 text-start">{t.admin.lifetimePoints}</th>
                <th className="px-4 py-3 text-start">{t.admin.level}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.role}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.videos}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.communityPosts}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.status}</th>
                <th className="px-4 py-3 text-start">{t.admin.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-zinc-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-800">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : null}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.display_name ?? user.username}</div>
                        <div className="text-zinc-500">@{user.username}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {user.banner_url ? (
                            <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold text-violet-300">
                              {t.admin.channelHasCover}
                            </span>
                          ) : null}
                          {user.bio?.trim() ? (
                            <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                              {t.admin.channelHasBio}
                            </span>
                          ) : null}
                          {user.country_name || user.country_code ? (
                            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                              {user.country_name ?? user.country_code}
                            </span>
                          ) : null}
                          {user.youtube_url?.trim() ? (
                            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                              {t.admin.channelHasYoutube}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{formatNumber(user.points ?? 0)}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    {formatNumber(user.lifetime_points_earned ?? user.points ?? 0)}
                  </td>
                  <td className="px-4 py-3">
                    <RankLetter rank={getLevelDefinition(user.level ?? 1).rank} size="sm" />
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
                  <td className="px-4 py-3 text-zinc-300">{user.community_post_count ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {user.is_banned ? (
                        <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-300">
                          {t.admin.banned}
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
                          {t.admin.active}
                        </span>
                      )}
                      {user.is_verified ? (
                        <span className="rounded-full bg-sky-500/15 px-2 py-1 text-xs font-semibold text-sky-300">
                          {t.admin.verified}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateUser(user.id, { is_verified: !user.is_verified })}
                        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500"
                      >
                        {user.is_verified ? t.admin.unverify : t.admin.verify}
                      </button>
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
