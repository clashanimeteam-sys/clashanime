export type CatalogCard = {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  score: number | null;
  malUrl: string;
  kind: "anime" | "manga" | "character";
};

const ANILIST = "https://graphql.anilist.co";

type AniMedia = {
  id: number;
  idMal?: number | null;
  title?: { romaji?: string | null; english?: string | null; native?: string | null } | null;
  coverImage?: { large?: string | null; medium?: string | null } | null;
  averageScore?: number | null;
  siteUrl?: string | null;
  staff?: { nodes?: Array<{ name?: { full?: string | null } | null }> | null } | null;
};

type AniCharacter = {
  id: number;
  name?: { full?: string | null; native?: string | null } | null;
  image?: { large?: string | null; medium?: string | null } | null;
  siteUrl?: string | null;
  favourites?: number | null;
};

async function anilistQuery<T>(query: string, variables: Record<string, unknown>): Promise<T | null> {
  try {
    const response = await fetch(ANILIST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: T; errors?: unknown };
    if (payload.errors || !payload.data) return null;
    return payload.data;
  } catch {
    return null;
  }
}

function mediaTitle(media: AniMedia): string {
  return (
    media.title?.english?.trim() ||
    media.title?.romaji?.trim() ||
    media.title?.native?.trim() ||
    "Untitled"
  );
}

function mapMedia(media: AniMedia, kind: "anime" | "manga"): CatalogCard {
  const malId = media.idMal ?? media.id;
  return {
    id: media.id,
    title: mediaTitle(media),
    subtitle:
      kind === "manga"
        ? media.staff?.nodes?.[0]?.name?.full?.trim() || media.title?.native?.trim() || null
        : media.title?.native?.trim() || null,
    imageUrl: media.coverImage?.large ?? media.coverImage?.medium ?? null,
    score: media.averageScore != null ? media.averageScore / 10 : null,
    malUrl:
      media.idMal != null
        ? `https://myanimelist.net/${kind}/${media.idMal}`
        : media.siteUrl ?? `https://anilist.co/${kind}/${media.id}`,
    kind,
  };
}

/** Curated fallback if AniList is unreachable — still discovery links only. */
const FALLBACK_ANIME: CatalogCard[] = [
  {
    id: 16498,
    title: "Attack on Titan",
    subtitle: "進撃の巨人",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-C6FPmWm59CyP.jpg",
    score: 8.5,
    malUrl: "https://myanimelist.net/anime/16498",
    kind: "anime",
  },
  {
    id: 21,
    title: "One Piece",
    subtitle: "ワンピース",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21-tXMjxckHypTn.jpg",
    score: 8.7,
    malUrl: "https://myanimelist.net/anime/21",
    kind: "anime",
  },
  {
    id: 1535,
    title: "Death Note",
    subtitle: "デスノート",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-lawC9xlI29aC.jpg",
    score: 8.6,
    malUrl: "https://myanimelist.net/anime/1535",
    kind: "anime",
  },
  {
    id: 5114,
    title: "Fullmetal Alchemist: Brotherhood",
    subtitle: "鋼の錬金術師",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-K56SVQXeBMKT.jpg",
    score: 9.1,
    malUrl: "https://myanimelist.net/anime/5114",
    kind: "anime",
  },
  {
    id: 11061,
    title: "Hunter x Hunter (2011)",
    subtitle: "ハンター×ハンター",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-sIpBprNRfzq8.jpg",
    score: 9.0,
    malUrl: "https://myanimelist.net/anime/11061",
    kind: "anime",
  },
  {
    id: 40748,
    title: "Jujutsu Kaisen",
    subtitle: "呪術廻戦",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx40748-XuJ4MnJBZRaZ.jpg",
    score: 8.6,
    malUrl: "https://myanimelist.net/anime/40748",
    kind: "anime",
  },
];

const FALLBACK_MANGA: CatalogCard[] = [
  {
    id: 13,
    title: "One Piece",
    subtitle: "Eiichiro Oda",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx30013-ulXLnYiMGyF2.jpg",
    score: 9.2,
    malUrl: "https://myanimelist.net/manga/13",
    kind: "manga",
  },
  {
    id: 2,
    title: "Berserk",
    subtitle: "Kentaro Miura",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx30002-7LzWAeq6NV8B.png",
    score: 9.4,
    malUrl: "https://myanimelist.net/manga/2",
    kind: "manga",
  },
  {
    id: 1706,
    title: "JoJo's Bizarre Adventure Part 7: Steel Ball Run",
    subtitle: "Hirohiko Araki",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx30016-AwNRxSUb9LQa.png",
    score: 9.3,
    malUrl: "https://myanimelist.net/manga/1706",
    kind: "manga",
  },
  {
    id: 656,
    title: "Vagabond",
    subtitle: "Takehiko Inoue",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx30365-OiLJtfmULHxR.jpg",
    score: 9.2,
    malUrl: "https://myanimelist.net/manga/656",
    kind: "manga",
  },
  {
    id: 23390,
    title: "Shingeki no Kyojin",
    subtitle: "Hajime Isayama",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx53390-1RsuABC34P9D.jpg",
    score: 8.5,
    malUrl: "https://myanimelist.net/manga/23390",
    kind: "manga",
  },
  {
    id: 44347,
    title: "Kimetsu no Yaiba",
    subtitle: "Koyoharu Gotouge",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx87216-c9bSNVXvKt5z.jpg",
    score: 8.2,
    malUrl: "https://myanimelist.net/manga/44347",
    kind: "manga",
  },
];

const FALLBACK_CHARACTERS: CatalogCard[] = [
  {
    id: 417,
    title: "Luffy",
    subtitle: "Monkey D. Luffy",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/character/large/b40-ZxXhZqGxJrYk.png",
    score: null,
    malUrl: "https://myanimelist.net/character/40",
    kind: "character",
  },
  {
    id: 40,
    title: "Levi",
    subtitle: "Levi Ackerman",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/character/large/b45627-Vp5mHxT5YYst.png",
    score: null,
    malUrl: "https://myanimelist.net/character/45627",
    kind: "character",
  },
  {
    id: 5,
    title: "Goku",
    subtitle: "Son Goku",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/character/large/b246-nJgGJ9k988TD.png",
    score: null,
    malUrl: "https://myanimelist.net/character/246",
    kind: "character",
  },
  {
    id: 11,
    title: "Naruto Uzumaki",
    subtitle: "うずまきナルト",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/character/large/b17-IazGpHge7hAy.png",
    score: null,
    malUrl: "https://myanimelist.net/character/17",
    kind: "character",
  },
  {
    id: 62,
    title: "Light Yagami",
    subtitle: "夜神月",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/character/large/b71-2xqJfY9Yq9Y9.png",
    score: null,
    malUrl: "https://myanimelist.net/character/71",
    kind: "character",
  },
  {
    id: 80,
    title: "Edward Elric",
    subtitle: "エドワード・エルリック",
    imageUrl: "https://s4.anilist.co/file/anilistcdn/character/large/b11-WQcC20PJYKMh.png",
    score: null,
    malUrl: "https://myanimelist.net/character/11",
    kind: "character",
  },
];

export async function fetchTopAnimeCatalog(limit = 24): Promise<CatalogCard[]> {
  const data = await anilistQuery<{
    Page?: { media?: AniMedia[] };
  }>(
    `query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          id
          idMal
          title { romaji english native }
          coverImage { large medium }
          averageScore
          siteUrl
        }
      }
    }`,
    { page: 1, perPage: Math.min(limit, 50) },
  );

  const rows = data?.Page?.media ?? [];
  if (rows.length === 0) return FALLBACK_ANIME.slice(0, limit);
  return rows.slice(0, limit).map((row) => mapMedia(row, "anime"));
}

export async function fetchTopMangaCatalog(limit = 24): Promise<CatalogCard[]> {
  const data = await anilistQuery<{
    Page?: { media?: AniMedia[] };
  }>(
    `query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: MANGA, sort: POPULARITY_DESC, isAdult: false) {
          id
          idMal
          title { romaji english native }
          coverImage { large medium }
          averageScore
          siteUrl
          staff(sort: RELEVANCE, perPage: 1) {
            nodes { name { full } }
          }
        }
      }
    }`,
    { page: 1, perPage: Math.min(limit, 50) },
  );

  const rows = data?.Page?.media ?? [];
  if (rows.length === 0) return FALLBACK_MANGA.slice(0, limit);
  return rows.slice(0, limit).map((row) => mapMedia(row, "manga"));
}

export async function fetchTopCharactersCatalog(limit = 24): Promise<CatalogCard[]> {
  const data = await anilistQuery<{
    Page?: { characters?: AniCharacter[] };
  }>(
    `query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        characters(sort: FAVOURITES_DESC) {
          id
          name { full native }
          image { large medium }
          siteUrl
          favourites
        }
      }
    }`,
    { page: 1, perPage: Math.min(limit, 50) },
  );

  const rows = data?.Page?.characters ?? [];
  if (rows.length === 0) return FALLBACK_CHARACTERS.slice(0, limit);

  return rows.slice(0, limit).map((row) => ({
    id: row.id,
    title: row.name?.full?.trim() || "Character",
    subtitle: row.name?.native?.trim() || null,
    imageUrl: row.image?.large ?? row.image?.medium ?? null,
    score: null,
    malUrl: row.siteUrl ?? `https://anilist.co/character/${row.id}`,
    kind: "character" as const,
  }));
}
