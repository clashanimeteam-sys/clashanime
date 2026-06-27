import type { AnimeNewsArticle } from "@/lib/animeNews/types";
import { buildSummer2026SeasonalLineup } from "@/lib/animeNews/summer2026Lineup";

export const FEATURED_SEASONAL_GUIDE_SLUG = "summer-anime-2026-crunchyroll";

export const FEATURED_SEASONAL_GUIDE = {
  slug: FEATURED_SEASONAL_GUIDE_SLUG,
  sourceGuid: "clashanime:featured:summer-anime-2026-crunchyroll",
  sourceUrl:
    "https://www.crunchyroll.com/ar/news/seasonal-lineup/2026/6/17/summer-anime-2026-crunchyroll",
  publishedAt: "2026-06-17T12:00:00.000Z",
  coverImageUrl:
    "https://a.storyblok.com/f/178900/1241x797/4783d2bad2/crunchyroll-news-newtype-cover-summer-2026.png",
  topics: ["seasonal-lineup", "summer-2026", "simulcast", "anime-news"],
  locales: {
    en: {
      title: "Summer 2026 Anime Season — Crunchyroll Simulcast Guide",
      excerpt:
        "50+ new and returning titles land on Crunchyroll this summer — from Black Torch and Smoking Behind the Supermarket to Mushoku Tensei Season 3 and One Piece Elbaph Arc Part 2.",
      story: `Crunchyroll's Summer 2026 lineup is one of the biggest seasonal drops of the year. More than fifty simulcasts are scheduled between late June and August, mixing bold new adaptations with returning fan favorites and ongoing spring hits.

Highlights debuting in early July include Black Torch (July 4), Jaadugar: A Witch in Mongolia (July 4), Skeleton Knight in Another World Season 2 (July 4), Smoking Behind the Supermarket with You (July 9), Victoria of Many Faces (July 7), and Tomb Raider King (July 8).

Major returning arcs include Mushoku Tensei: Jobless Reincarnation Season 3, Re:ZERO Season 4 Part 2, Clevatess Season 2, Saga of Tanya the Evil Season 2, and You and I Are Polar Opposites Season 2.

Spring carryovers still simulcasting weekly: One Piece — Elbaph Arc Part 2, That Time I Got Reincarnated as a Slime Season 4, Daemons of the Shadow Realm, Digimon Beatbreak, Ascendance of a Bookworm, and more.

Use this guide on ClashAnime to track release energy, join episode clashes on /tracker, and upload your best clips when new episodes drop. Full calendar and trailers live on Crunchyroll News.`,
    },
    ar: {
      title: "دليل موسم صيف 2026 — بث Crunchyroll",
      excerpt:
        "أكثر من 50 عنواناً جديداً وعائداً على Crunchyroll هذا الصيف — من Black Torch وSmoking Behind the Supermarket إلى Mushoku Tensei موسم 3 وOne Piece Elbaph Arc Part 2.",
      story: `أعلن Crunchyroll عن موسم صيف 2026 بأحد أضخم جداول البث المباشر هذا العام. أكثر من خمسين عملاً بين أواخر يونيو وأغسطس، يجمع بين اقتباسات جديدة وعودة سلاسل محبوبة واستمرار أعمال الربيع.

أبرز الانطلاقات في يوليو: Black Torch (4 يوليو)، Jaadugar: A Witch in Mongolia (4 يوليو)، Skeleton Knight in Another World الموسم 2 (4 يوليو)، Smoking Behind the Supermarket with You (9 يوليو)، Victoria of Many Faces (7 يوليو)، وTomb Raider King (8 يوليو).

عودة مهمة تشمل Mushoku Tensei: Jobless Reincarnation الموسم 3، Re:ZERO الموسم 4 الجزء 2، Clevatess الموسم 2، Saga of Tanya the Evil الموسم 2، وYou and I Are Polar Opposites الموسم 2.

أعمال الربيع التي ما زالت تُبث: One Piece — Elbaph Arc Part 2، That Time I Got Reincarnated as a Slime الموسم 4، Daemons of the Shadow Realm، Digimon Beatbreak، Ascendance of a Bookworm، وغيرها.

استخدم هذا الدليل على ClashAnime لمتابعة الإصدارات، وادخل نزالات الحلقات على /tracker، وارفع أفضل لقطاتك عند نزول حلقات جديدة. التقويم الكامل والتريلرات على Crunchyroll News.`,
    },
    ja: {
      title: "2026年夏アニメ — Crunchyroll配信ガイド",
      excerpt:
        "Crunchyrollの夏2026は50作品超。Black Torch、Smoking Behind the Supermarket、無職転生S3、ONE PIECEエルバフ編など。",
      story: `Crunchyrollの2026年夏シーズンは、6月下旬から8月にかけて50作品以上のSimulcastが予定されている大型ラインナップです。

7月初旬の注目作：Black Torch（7/4）、Jaadugar: A Witch in Mongolia（7/4）、Skeleton Knight in Another World S2（7/4）、Smoking Behind the Supermarket with You（7/9）、Victoria of Many Faces（7/7）、Tomb Raider King（7/8）。

続編・復活作：無職転生 S3、Re:ZERO S4 Part 2、Clevatess S2、幼女戦記 S2、正反対な君と僕 S2 など。

春から継続：ONE PIECE エルバフ編 Part 2、転スラ S4、Daemons of the Shadow Realm、Digimon Beatbreak、本好きの下剋上 など。

ClashAnimeで新作を追い、/trackerのエピソードクラッシュに参加し、配信直後のクリップをアップロードしましょう。`,
    },
  },
} as const;

export const FEATURED_SEASONAL_HIGHLIGHTS = {
  en: [
    "Black Torch — Jul 4",
    "Mushoku Tensei S3 — Jul 5",
    "Smoking Behind the Supermarket — Jul 9",
    "One Piece Elbaph Arc Part 2",
    "Slime Season 4",
  ],
  ar: [
    "Black Torch — 4 يوليو",
    "Mushoku Tensei S3 — 5 يوليو",
    "Smoking Behind the Supermarket — 9 يوليو",
    "One Piece Elbaph Arc Part 2",
    "Slime Season 4",
  ],
  ja: [
    "Black Torch — 7/4",
    "無職転生 S3 — 7/5",
    "Smoking Behind the Supermarket — 7/9",
    "ONE PIECE エルバフ編",
    "転スラ S4",
  ],
} as const;

/** Static fallback when DB featured row is not synced yet. */
export function featuredGuideToArticle(): AnimeNewsArticle {
  const guide = FEATURED_SEASONAL_GUIDE;
  const now = guide.publishedAt;

  return {
    id: "featured-seasonal-guide",
    slug: guide.slug,
    source_guid: guide.sourceGuid,
    source_url: guide.sourceUrl,
    source_author: "Crunchyroll News",
    source_category: "Seasonal Lineup",
    cover_image_url: guide.coverImageUrl,
    topics: [...guide.topics],
    published_at: guide.publishedAt,
    status: "published",
    is_featured: true,
    featured_order: 100,
    title_en: guide.locales.en.title,
    title_ar: guide.locales.ar.title,
    title_ja: guide.locales.ja.title,
    excerpt_en: guide.locales.en.excerpt,
    excerpt_ar: guide.locales.ar.excerpt,
    excerpt_ja: guide.locales.ja.excerpt,
    story_en: guide.locales.en.story,
    story_ar: guide.locales.ar.story,
    story_ja: guide.locales.ja.story,
    seasonal_lineup: buildSummer2026SeasonalLineup(),
    feed_synced_at: now,
    created_at: now,
    updated_at: now,
  };
}
