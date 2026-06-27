"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import type { AnimeNewsArticle, AnimeNewsStatus } from "@/lib/animeNews/types";
import { getSeasonalLineup, isAnimeNewsPublishReady } from "@/lib/animeNews/types";
import { useLocale } from "@/providers/LocaleProvider";

type SyncMeta = {
  last_synced_at: string | null;
  draft_count: number;
  published_count: number;
};

export function AdminAnimeNewsPanel() {
  const { t, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [articles, setArticles] = useState<AnimeNewsArticle[]>([]);
  const [meta, setMeta] = useState<SyncMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);

    const [{ data, error: listError }, { data: metaRows, error: metaError }] = await Promise.all([
      supabase.rpc("list_anime_news_admin"),
      supabase.rpc("get_anime_news_sync_meta"),
    ]);

    if (listError) {
      setError(listError.message);
      setArticles([]);
    } else {
      setArticles((data as AnimeNewsArticle[]) ?? []);
    }

    if (!metaError && metaRows?.[0]) {
      setMeta(metaRows[0] as SyncMeta);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  const syncFeed = async () => {
    setSyncing(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/anime-news/sync", { method: "POST" });
      const payload = (await response.json()) as {
        error?: string;
        inserted?: number;
        updated?: number;
        featuredGuideSlug?: string | null;
        featuredLineupCount?: number;
        spotlightCount?: number;
        spotlightEnriched?: number;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Sync failed");
      }
      const parts = [
        t.admin.animeNews.syncSuccess
          .replace("{inserted}", String(payload.inserted ?? 0))
          .replace("{updated}", String(payload.updated ?? 0)),
      ];
      if (payload.featuredGuideSlug) {
        parts.push(
          t.admin.animeNews.featuredGuideSynced.replace("{slug}", payload.featuredGuideSlug),
        );
      }
      if (payload.featuredLineupCount) {
        parts.push(
          t.admin.animeNews.featuredLineupSynced.replace(
            "{count}",
            String(payload.featuredLineupCount),
          ),
        );
      }
      if (payload.spotlightCount) {
        parts.push(
          t.admin.animeNews.spotlightSynced
            .replace("{count}", String(payload.spotlightCount))
            .replace("{enriched}", String(payload.spotlightEnriched ?? 0)),
        );
      }
      setMessage(parts.join(" · "));
      await loadArticles();
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const saveArticle = async (article: AnimeNewsArticle, status?: AnimeNewsStatus) => {
    setSavingId(article.id);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/anime-news/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn: article.title_en,
          titleAr: article.title_ar ?? "",
          titleJa: article.title_ja ?? "",
          excerptEn: article.excerpt_en ?? "",
          excerptAr: article.excerpt_ar ?? "",
          excerptJa: article.excerpt_ja ?? "",
          storyEn: article.story_en ?? "",
          storyAr: article.story_ar ?? "",
          storyJa: article.story_ja ?? "",
          topics: article.topics,
          status: status ?? article.status,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Save failed");
      }

      setMessage(t.admin.animeNews.saved);
      await loadArticles();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  };

  const updateLocal = (id: string, patch: Partial<AnimeNewsArticle>) => {
    setArticles((current) =>
      current.map((article) => (article.id === id ? { ...article, ...patch } : article)),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{t.admin.animeNews.title}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.admin.animeNews.subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void syncFeed()}
          disabled={syncing}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
        >
          {syncing ? t.admin.animeNews.syncing : t.admin.animeNews.syncNow}
        </button>
        <Link
          href="/blog/anime-news"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          {t.admin.animeNews.openHub}
        </Link>
      </div>

      {meta ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t.admin.animeNews.meta
            .replace("{drafts}", String(meta.draft_count))
            .replace("{published}", String(meta.published_count))}
          {meta.last_synced_at
            ? ` · ${t.admin.animeNews.lastSync} ${formatDateTime(meta.last_synced_at, { dateStyle: "medium", timeStyle: "short" })}`
            : ""}
        </p>
      ) : null}

      {message ? <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-zinc-500">{t.admin.animeNews.loading}</p>
      ) : articles.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          {t.admin.animeNews.empty}
        </p>
      ) : (
        <div className="space-y-4">
          {[...articles]
            .sort((a, b) => {
              const aFeatured = a.is_featured ? 1 : 0;
              const bFeatured = b.is_featured ? 1 : 0;
              if (aFeatured !== bFeatured) return bFeatured - aFeatured;
              return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
            })
            .map((article) => {
            const expanded = expandedId === article.id;
            const ready = isAnimeNewsPublishReady(article);
            const lineup = getSeasonalLineup(article);

            return (
              <div
                key={article.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          article.status === "published"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {article.status}
                      </span>
                      {article.is_featured ? (
                        <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-700 dark:text-orange-300">
                          {t.admin.animeNews.featuredBadge}
                        </span>
                      ) : null}
                      {lineup.length > 0 ? (
                        <span className="rounded-full bg-zinc-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-300">
                          {t.admin.animeNews.lineupCount.replace("{count}", String(lineup.length))}
                        </span>
                      ) : null}
                      {!ready ? (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                          {t.admin.animeNews.needsTranslation}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-2 font-semibold text-zinc-900 dark:text-white">{article.title_en}</h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatDateTime(article.published_at, { dateStyle: "medium" })}
                      {" · "}
                      /blog/anime-news/{article.slug}
                      {lineup.length > 0
                        ? ` · ${t.admin.animeNews.lineupCount.replace("{count}", String(lineup.length))}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : article.id)}
                      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold dark:border-zinc-700"
                    >
                      {expanded ? t.admin.animeNews.collapse : t.admin.animeNews.edit}
                    </button>
                    {article.status === "published" ? (
                      <>
                        <Link
                          href={`/blog/anime-news/${article.slug}`}
                          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold dark:border-zinc-700"
                        >
                          {t.admin.animeNews.viewOnSite}
                        </Link>
                        {article.is_featured ? (
                          <Link
                            href="/blog#seasonal-guide"
                            className="rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-700 dark:text-orange-300"
                          >
                            {t.admin.animeNews.viewOnBlog}
                          </Link>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>

                {expanded ? (
                  <div className="mt-4 space-y-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                    {(["en", "ar", "ja"] as const).map((lang) => {
                      const titleKey =
                        lang === "en" ? "title_en" : lang === "ar" ? "title_ar" : "title_ja";
                      const excerptKey =
                        lang === "en" ? "excerpt_en" : lang === "ar" ? "excerpt_ar" : "excerpt_ja";
                      const storyKey =
                        lang === "en" ? "story_en" : lang === "ar" ? "story_ar" : "story_ja";

                      return (
                        <div key={lang} className="grid gap-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            {lang.toUpperCase()}
                          </label>
                          <input
                            value={article[titleKey] ?? ""}
                            onChange={(event) =>
                              updateLocal(article.id, { [titleKey]: event.target.value })
                            }
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                            placeholder={t.admin.animeNews.titlePlaceholder}
                          />
                          <textarea
                            value={article[excerptKey] ?? ""}
                            onChange={(event) =>
                              updateLocal(article.id, { [excerptKey]: event.target.value })
                            }
                            rows={2}
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                            placeholder={t.admin.animeNews.excerptPlaceholder}
                          />
                          <textarea
                            value={article[storyKey] ?? ""}
                            onChange={(event) =>
                              updateLocal(article.id, { [storyKey]: event.target.value })
                            }
                            rows={6}
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                            placeholder={t.admin.animeNews.storyPlaceholder}
                          />
                        </div>
                      );
                    })}

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        {t.admin.animeNews.topics}
                      </label>
                      <input
                        value={article.topics.join(", ")}
                        onChange={(event) =>
                          updateLocal(article.id, {
                            topics: event.target.value.split(",").map((topic) => topic.trim()),
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                        placeholder="anime-news, latest-news"
                      />
                    </div>

                    {lineup.length > 0 ? (
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          {t.admin.animeNews.lineupPreview}
                        </p>
                        <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto text-xs text-zinc-700 dark:text-zinc-300">
                          {lineup.slice(0, 12).map((entry) => (
                            <li key={entry.title} className="flex gap-2">
                              {entry.posterUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={entry.posterUrl}
                                  alt=""
                                  className="h-12 w-8 shrink-0 rounded object-cover"
                                />
                              ) : null}
                              <span>
                                {entry.title}
                                {entry.premiereDate && entry.premiereDate !== "coming-soon"
                                  ? ` · ${entry.premiereDate}`
                                  : ""}
                                {entry.story ? (
                                  <span className="mt-0.5 block line-clamp-2 text-zinc-500">{entry.story}</span>
                                ) : null}
                              </span>
                            </li>
                          ))}
                          {lineup.length > 12 ? (
                            <li className="text-zinc-500">
                              {t.admin.animeNews.lineupMore.replace(
                                "{count}",
                                String(lineup.length - 12),
                              )}
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={savingId === article.id}
                        onClick={() => void saveArticle(article, "draft")}
                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-700"
                      >
                        {savingId === article.id ? t.admin.animeNews.saving : t.admin.animeNews.saveDraft}
                      </button>
                      <button
                        type="button"
                        disabled={savingId === article.id || !ready}
                        onClick={() => void saveArticle(article, "published")}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {t.admin.animeNews.publish}
                      </button>
                      <a
                        href={article.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold dark:border-zinc-700"
                      >
                        {t.admin.animeNews.sourceLink}
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
