"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";
import type { ReferralLeaderboardRow } from "@/lib/referrals";

type FlashEventRow = {
  id: string;
  title_en: string;
  title_ar: string;
  title_ja: string;
  multiplier: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at: string;
};

export function AdminReferralsPanel() {
  const { t, formatNumber, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [totalSignups, setTotalSignups] = useState(0);
  const [weekSignups, setWeekSignups] = useState(0);
  const [activeFlashCount, setActiveFlashCount] = useState(0);
  const [flashEvents, setFlashEvents] = useState<FlashEventRow[]>([]);
  const [leaderboard, setLeaderboard] = useState<ReferralLeaderboardRow[]>([]);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"week" | "all">("week");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [titleJa, setTitleJa] = useState("");
  const [multiplier, setMultiplier] = useState("2");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const loadData = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const [totalResult, weekResult, flashResult, eventsResult, leaderboardResult] = await Promise.all([
      supabase.from("referral_signups").select("*", { count: "exact", head: true }),
      supabase
        .from("referral_signups")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekStart.toISOString()),
      supabase
        .from("referral_flash_events")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)
        .lte("starts_at", new Date().toISOString())
        .gt("ends_at", new Date().toISOString()),
      supabase
        .from("referral_flash_events")
        .select("id, title_en, title_ar, title_ja, multiplier, starts_at, ends_at, is_active, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase.rpc("get_referral_leaderboard", {
        p_period: leaderboardPeriod,
        p_limit: 15,
      }),
    ]);

    setTotalSignups(totalResult.count ?? 0);
    setWeekSignups(weekResult.count ?? 0);
    setActiveFlashCount(flashResult.count ?? 0);
    setFlashEvents(eventsResult.data ?? []);
    setLeaderboard((leaderboardResult.data as ReferralLeaderboardRow[] | null) ?? []);
    setLoading(false);
  }, [supabase, leaderboardPeriod]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleCreateFlash(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setCreating(true);
    setError(null);
    setMessage(null);

    const { error: insertError } = await supabase.from("referral_flash_events").insert({
      title_en: titleEn.trim(),
      title_ar: titleAr.trim(),
      title_ja: titleJa.trim(),
      multiplier: Number(multiplier),
      starts_at: new Date(startsAt).toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      is_active: true,
    });

    setCreating(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setMessage(t.admin.referrals.created);
    setTitleEn("");
    setTitleAr("");
    setTitleJa("");
    setMultiplier("2");
    setStartsAt("");
    setEndsAt("");
    await loadData();
  }

  async function deactivateEvent(id: string) {
    if (!supabase) return;

    const { error: updateError } = await supabase
      .from("referral_flash_events")
      .update({ is_active: false })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await loadData();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.referrals.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.referrals.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: t.admin.referrals.totalSignups, value: totalSignups },
          { label: t.admin.referrals.weekSignups, value: weekSignups },
          { label: t.admin.referrals.activeFlash, value: activeFlashCount },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs text-zinc-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{formatNumber(card.value)}</p>
          </div>
        ))}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={(e) => void handleCreateFlash(e)} className="rounded-xl border border-zinc-800 bg-black/40 p-4">
          <h2 className="text-lg font-semibold text-white">{t.admin.referrals.createFlashTitle}</h2>
          <div className="mt-4 space-y-3">
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder={t.admin.referrals.titleEn}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
            <input
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder={t.admin.referrals.titleAr}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
            <input
              value={titleJa}
              onChange={(e) => setTitleJa(e.target.value)}
              placeholder={t.admin.referrals.titleJa}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
            <label className="block text-xs text-zinc-400">
              {t.admin.referrals.multiplier}
              <input
                type="number"
                min="1.1"
                step="0.1"
                value={multiplier}
                onChange={(e) => setMultiplier(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-zinc-400">
              {t.admin.referrals.startsAt}
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-zinc-400">
              {t.admin.referrals.endsAt}
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {creating ? t.admin.referrals.creating : t.admin.referrals.createButton}
            </button>
          </div>
        </form>

        <div>
          <h2 className="text-lg font-semibold text-white">{t.admin.referrals.flashEventsTitle}</h2>
          {loading ? (
            <p className="mt-3 text-sm text-zinc-400">{t.admin.loading}</p>
          ) : flashEvents.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-400">{t.admin.referrals.flashEventsEmpty}</p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-xl border border-zinc-800">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-400">
                  <tr>
                    <th className="px-3 py-2 text-start">{t.admin.referrals.table.title}</th>
                    <th className="px-3 py-2 text-start">{t.admin.referrals.table.multiplier}</th>
                    <th className="px-3 py-2 text-start">{t.admin.referrals.table.window}</th>
                    <th className="px-3 py-2 text-start">{t.admin.referrals.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {flashEvents.map((row) => (
                    <tr key={row.id} className="bg-black/40">
                      <td className="px-3 py-2 text-zinc-200">{row.title_en}</td>
                      <td className="px-3 py-2 text-zinc-300">×{row.multiplier}</td>
                      <td className="px-3 py-2 text-xs text-zinc-400">
                        {formatDateTime(row.starts_at)} → {formatDateTime(row.ends_at)}
                      </td>
                      <td className="px-3 py-2">
                        {row.is_active ? (
                          <button
                            type="button"
                            onClick={() => void deactivateEvent(row.id)}
                            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500"
                          >
                            {t.admin.referrals.deactivate}
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-white">{t.admin.referrals.leaderboardTitle}</h2>
          <div className="flex gap-2">
            {(["week", "all"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setLeaderboardPeriod(period)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  leaderboardPeriod === period
                    ? "bg-accent/20 text-accent"
                    : "border border-zinc-700 text-zinc-400"
                }`}
              >
                {period === "week" ? t.admin.referrals.periodWeek : t.admin.referrals.periodAll}
              </button>
            ))}
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <p className="text-sm text-zinc-400">{t.admin.referrals.flashEventsEmpty}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-3 py-2 text-start">#</th>
                  <th className="px-3 py-2 text-start">{t.admin.table.user}</th>
                  <th className="px-3 py-2 text-start">{t.admin.referrals.totalSignups}</th>
                  <th className="px-3 py-2 text-start">{t.points.referralMilestoneTitle}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {leaderboard.map((row) => (
                  <tr key={row.user_id} className="bg-black/40">
                    <td className="px-3 py-2 text-zinc-400">{row.rank}</td>
                    <td className="px-3 py-2 text-zinc-200">@{row.username}</td>
                    <td className="px-3 py-2 font-semibold text-accent">{formatNumber(row.signup_count)}</td>
                    <td className="px-3 py-2 text-zinc-300">
                      {row.referral_tier > 0
                        ? t.points.referralTiers[
                            row.referral_tier === 1 ? "scout" : row.referral_tier === 2 ? "recruit" : "leader"
                          ]
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
