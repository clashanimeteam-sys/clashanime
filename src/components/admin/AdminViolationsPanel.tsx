"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { ChannelViolation } from "@/lib/channelViolations";
import { useLocale } from "@/providers/LocaleProvider";

type ViolationRow = ChannelViolation & {
  username?: string | null;
  display_name?: string | null;
};

export function AdminViolationsPanel() {
  const { t, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [violations, setViolations] = useState<ViolationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadViolations = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("channel_violations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as ViolationRow[];
    const userIds = [...new Set(rows.map((row) => row.user_id))];
    const { data: profiles } = userIds.length
      ? await supabase.from("profiles").select("id, username, display_name").in("id", userIds)
      : { data: [] as Array<{ id: string; username: string; display_name: string | null }> };

    const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

    setViolations(
      rows.map((row) => ({
        ...row,
        username: profileMap.get(row.user_id)?.username ?? null,
        display_name: profileMap.get(row.user_id)?.display_name ?? null,
      })),
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadViolations();
  }, [loadViolations]);

  async function retractViolation(violationId: string) {
    if (!supabase) return;
    if (!window.confirm(t.admin.confirmRetractViolation)) return;

    const { error: updateError } = await supabase
      .from("channel_violations")
      .update({ status: "retracted" })
      .eq("id", violationId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(t.admin.violationRetracted);
    await loadViolations();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.violationsTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.violationsSubtitle}</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="space-y-3">
          {violations.map((violation) => (
            <article
              key={violation.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-white">
                    {violation.display_name ?? violation.username ?? violation.user_id}
                  </p>
                  <p className="text-sm text-zinc-500">@{violation.username ?? "unknown"}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-red-300">
                      {violation.violation_type}
                    </span>
                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                      {violation.status}
                    </span>
                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                      {violation.content_type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-300">{violation.reason}</p>
                  {violation.claimant_name ? (
                    <p className="mt-1 text-xs text-zinc-500">
                      {t.admin.violationClaimant}: {violation.claimant_name}
                    </p>
                  ) : null}
                  {violation.content_title ? (
                    <p className="mt-1 text-xs text-zinc-500">
                      {t.admin.violationContent}: {violation.content_title}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatDateTime(violation.created_at)}
                  </p>
                </div>
                {violation.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => void retractViolation(violation.id)}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500"
                  >
                    {t.admin.retractViolation}
                  </button>
                ) : null}
              </div>
            </article>
          ))}

          {violations.length === 0 ? (
            <p className="rounded-2xl border border-zinc-800 p-6 text-sm text-zinc-400">
              {t.admin.noViolations}
            </p>
          ) : null}
        </div>
      )}

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
