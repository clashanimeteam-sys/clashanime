const ANILIST_API = "https://graphql.anilist.co";

type AniListMediaTitle = {
  romaji: string | null;
  english: string | null;
  native: string | null;
};

type AniListScheduleRow = {
  airingAt: number;
  episode: number;
  media: {
    id: number;
    title: AniListMediaTitle;
    coverImage: { large: string | null } | null;
  };
};

type AniListPageResponse = {
  data?: {
    Page?: {
      airingSchedules?: AniListScheduleRow[];
      pageInfo?: { hasNextPage: boolean; currentPage: number };
    };
  };
  errors?: Array<{ message: string }>;
};

export type AniListAiringEntry = {
  anilistId: number;
  title: string;
  titleJa: string | null;
  episodeNumber: number;
  airsAt: string;
  releaseDate: string;
  posterUrl: string | null;
  matchTags: string[];
};

function pickTitle(title: AniListMediaTitle): { primary: string; native: string | null } {
  const primary = title.english?.trim() || title.romaji?.trim() || title.native?.trim() || "Unknown";
  const native = title.native?.trim() || null;
  return { primary, native };
}

function buildTags(title: AniListMediaTitle): string[] {
  const tags = new Set<string>();
  for (const value of [title.english, title.romaji, title.native]) {
    if (!value) continue;
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (slug) tags.add(slug);
  }
  return [...tags];
}

async function fetchAniListPage(start: number, end: number, page: number): Promise<AniListScheduleRow[]> {
  const query = `
    query ($start: Int, $end: Int, $page: Int) {
      Page(page: $page, perPage: 50) {
        pageInfo { hasNextPage currentPage }
        airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
          airingAt
          episode
          media {
            id
            title { romaji english native }
            coverImage { large }
          }
        }
      }
    }
  `;

  const response = await fetch(ANILIST_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables: { start, end, page } }),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.status}`);
  }

  const payload = (await response.json()) as AniListPageResponse;
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload.data?.Page?.airingSchedules ?? [];
}

export async function fetchAniListAiringSchedule(daysAhead = 14): Promise<AniListAiringEntry[]> {
  const now = Math.floor(Date.now() / 1000);
  const end = now + daysAhead * 24 * 60 * 60;
  const entries: AniListAiringEntry[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= 5; page += 1) {
    const rows = await fetchAniListPage(now - 24 * 60 * 60, end, page);
    if (!rows.length) break;

    for (const row of rows) {
      const key = `${row.media.id}:${row.episode}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const { primary, native } = pickTitle(row.media.title);
      const airsAt = new Date(row.airingAt * 1000).toISOString();
      const releaseDate = airsAt.slice(0, 10);

      entries.push({
        anilistId: row.media.id,
        title: primary,
        titleJa: native,
        episodeNumber: row.episode,
        airsAt,
        releaseDate,
        posterUrl: row.media.coverImage?.large ?? null,
        matchTags: buildTags(row.media.title),
      });
    }

    if (rows.length < 50) break;
  }

  return entries.sort((a, b) => a.airsAt.localeCompare(b.airsAt));
}
