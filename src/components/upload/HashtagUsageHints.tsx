"use client";

import { useEffect, useMemo, useState } from "react";
import { searchHashtags } from "@/lib/hashtagSearch";
import { parseHashtags } from "@/lib/upload";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type HashtagUsageHintsProps = {
  value: string;
};

export function HashtagUsageHints({ value }: HashtagUsageHintsProps) {
  const { t, formatNumber } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const tags = useMemo(() => parseHashtags(value), [value]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!supabase || tags.length === 0) {
      setCounts({});
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        const next: Record<string, number> = {};
        await Promise.all(
          tags.map(async (tag) => {
            const rows = await searchHashtags(supabase, tag, 1);
            const match = rows.find((row) => row.tag === tag);
            next[tag] = Number(match?.usage_count ?? 0);
          }),
        );
        if (!cancelled) setCounts(next);
      })();
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [supabase, tags]);

  if (tags.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
        >
          #{tag} · {t.upload.hashtagUsageCount.replace("{count}", formatNumber(counts[tag] ?? 0))}
        </span>
      ))}
    </div>
  );
}
