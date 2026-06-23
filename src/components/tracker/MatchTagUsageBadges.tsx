"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { CLASHANIME_HASHTAG, normalizeMatchTagsForDisplay } from "@/lib/animeTracker";
import { useLocale } from "@/providers/LocaleProvider";

type MatchTagUsageBadgesProps = {
  tags: string[];
  title?: string;
  maxTags?: number;
  className?: string;
};

export function MatchTagUsageBadges({
  tags,
  title,
  maxTags = 6,
  className = "",
}: MatchTagUsageBadgesProps) {
  const { t, formatNumber } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const normalizedTags = useMemo(
    () => normalizeMatchTagsForDisplay(tags, title).slice(0, maxTags),
    [tags, title, maxTags],
  );
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

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

  const copyTag = useCallback(
    async (tag: string) => {
      const value = `#${tag}`;
      try {
        await navigator.clipboard.writeText(value);
        setCopiedTag(tag);
        window.setTimeout(() => setCopiedTag((current) => (current === tag ? null : current)), 1600);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopiedTag(tag);
        window.setTimeout(() => setCopiedTag((current) => (current === tag ? null : current)), 1600);
      }
    },
    [],
  );

  if (normalizedTags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {normalizedTags.map((tag) => {
        const isPrimary = tag === CLASHANIME_HASHTAG;
        const copied = copiedTag === tag;

        return (
          <span
            key={tag}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
              isPrimary
                ? "border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-500/50 dark:bg-orange-950/40 dark:text-orange-200"
                : "border-zinc-300 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300"
            }`}
          >
            <span>#{tag}</span>
            <span className="text-[10px] opacity-70">
              · {t.upload.hashtagUsageCount.replace("{count}", formatNumber(counts[tag] ?? 0))}
            </span>
            <button
              type="button"
              onClick={() => void copyTag(tag)}
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide transition ${
                copied
                  ? "bg-emerald-500 text-white"
                  : isPrimary
                    ? "bg-orange-200/80 text-orange-900 hover:bg-orange-300 dark:bg-orange-800/60 dark:text-orange-100 dark:hover:bg-orange-700/70"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              }`}
              aria-label={t.animeTracker.copyHashtag.replace("{tag}", `#${tag}`)}
            >
              {copied ? t.animeTracker.copyHashtagDone : t.animeTracker.copyHashtag}
            </button>
          </span>
        );
      })}
    </div>
  );
}
