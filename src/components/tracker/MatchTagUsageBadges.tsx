"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type MatchTagUsageBadgesProps = {
  tags: string[];
  maxTags?: number;
  className?: string;
};

export function MatchTagUsageBadges({ tags, maxTags = 4, className = "" }: MatchTagUsageBadgesProps) {
  const { t, formatNumber } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const normalizedTags = useMemo(
    () =>
      [...new Set(tags.map((tag) => tag.trim().replace(/^#+/, "").toLowerCase()).filter(Boolean))].slice(
        0,
        maxTags,
      ),
    [tags, maxTags],
  );
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!supabase || normalizedTags.length === 0) {
      setCounts({});
      return;
    }

    let cancelled = false;

    void (async () => {
      const { data, error } = await supabase.rpc("get_hashtag_usage_counts", {
        p_tags: normalizedTags,
      });

      if (cancelled || error || !data) return;

      const next: Record<string, number> = {};
      for (const row of data as Array<{ tag: string; usage_count: number }>) {
        next[row.tag] = Number(row.usage_count ?? 0);
      }
      setCounts(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase, normalizedTags]);

  if (normalizedTags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {normalizedTags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300"
        >
          #{tag} · {t.upload.hashtagUsageCount.replace("{count}", formatNumber(counts[tag] ?? 0))}
        </span>
      ))}
    </div>
  );
}
