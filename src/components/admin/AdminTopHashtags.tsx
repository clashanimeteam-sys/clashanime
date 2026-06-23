"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildHashtagPath } from "@/lib/hashtagUrls";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type TopHashtagRow = {
  tag: string;
  usageCount: number;
  channelCount: number;
};

type AdminTopHashtagsProps = {
  limit?: number;
  className?: string;
};

export function AdminTopHashtags({ limit = 12, className = "" }: AdminTopHashtagsProps) {
  const { t, formatNumber } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [rows, setRows] = useState<TopHashtagRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    void (async () => {
      const { data, error } = await supabase.rpc("list_top_hashtags", { p_limit: limit });
      if (error || !data) {
        setRows([]);
        setLoading(false);
        return;
      }

      setRows(
        (data as Array<{ tag: string; usage_count: number; channel_count: number }>).map((row) => ({
          tag: row.tag,
          usageCount: Number(row.usage_count ?? 0),
          channelCount: Number(row.channel_count ?? 0),
        })),
      );
      setLoading(false);
    })();
  }, [supabase, limit]);

  return (
    <section className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{t.admin.hashtags.title}</h2>
          <p className="mt-1 text-sm text-zinc-400">{t.admin.hashtags.subtitle}</p>
        </div>
        <Link
          href="/admin/anime-tracker"
          className="text-xs font-semibold uppercase tracking-wide text-orange-300 hover:text-orange-200"
        >
          {t.admin.animeTracker.title}
        </Link>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-zinc-500">{t.admin.loading}</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{t.admin.hashtags.empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-800">
          {rows.map((row) => (
            <li key={row.tag} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold text-white">#{row.tag}</p>
                <p className="text-xs text-zinc-400">
                  {t.hashtag.statsLine
                    .replace("{videos}", formatNumber(row.usageCount))
                    .replace("{channels}", formatNumber(row.channelCount))}
                </p>
              </div>
              <Link
                href={buildHashtagPath(row.tag)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-orange-500/50 hover:text-orange-200"
              >
                {t.admin.hashtags.viewPage}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
