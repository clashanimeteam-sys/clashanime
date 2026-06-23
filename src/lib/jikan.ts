const JIKAN_API = "https://api.jikan.moe/v4";
const JST = "Asia/Tokyo";
const MAX_SCHEDULE_PAGES = 1;
const WEEKDAY_FETCH_DELAY_MS = 350;

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type JikanWeekday = (typeof WEEKDAYS)[number];

export type JikanAnimeEntry = {
  malId: number;
  title: string;
  titleEnglish: string | null;
  titleJapanese: string | null;
  posterUrl: string | null;
  score: number | null;
  rank: number | null;
  genres: string[];
  releaseDate: string;
  airsAt: string | null;
  broadcastLabel: string | null;
  status: string;
  episodeNumber: number;
  matchTags: string[];
  malUrl: string;
  synopsisEn?: string | null;
  synopsisAr?: string | null;
  synopsisJa?: string | null;
};

type JikanAnimeRow = {
  mal_id: number;
  url: string;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images?: {
    jpg?: { large_image_url?: string | null; image_url?: string | null };
  };
  score: number | null;
  rank: number | null;
  genres?: Array<{ name: string }>;
  status: string;
  episodes: number | null;
  broadcast?: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  aired?: {
    from: string | null;
  };
};

type JikanListResponse = {
  data: JikanAnimeRow[];
  pagination?: {
    has_next_page?: boolean;
    last_visible_page?: number;
  };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function buildMatchTags(row: JikanAnimeRow): string[] {
  const tags = new Set<string>();
  for (const value of [row.title_english, row.title, row.title_japanese]) {
    if (!value) continue;
    const slug = slugify(value);
    if (slug) tags.add(slug);
  }
  return [...tags];
}

function pickTitle(row: JikanAnimeRow): string {
  return row.title_english?.trim() || row.title?.trim() || row.title_japanese?.trim() || "Unknown";
}

function estimateEpisode(row: JikanAnimeRow, releaseDate: string): number {
  if (!row.aired?.from) return 1;
  const start = new Date(row.aired.from);
  const target = new Date(`${releaseDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(target.getTime()) || target < start) {
    return 1;
  }
  const weeks = Math.floor((target.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return Math.max(1, weeks + 1);
}

function buildAirsAt(releaseDate: string, row: JikanAnimeRow): string | null {
  const time = row.broadcast?.time?.trim();
  if (!time) return null;
  return `${releaseDate}T${time}:00+09:00`;
}

export function getJstDateParts(date = new Date()): { date: string; weekday: JikanWeekday } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: JST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: JST,
    weekday: "long",
  });
  const dateStr = formatter.format(date);
  const weekdayName = weekdayFormatter.format(date).toLowerCase() as JikanWeekday;
  return { date: dateStr, weekday: weekdayName };
}

export function addDaysToIsoDate(isoDate: string, days: number): string {
  const base = new Date(`${isoDate}T12:00:00Z`);
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

function weekdayFromIsoDate(isoDate: string): JikanWeekday {
  const day = new Date(`${isoDate}T12:00:00Z`).getUTCDay();
  return WEEKDAYS[day];
}

function mapRow(row: JikanAnimeRow, releaseDate: string): JikanAnimeEntry {
  return {
    malId: row.mal_id,
    title: pickTitle(row),
    titleEnglish: row.title_english,
    titleJapanese: row.title_japanese,
    posterUrl: row.images?.jpg?.large_image_url ?? row.images?.jpg?.image_url ?? null,
    score: row.score,
    rank: row.rank,
    genres: (row.genres ?? []).map((genre) => genre.name).filter(Boolean),
    releaseDate,
    airsAt: buildAirsAt(releaseDate, row),
    broadcastLabel: row.broadcast?.string ?? null,
    status: row.status,
    episodeNumber: estimateEpisode(row, releaseDate),
    matchTags: buildMatchTags(row),
    malUrl: row.url,
  };
}

async function fetchJikanSchedulePage(weekday: JikanWeekday, page: number): Promise<JikanListResponse> {
  const url = `${JIKAN_API}/schedules/${weekday}?page=${page}&limit=25&sfw`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (response.status === 429) {
    await sleep(1200);
    return fetchJikanSchedulePage(weekday, page);
  }

  if (!response.ok) {
    throw new Error(`Jikan API error (${weekday} p${page}): ${response.status}`);
  }

  return (await response.json()) as JikanListResponse;
}

export async function fetchJikanWeekdaySchedule(weekday: JikanWeekday): Promise<JikanAnimeRow[]> {
  const rows: JikanAnimeRow[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext && page <= MAX_SCHEDULE_PAGES) {
    const payload = await fetchJikanSchedulePage(weekday, page);
    rows.push(...(payload.data ?? []));
    hasNext = Boolean(payload.pagination?.has_next_page);
    page += 1;
    if (hasNext) await sleep(WEEKDAY_FETCH_DELAY_MS);
  }

  return rows;
}

export async function fetchJikanTodaySchedule(): Promise<JikanAnimeEntry[]> {
  const { date, weekday } = getJstDateParts();
  const rows = await fetchJikanWeekdaySchedule(weekday);
  return rows.map((row) => mapRow(row, date));
}

export async function fetchJikanUpcomingSchedule(daysAhead = 7): Promise<JikanAnimeEntry[]> {
  const { date: today } = getJstDateParts();
  const weekdaysNeeded = new Set<JikanWeekday>();

  for (let offset = 1; offset <= daysAhead; offset += 1) {
    weekdaysNeeded.add(weekdayFromIsoDate(addDaysToIsoDate(today, offset)));
  }

  const weekdayCache = new Map<JikanWeekday, JikanAnimeRow[]>();
  for (const weekday of weekdaysNeeded) {
    weekdayCache.set(weekday, await fetchJikanWeekdaySchedule(weekday));
    await sleep(WEEKDAY_FETCH_DELAY_MS);
  }

  const entries: JikanAnimeEntry[] = [];
  const seen = new Set<string>();

  for (let offset = 1; offset <= daysAhead; offset += 1) {
    const releaseDate = addDaysToIsoDate(today, offset);
    const weekday = weekdayFromIsoDate(releaseDate);

    for (const row of weekdayCache.get(weekday) ?? []) {
      const key = `${row.mal_id}:${releaseDate}`;
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push(mapRow(row, releaseDate));
    }
  }

  return entries.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
}

export async function fetchJikanAiringSchedule(daysAhead = 7): Promise<JikanAnimeEntry[]> {
  const [today, upcoming] = await Promise.all([
    fetchJikanTodaySchedule(),
    fetchJikanUpcomingSchedule(daysAhead),
  ]);
  return [...today, ...upcoming];
}

type JikanAnimeDetailResponse = {
  data?: { synopsis?: string | null };
};

const SYNOPSIS_FETCH_DELAY_MS = 350;

export async function fetchJikanAnimeSynopsis(malId: number): Promise<string | null> {
  if (!malId) return null;

  const response = await fetch(`${JIKAN_API}/anime/${malId}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  });

  if (response.status === 429) {
    await sleep(1200);
    return fetchJikanAnimeSynopsis(malId);
  }

  if (!response.ok) return null;

  const payload = (await response.json()) as JikanAnimeDetailResponse;
  const synopsis = payload.data?.synopsis?.trim();
  return synopsis || null;
}

export async function fetchJikanSynopsisMap(malIds: number[]): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  const uniqueIds = [...new Set(malIds.filter((id) => id > 0))];

  for (const malId of uniqueIds) {
    const synopsis = await fetchJikanAnimeSynopsis(malId);
    if (synopsis) map.set(malId, synopsis);
    await sleep(SYNOPSIS_FETCH_DELAY_MS);
  }

  return map;
}
