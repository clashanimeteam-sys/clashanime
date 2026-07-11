"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AD_PAGE_KEYS,
  DEFAULT_AD_PLACEMENTS,
  MAX_REELS_AD_INTERVAL,
  MIN_REELS_AD_INTERVAL,
  parseAdPlacementSettings,
  type AdPageKey,
  type AdPlacementSettings,
} from "@/lib/ads/placements";
import { invalidateAdPlacementsCache } from "@/hooks/useAdPlacements";
import { useLocale } from "@/providers/LocaleProvider";

function PageWirePreview({ page, active }: { page: AdPageKey; active: boolean }) {
  const { t } = useLocale();

  if (!active) {
    return (
      <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 opacity-40">
        <p className="text-center text-[10px] text-zinc-600">{t.admin.ads.pageOff}</p>
      </div>
    );
  }

  const adBlock = (
    <div className="rounded-md border border-dashed border-amber-500/60 bg-amber-500/10 px-2 py-3 text-center text-[10px] font-bold text-amber-200">
      {t.admin.ads.previewAdBlock}
    </div>
  );

  if (page === "videoReels") {
    return (
      <div className="mx-auto mt-3 w-[120px] overflow-hidden rounded-[1.25rem] border-2 border-zinc-700 bg-black p-1.5">
        <div className="space-y-1">
          <div className="h-14 rounded-md bg-zinc-800" />
          <div className="h-14 rounded-md bg-zinc-800" />
          <div className="h-16 rounded-md border border-dashed border-amber-500/70 bg-amber-950/40 p-1 text-[8px] font-bold leading-tight text-amber-200">
            AD
          </div>
          <div className="h-14 rounded-md bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (page === "watch") {
    return (
      <div className="mt-3 space-y-1 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
        {adBlock}
        <div className="h-16 rounded-md bg-zinc-800/90" />
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
      <div className="h-8 rounded-md bg-zinc-800/90" />
      {page === "blog" || page === "home" ? (
        <div className="h-10 rounded-md bg-zinc-800/70" />
      ) : null}
      {adBlock}
      <div className="h-8 rounded-md bg-zinc-800/60" />
      <div className="h-8 rounded-md bg-zinc-800/40" />
      {page === "videos" ? <div className="h-8 rounded-md bg-zinc-800/40" /> : null}
    </div>
  );
}

function ReelsTimelinePreview({
  everyN,
  enabled,
}: {
  everyN: number;
  enabled: boolean;
}) {
  const { t } = useLocale();
  const items = useMemo(() => {
    const sequence: Array<"video" | "ad"> = [];
    let count = 0;
    for (let index = 0; index < 8; index += 1) {
      sequence.push("video");
      count += 1;
      if (enabled && count % everyN === 0) {
        sequence.push("ad");
      }
    }
    return sequence;
  }, [enabled, everyN]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
      <p className="mb-3 text-xs font-semibold text-zinc-300">{t.admin.ads.reelsTimelineTitle}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={`inline-flex min-w-[52px] items-center justify-center rounded-lg px-2 py-2 text-[10px] font-bold ${
              item === "ad"
                ? "border border-amber-500/60 bg-amber-500/15 text-amber-200"
                : "border border-zinc-700 bg-zinc-900 text-zinc-400"
            }`}
          >
            {item === "ad" ? t.admin.ads.previewAdBlock : `${t.admin.ads.videoShort}${((index % everyN) + 1) || 1}`}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AdminAdPlacementsPanel() {
  const { t } = useLocale();
  const [settings, setSettings] = useState<AdPlacementSettings>(
    parseAdPlacementSettings(DEFAULT_AD_PLACEMENTS),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/ad-placements", { cache: "no-store" });
      const payload = (await response.json()) as { settings?: AdPlacementSettings; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load");
      }
      setSettings(parseAdPlacementSettings(payload.settings));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load");
      setSettings(parseAdPlacementSettings(DEFAULT_AD_PLACEMENTS));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const updateSettings = (patch: Partial<AdPlacementSettings>) => {
    setSettings((current) => parseAdPlacementSettings({ ...current, ...patch }));
  };

  const togglePage = (page: AdPageKey) => {
    setSettings((current) =>
      parseAdPlacementSettings({
        ...current,
        pages: { ...current.pages, [page]: !current.pages[page] },
      }),
    );
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/ad-placements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const payload = (await response.json()) as { settings?: AdPlacementSettings; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to save");
      }
      setSettings(parseAdPlacementSettings(payload.settings));
      invalidateAdPlacementsCache();
      setMessage(t.admin.ads.saved);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const pageLabels: Record<AdPageKey, string> = {
    home: t.admin.ads.pages.home,
    blog: t.admin.ads.pages.blog,
    videos: t.admin.ads.pages.videos,
    videoReels: t.admin.ads.pages.videoReels,
    community: t.admin.ads.pages.community,
    tracker: t.admin.ads.pages.tracker,
    watch: t.admin.ads.pages.watch,
  };

  if (loading) {
    return <p className="text-sm text-zinc-400">{t.admin.loading}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.admin.ads.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">{t.admin.ads.subtitle}</p>
        </div>
        <Link
          href="/"
          className="rounded-full border border-orange-500/40 bg-orange-950/30 px-4 py-2 text-sm font-bold text-orange-200"
        >
          {t.admin.ads.previewOnSite}
        </Link>
      </div>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-100/90">
        {t.admin.ads.adsenseNote}
      </div>

      <div className="rounded-2xl border border-orange-500/30 bg-orange-950/20 p-4 text-sm text-orange-100/90">
        {t.admin.ads.trafficStarsNote}
      </div>

      {message ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-lg font-bold text-white">{t.admin.ads.controlsTitle}</h2>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">
            <span className="text-sm font-medium text-zinc-200">{t.admin.ads.masterToggle}</span>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(event) => updateSettings({ enabled: event.target.checked })}
              className="h-4 w-4 accent-orange-500"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">
            <span className="text-sm font-medium text-zinc-200">{t.admin.ads.previewToggle}</span>
            <input
              type="checkbox"
              checked={settings.showPreviewPlaceholders}
              onChange={(event) => updateSettings({ showPreviewPlaceholders: event.target.checked })}
              className="h-4 w-4 accent-orange-500"
            />
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-zinc-200">{t.admin.ads.reelsInterval}</span>
              <span className="text-sm font-bold text-orange-300">
                {t.admin.ads.reelsIntervalValue.replace("{n}", String(settings.reelsEveryNVideos))}
              </span>
            </div>
            <input
              type="range"
              min={MIN_REELS_AD_INTERVAL}
              max={MAX_REELS_AD_INTERVAL}
              value={settings.reelsEveryNVideos}
              disabled={!settings.pages.videoReels}
              onChange={(event) =>
                updateSettings({ reelsEveryNVideos: Number(event.target.value) })
              }
              className="w-full accent-orange-500"
            />
            <p className="mt-1 text-xs text-zinc-500">{t.admin.ads.reelsIntervalHint}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-zinc-400">
                {t.admin.ads.slotBanner}
              </span>
              <input
                value={settings.slotBanner}
                onChange={(event) => updateSettings({ slotBanner: event.target.value })}
                placeholder="1234567890"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-zinc-400">
                {t.admin.ads.slotInFeed}
              </span>
              <input
                value={settings.slotInFeed}
                onChange={(event) => updateSettings({ slotInFeed: event.target.value })}
                placeholder="1234567890"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-orange-300">
                {t.admin.ads.slotWatchBanner}
              </span>
              <input
                value={settings.slotWatchBanner}
                onChange={(event) => updateSettings({ slotWatchBanner: event.target.value })}
                placeholder="TrafficStars banner spot ID"
                className="w-full rounded-lg border border-orange-700/50 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-orange-300">
                {t.admin.ads.slotWatchPopunder}
              </span>
              <input
                value={settings.slotWatchPopunder}
                onChange={(event) => updateSettings({ slotWatchPopunder: event.target.value })}
                placeholder="https://...trafficstars.../pu-....js"
                className="w-full rounded-lg border border-orange-700/50 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-zinc-200">{t.admin.ads.pagesTitle}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {AD_PAGE_KEYS.map((page) => {
                const active = settings.pages[page];
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => togglePage(page)}
                    className={`rounded-xl border px-3 py-3 text-start transition-colors ${
                      active
                        ? "border-orange-500/50 bg-orange-950/30"
                        : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white">{pageLabels[page]}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          active ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {active ? t.admin.ads.on : t.admin.ads.off}
                      </span>
                    </div>
                    <PageWirePreview page={page} active={active && settings.enabled} />
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => void saveSettings()}
            disabled={saving}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? t.admin.ads.saving : t.admin.ads.save}
          </button>
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-lg font-bold text-white">{t.admin.ads.livePreviewTitle}</h2>
          <p className="text-sm text-zinc-400">{t.admin.ads.livePreviewSubtitle}</p>

          <ReelsTimelinePreview
            everyN={settings.reelsEveryNVideos}
            enabled={settings.enabled && settings.pages.videoReels}
          />

          <div className="rounded-2xl border border-zinc-800 bg-black p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {t.admin.ads.reelsPhoneTitle}
            </p>
            <div className="mx-auto max-w-[220px] rounded-[1.75rem] border-[3px] border-zinc-700 bg-zinc-950 p-2 shadow-2xl">
              <div className="mb-2 h-1.5 w-16 rounded-full bg-zinc-800 mx-auto" />
              <div className="space-y-1.5">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={`v-${index}`} className="flex h-24 items-end rounded-xl bg-zinc-800 p-2">
                    <div className="h-2 w-16 rounded bg-zinc-600" />
                  </div>
                ))}
                {settings.enabled && settings.pages.videoReels ? (
                  <div className="flex h-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-500/70 bg-amber-950/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                      {t.admin.ads.previewAdBlock}
                    </span>
                    <span className="mt-1 text-[9px] text-zinc-500">
                      {t.admin.ads.reelsIntervalValue.replace("{n}", String(settings.reelsEveryNVideos))}
                    </span>
                  </div>
                ) : null}
                <div className="flex h-24 items-end rounded-xl bg-zinc-800 p-2">
                  <div className="h-2 w-16 rounded bg-zinc-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(["blog", "videos"] as const).map((page) => (
              <div key={page} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                <p className="mb-2 text-xs font-bold text-zinc-300">{pageLabels[page]}</p>
                <PageWirePreview
                  page={page}
                  active={settings.enabled && settings.pages[page]}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
