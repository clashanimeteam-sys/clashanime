"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatPrizeUsd } from "@/lib/clashSeasons";
import type { AdminLegendSeason, AdminSeasonWinner } from "@/lib/hallOfLegends";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

export function AdminLegendsPanel() {
  const { t, locale, formatNumber, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [seasons, setSeasons] = useState<AdminLegendSeason[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [winners, setWinners] = useState<AdminSeasonWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWinners, setLoadingWinners] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSeasons = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    const { data, error: listError } = await supabase.rpc("list_legend_seasons");

    if (listError) {
      setError(listError.message);
      setSeasons([]);
    } else {
      const mapped = ((data ?? []) as Array<{
        season_id: string;
        season_name: string;
        season_status: AdminLegendSeason["seasonStatus"];
        season_starts_at: string;
        season_ends_at: string;
        winners_count: number;
      }>).map((row) => ({
        seasonId: row.season_id,
        seasonName: row.season_name,
        seasonStatus: row.season_status,
        seasonStartsAt: row.season_starts_at,
        seasonEndsAt: row.season_ends_at,
        winnersCount: Number(row.winners_count),
      }));

      setSeasons(mapped);
      if (!selectedSeasonId && mapped.length > 0) {
        setSelectedSeasonId(mapped.find((s) => s.seasonStatus === "ended")?.seasonId ?? mapped[0].seasonId);
      }
    }

    setLoading(false);
  }, [selectedSeasonId, supabase]);

  const loadWinners = useCallback(
    async (seasonId: string) => {
      if (!supabase) return;

      setLoadingWinners(true);
      const { data, error: winnersError } = await supabase.rpc("list_season_winners", {
        p_season_id: seasonId,
      });

      if (winnersError) {
        setError(winnersError.message);
        setWinners([]);
      } else {
        setWinners(
          ((data ?? []) as Array<{
            id: string;
            season_id: string;
            rank: number;
            user_id: string;
            username: string;
            display_name: string | null;
            avatar_url: string | null;
            video_id: string | null;
            video_title: string | null;
            thumbnail_url: string | null;
            prize_cents: number;
            trending_score: number | null;
            finalized_at: string;
          }>).map((row) => ({
            id: row.id,
            seasonId: row.season_id,
            rank: row.rank,
            userId: row.user_id,
            username: row.username,
            displayName: row.display_name,
            avatarUrl: row.avatar_url,
            videoId: row.video_id,
            videoTitle: row.video_title,
            thumbnailUrl: row.thumbnail_url,
            prizeCents: Number(row.prize_cents),
            trendingScore: row.trending_score === null ? null : Number(row.trending_score),
            finalizedAt: row.finalized_at,
          })),
        );
      }

      setLoadingWinners(false);
    },
    [supabase],
  );

  useEffect(() => {
    void loadSeasons();
  }, [loadSeasons]);

  useEffect(() => {
    if (!selectedSeasonId) return;
    void loadWinners(selectedSeasonId);
  }, [loadWinners, selectedSeasonId]);

  async function snapshotWinners(seasonId: string) {
    if (!supabase) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const { data, error: snapshotError } = await supabase.rpc("snapshot_season_winners", {
      p_season_id: seasonId,
    });

    if (snapshotError) {
      setError(snapshotError.message);
    } else {
      setMessage(
        t.admin.legends.snapshotSuccess.replace("{count}", String(data ?? 0)),
      );
      await loadSeasons();
      await loadWinners(seasonId);
    }

    setSaving(false);
  }

  async function removeWinner(winnerId: string) {
    if (!supabase) return;
    if (!window.confirm(t.admin.legends.deleteConfirm)) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: deleteError } = await supabase.rpc("delete_season_winner", {
      p_winner_id: winnerId,
    });

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setMessage(t.admin.legends.deleted);
      if (selectedSeasonId) {
        await loadSeasons();
        await loadWinners(selectedSeasonId);
      }
    }

    setSaving(false);
  }

  const selectedSeason = seasons.find((season) => season.seasonId === selectedSeasonId) ?? null;
  const archivedSeasons = seasons.filter((season) => season.winnersCount > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.legends.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.legends.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            {t.admin.legends.statsArchived}
          </p>
          <p className="mt-2 text-3xl font-bold text-white">{archivedSeasons}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {t.admin.legends.statsEnded}
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {seasons.filter((season) => season.seasonStatus === "ended").length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            {t.admin.legends.statsWinners}
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {seasons.reduce((sum, season) => sum + season.winnersCount, 0)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">{t.admin.legends.seasonListTitle}</h2>
          <Link
            href="/admin/seasons"
            className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200"
          >
            {t.admin.legends.openSeasons}
          </Link>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-zinc-400">{t.admin.loading}</p>
        ) : seasons.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">{t.admin.legends.emptySeasons}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {seasons.map((season) => (
              <div
                key={season.seasonId}
                className={`rounded-xl border p-4 ${
                  selectedSeasonId === season.seasonId
                    ? "border-violet-500/50 bg-violet-950/20"
                    : "border-zinc-800 bg-zinc-950/70"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{season.seasonName}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {formatDateTime(season.seasonStartsAt)} →{" "}
                      {formatDateTime(season.seasonEndsAt)}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-violet-300">
                      {t.admin.seasons.statusLabels[season.seasonStatus]} ·{" "}
                      {t.admin.legends.winnersCount.replace("{count}", String(season.winnersCount))}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSeasonId(season.seasonId)}
                      className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200"
                    >
                      {t.admin.legends.viewWinners}
                    </button>
                    {season.seasonStatus === "ended" ? (
                      <button
                        type="button"
                        onClick={() => void snapshotWinners(season.seasonId)}
                        disabled={saving}
                        className="rounded-full bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        {season.winnersCount > 0
                          ? t.admin.legends.resnapshotButton
                          : t.admin.legends.snapshotButton}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSeason ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-lg font-semibold text-white">
            {t.admin.legends.winnersTitle.replace("{season}", selectedSeason.seasonName)}
          </h2>
          {loadingWinners ? (
            <p className="mt-4 text-sm text-zinc-400">{t.admin.loading}</p>
          ) : winners.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-400">{t.admin.legends.noWinners}</p>
          ) : (
            <div className="mt-4 space-y-3">
              {winners.map((winner) => (
                <div
                  key={winner.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4"
                >
                  <div>
                    <p className="font-semibold text-white">
                      #{winner.rank} · {winner.displayName ?? winner.username}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">@{winner.username}</p>
                    {winner.videoTitle ? (
                      <p className="mt-2 text-sm text-zinc-300">{winner.videoTitle}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-emerald-300">
                      {formatPrizeUsd(winner.prizeCents, locale)}
                      {winner.trendingScore !== null
                        ? ` · score ${winner.trendingScore.toFixed(2)}`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void removeWinner(winner.id)}
                    disabled={saving}
                    className="rounded-full border border-red-800 px-3 py-1.5 text-xs text-red-300 disabled:opacity-50"
                  >
                    {t.admin.legends.deleteWinner}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
