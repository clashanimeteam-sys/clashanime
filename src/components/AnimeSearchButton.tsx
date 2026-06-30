"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimeSearchResult } from "@/lib/animeSearch.server";
import { useLocale } from "@/providers/LocaleProvider";

type AnimeSearchButtonProps = {
  tone?: "default" | "dark";
};

function localizedTitle(hit: AnimeSearchResult, locale: "en" | "ja" | "ar"): string {
  if (locale === "ja" && hit.titleJapanese) return hit.titleJapanese;
  if (hit.titleEnglish) return hit.titleEnglish;
  return hit.title;
}

export function AnimeSearchButton({ tone = "default" }: AnimeSearchButtonProps) {
  const { t, locale, formatNumber } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const trimmedQuery = query.trim();
  const buttonClass =
    tone === "dark"
      ? "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 transition-colors hover:bg-zinc-900"
      : "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-950";

  const iconClass =
    tone === "dark"
      ? "h-5 w-5 text-zinc-200"
      : "h-5 w-5 text-zinc-700 dark:text-zinc-200";

  const runSearch = useCallback(async (value: string) => {
    const term = value.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/anime/search?q=${encodeURIComponent(term)}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as { results?: AnimeSearchResult[] };
      setResults(payload.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      void runSearch(trimmedQuery);
    }, 280);

    return () => window.clearTimeout(timer);
  }, [open, trimmedQuery, runSearch]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={buttonClass}
        aria-label={t.animeSearch.buttonLabel}
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={iconClass}
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>

      {open ? (
        <div className="absolute end-0 top-full z-[10040] mt-2 w-[min(92vw,420px)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{t.animeSearch.title}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{t.animeSearch.hint}</p>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.animeSearch.placeholder}
              className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-black outline-none transition-colors placeholder:text-zinc-400 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
            {loading ? (
              <p className="px-3 py-4 text-sm text-zinc-500">{t.animeSearch.loading}</p>
            ) : trimmedQuery.length < 2 ? null : results.length === 0 ? (
              <p className="px-3 py-4 text-sm text-zinc-500">{t.animeSearch.empty}</p>
            ) : (
              <ul className="space-y-1">
                {results.map((hit) => {
                  const title = localizedTitle(hit, locale);
                  const clipsHref = `/videos?q=${encodeURIComponent(title)}`;

                  return (
                    <li
                      key={hit.malId}
                      className="rounded-xl border border-transparent p-2 transition-colors hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/80"
                    >
                      <div className="flex gap-3">
                        <Link
                          href={hit.guidePath}
                          onClick={() => setOpen(false)}
                          className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-200 ring-1 ring-transparent transition hover:ring-orange-500/50 dark:bg-zinc-800"
                          aria-label={`${t.animeSearch.openGuide}: ${title}`}
                        >
                          {hit.posterUrl ? (
                            <Image
                              src={hit.posterUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="44px"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-lg" aria-hidden>
                              📺
                            </div>
                          )}
                        </Link>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={hit.guidePath}
                            onClick={() => setOpen(false)}
                            className="block truncate text-sm font-semibold text-zinc-900 transition hover:text-orange-500 dark:text-white dark:hover:text-orange-300"
                          >
                            {title}
                          </Link>
                          {hit.score ? (
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {t.animeSearch.scoreLabel.replace("{score}", formatNumber(hit.score))}
                            </p>
                          ) : null}

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <Link
                              href={hit.guidePath}
                              onClick={() => setOpen(false)}
                              className="rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold text-orange-600 transition hover:bg-orange-500/20 dark:text-orange-300"
                            >
                              {t.animeSearch.openGuide}
                            </Link>
                            <Link
                              href={clipsHref}
                              onClick={() => setOpen(false)}
                              className="rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 transition hover:border-accent hover:text-accent dark:border-zinc-600 dark:text-zinc-200"
                            >
                              {t.animeSearch.viewClips}
                            </Link>
                            <Link
                              href="/tracker"
                              onClick={() => setOpen(false)}
                              className="rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 transition hover:border-accent hover:text-accent dark:border-zinc-600 dark:text-zinc-200"
                            >
                              {t.animeSearch.viewTracker}
                            </Link>
                            {hit.clashId ? (
                              <Link
                                href={`/tracker/clash/${hit.clashId}`}
                                onClick={() => setOpen(false)}
                                className="rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold text-orange-600 transition hover:bg-orange-500/20 dark:text-orange-300"
                              >
                                {t.animeSearch.openClash}
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
