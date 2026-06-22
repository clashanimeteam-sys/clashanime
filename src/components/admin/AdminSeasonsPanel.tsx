"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  centsToDollarsInput,
  DEFAULT_SEASON_PRIZES,
  dollarsToCents,
  formatPrizeUsd,
} from "@/lib/clashSeasons";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type ClashSeasonRow = {
  id: string;
  name: string;
  starts_at: string;
  ends_at: string;
  status: "scheduled" | "active" | "ended";
  prize_rank_1_cents: number;
  prize_rank_2_cents: number;
  prize_rank_3_cents: number;
  created_at: string;
  updated_at: string;
};

function toLocalInputValue(iso: string) {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromLocalInputValue(value: string) {
  return new Date(value).toISOString();
}

export function AdminSeasonsPanel() {
  const { t, locale, formatNumber, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [seasons, setSeasons] = useState<ClashSeasonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [activateOnCreate, setActivateOnCreate] = useState(true);
  const [newSeasonName, setNewSeasonName] = useState("");
  const [durationDays, setDurationDays] = useState(30);
  const [prizeRank1, setPrizeRank1] = useState(String(DEFAULT_SEASON_PRIZES.rank1Cents / 100));
  const [prizeRank2, setPrizeRank2] = useState(String(DEFAULT_SEASON_PRIZES.rank2Cents / 100));
  const [prizeRank3, setPrizeRank3] = useState(String(DEFAULT_SEASON_PRIZES.rank3Cents / 100));

  const activeSeason = seasons.find((season) => season.status === "active");

  useEffect(() => {
    if (!activeSeason) return;
    setPrizeRank1(centsToDollarsInput(activeSeason.prize_rank_1_cents));
    setPrizeRank2(centsToDollarsInput(activeSeason.prize_rank_2_cents));
    setPrizeRank3(centsToDollarsInput(activeSeason.prize_rank_3_cents));
  }, [activeSeason]);

  const loadSeasons = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    const { data, error: listError } = await supabase.rpc("list_clash_seasons");
    if (listError) {
      setError(listError.message);
      setSeasons([]);
    } else {
      setSeasons((data as ClashSeasonRow[]) ?? []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadSeasons();
  }, [loadSeasons]);

  useEffect(() => {
    if (startsAt && endsAt) return;

    const now = new Date();
    const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    setStartsAt(toLocalInputValue(now.toISOString()));
    setEndsAt(toLocalInputValue(end.toISOString()));
  }, [startsAt, endsAt]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: createError } = await supabase.rpc("create_clash_season", {
      p_name: name.trim(),
      p_starts_at: fromLocalInputValue(startsAt),
      p_ends_at: fromLocalInputValue(endsAt),
      p_activate: activateOnCreate,
      p_prize_rank_1_cents: dollarsToCents(prizeRank1),
      p_prize_rank_2_cents: dollarsToCents(prizeRank2),
      p_prize_rank_3_cents: dollarsToCents(prizeRank3),
    });

    if (createError) {
      setError(createError.message);
    } else {
      setMessage(t.admin.seasons.created);
      setName("");
      await loadSeasons();
    }

    setSaving(false);
  }

  async function handleStartNewSeason() {
    if (!supabase) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: startError } = await supabase.rpc("start_new_clash_season", {
      p_name: newSeasonName.trim() || null,
      p_duration_days: durationDays,
      p_prize_rank_1_cents: dollarsToCents(prizeRank1),
      p_prize_rank_2_cents: dollarsToCents(prizeRank2),
      p_prize_rank_3_cents: dollarsToCents(prizeRank3),
    });

    if (startError) {
      setError(startError.message);
    } else {
      setMessage(t.admin.seasons.startedNew);
      setNewSeasonName("");
      await loadSeasons();
    }

    setSaving(false);
  }

  async function activateSeason(id: string) {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: activateError } = await supabase.rpc("activate_clash_season", { p_id: id });
    if (activateError) setError(activateError.message);
    else {
      setMessage(t.admin.seasons.activated);
      await loadSeasons();
    }
    setSaving(false);
  }

  async function endSeason(id: string) {
    if (!supabase) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: endError } = await supabase.rpc("end_clash_season", { p_id: id });
    if (endError) setError(endError.message);
    else {
      setMessage(t.admin.seasons.ended);
      await loadSeasons();
    }
    setSaving(false);
  }

  async function updateSeason(season: ClashSeasonRow) {
    if (!supabase) return;

    const nextName = window.prompt(t.admin.seasons.editNamePrompt, season.name);
    if (nextName === null) return;

    const nextStart = window.prompt(
      t.admin.seasons.editStartPrompt,
      toLocalInputValue(season.starts_at),
    );
    if (nextStart === null) return;

    const nextEnd = window.prompt(t.admin.seasons.editEndPrompt, toLocalInputValue(season.ends_at));
    if (nextEnd === null) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: updateError } = await supabase.rpc("update_clash_season", {
      p_id: season.id,
      p_name: nextName.trim(),
      p_starts_at: fromLocalInputValue(nextStart),
      p_ends_at: fromLocalInputValue(nextEnd),
      p_prize_rank_1_cents: null,
      p_prize_rank_2_cents: null,
      p_prize_rank_3_cents: null,
    });

    if (updateError) setError(updateError.message);
    else {
      setMessage(t.admin.seasons.updated);
      await loadSeasons();
    }
    setSaving(false);
  }

  async function handleSavePrizes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !activeSeason) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: prizeError } = await supabase.rpc("update_clash_season_prizes", {
      p_id: activeSeason.id,
      p_prize_rank_1_cents: dollarsToCents(prizeRank1),
      p_prize_rank_2_cents: dollarsToCents(prizeRank2),
      p_prize_rank_3_cents: dollarsToCents(prizeRank3),
    });

    if (prizeError) setError(prizeError.message);
    else {
      setMessage(t.admin.seasons.prizesSaved);
      await loadSeasons();
    }

    setSaving(false);
  }

  function renderPrizeFields() {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm text-zinc-300">
          {t.admin.seasons.prizeRank1Label}
          <input
            type="number"
            min={0}
            step={1}
            value={prizeRank1}
            onChange={(event) => setPrizeRank1(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm text-zinc-300">
          {t.admin.seasons.prizeRank2Label}
          <input
            type="number"
            min={0}
            step={1}
            value={prizeRank2}
            onChange={(event) => setPrizeRank2(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm text-zinc-300">
          {t.admin.seasons.prizeRank3Label}
          <input
            type="number"
            min={0}
            step={1}
            value={prizeRank3}
            onChange={(event) => setPrizeRank3(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.seasons.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.seasons.subtitle}</p>
      </div>

      {activeSeason ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            {t.admin.seasons.activeNow}
          </p>
          <p className="mt-1 text-lg font-bold text-white">{activeSeason.name}</p>
          <p className="mt-2 text-sm text-emerald-100/80">
            {formatDateTime(activeSeason.starts_at)} →{" "}
            {formatDateTime(activeSeason.ends_at)}
          </p>
          <p className="mt-3 text-sm text-emerald-100">
            {formatPrizeUsd(activeSeason.prize_rank_1_cents, locale)} ·{" "}
            {formatPrizeUsd(activeSeason.prize_rank_2_cents, locale)} ·{" "}
            {formatPrizeUsd(activeSeason.prize_rank_3_cents, locale)}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-100">
          {t.admin.seasons.noActive}
        </div>
      )}

      {activeSeason ? (
        <form
          onSubmit={handleSavePrizes}
          className="rounded-2xl border border-amber-500/25 bg-amber-950/10 p-5"
        >
          <h2 className="text-lg font-semibold text-white">{t.admin.seasons.prizeSectionTitle}</h2>
          <div className="mt-4">{renderPrizeFields()}</div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 disabled:opacity-50"
          >
            {t.admin.seasons.prizeSaveButton}
          </button>
        </form>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
        >
          <h2 className="text-lg font-semibold text-white">{t.admin.seasons.createTitle}</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm text-zinc-300">
              {t.admin.seasons.nameLabel}
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm text-zinc-300">
              {t.admin.seasons.startsAtLabel}
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(event) => setStartsAt(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm text-zinc-300">
              {t.admin.seasons.endsAtLabel}
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(event) => setEndsAt(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={activateOnCreate}
                onChange={(event) => setActivateOnCreate(event.target.checked)}
              />
              {t.admin.seasons.activateOnCreate}
            </label>
            <div className="pt-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {t.admin.seasons.prizeSectionTitle}
              </p>
              {renderPrizeFields()}
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {t.admin.seasons.createButton}
          </button>
        </form>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-lg font-semibold text-white">{t.admin.seasons.quickStartTitle}</h2>
          <p className="mt-2 text-sm text-zinc-400">{t.admin.seasons.quickStartDesc}</p>
          <div className="mt-4 space-y-3">
            <label className="block text-sm text-zinc-300">
              {t.admin.seasons.nameLabel}
              <input
                type="text"
                value={newSeasonName}
                onChange={(event) => setNewSeasonName(event.target.value)}
                placeholder={t.admin.seasons.autoNamePlaceholder}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm text-zinc-300">
              {t.admin.seasons.durationDaysLabel}
              <input
                type="number"
                min={1}
                max={365}
                value={durationDays}
                onChange={(event) => setDurationDays(Number(event.target.value) || 30)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
              />
            </label>
            <div className="pt-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {t.admin.seasons.prizeSectionTitle}
              </p>
              {renderPrizeFields()}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleStartNewSeason()}
            disabled={saving}
            className="mt-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {t.admin.seasons.startNewButton}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-lg font-semibold text-white">{t.admin.seasons.listTitle}</h2>
        {loading ? (
          <p className="mt-4 text-sm text-zinc-400">{t.admin.loading}</p>
        ) : seasons.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">{t.admin.seasons.empty}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {seasons.map((season) => (
              <div
                key={season.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{season.name}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {formatDateTime(season.starts_at)} →{" "}
                      {formatDateTime(season.ends_at)}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-300">
                      {t.admin.seasons.statusLabels[season.status]}
                    </p>
                    <p className="mt-2 text-xs text-zinc-400">
                      {formatPrizeUsd(season.prize_rank_1_cents, locale)} ·{" "}
                      {formatPrizeUsd(season.prize_rank_2_cents, locale)} ·{" "}
                      {formatPrizeUsd(season.prize_rank_3_cents, locale)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {season.status !== "ended" ? (
                      <button
                        type="button"
                        onClick={() => void updateSeason(season)}
                        disabled={saving}
                        className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200"
                      >
                        {t.admin.seasons.editButton}
                      </button>
                    ) : null}
                    {season.status !== "active" && season.status !== "ended" ? (
                      <button
                        type="button"
                        onClick={() => void activateSeason(season.id)}
                        disabled={saving}
                        className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        {t.admin.seasons.activateButton}
                      </button>
                    ) : null}
                    {season.status === "active" ? (
                      <button
                        type="button"
                        onClick={() => void endSeason(season.id)}
                        disabled={saving}
                        className="rounded-full bg-red-700 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        {t.admin.seasons.endButton}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
