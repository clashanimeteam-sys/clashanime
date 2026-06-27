export type SeasonalLineupCategory = "new" | "returning" | "continuing" | "coming-soon";

export type SeasonalLineupEntry = {
  title: string;
  premiereDate: string | null;
  category: SeasonalLineupCategory;
  weekday?: string | null;
};

export function parseSeasonalLineup(raw: unknown): SeasonalLineupEntry[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item): SeasonalLineupEntry | null => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const title = typeof row.title === "string" ? row.title.trim() : "";
      if (!title) return null;

      const category = row.category;
      const validCategory: SeasonalLineupCategory =
        category === "returning" ||
        category === "continuing" ||
        category === "coming-soon"
          ? category
          : "new";

      return {
        title,
        premiereDate:
          typeof row.premiereDate === "string" && row.premiereDate.trim()
            ? row.premiereDate.trim()
            : null,
        category: validCategory,
        weekday:
          typeof row.weekday === "string" && row.weekday.trim() ? row.weekday.trim() : null,
      } satisfies SeasonalLineupEntry;
    })
    .filter((item): item is SeasonalLineupEntry => item !== null);
}

export function groupSeasonalLineup(entries: SeasonalLineupEntry[]) {
  const groups: Record<SeasonalLineupCategory, SeasonalLineupEntry[]> = {
    new: [],
    returning: [],
    continuing: [],
    "coming-soon": [],
  };

  for (const entry of entries) {
    groups[entry.category].push(entry);
  }

  const byDate = (a: SeasonalLineupEntry, b: SeasonalLineupEntry) => {
    if (!a.premiereDate && !b.premiereDate) return a.title.localeCompare(b.title);
    if (!a.premiereDate) return 1;
    if (!b.premiereDate) return -1;
    return a.premiereDate.localeCompare(b.premiereDate);
  };

  groups.new.sort(byDate);
  groups.returning.sort(byDate);
  groups.continuing.sort((a, b) => a.title.localeCompare(b.title));
  groups["coming-soon"].sort((a, b) => a.title.localeCompare(b.title));

  return groups;
}

export function formatSeasonalPremiereDate(
  date: string | null,
  locale: string,
  comingSoonLabel: string,
): string {
  if (!date) return comingSoonLabel;
  if (date === "coming-soon") return comingSoonLabel;

  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString(locale === "ja" ? "ja-JP" : locale === "ar" ? "ar" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
