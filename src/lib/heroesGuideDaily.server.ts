import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export type HeroesDailyBrief = {
  slug: string;
  date: string;
  titleEn: string;
  titleAr: string;
  titleJa: string;
  excerptEn: string;
  excerptAr: string;
  excerptJa: string;
  storyEn: string;
  storyAr: string;
  storyJa: string;
};

function todayUtcDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildBrief(date: string, headlines: string[]): HeroesDailyBrief {
  const slug = `heroes-daily-${date}`;
  const listEn = headlines.length
    ? headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")
    : "No new headlines yet — check Stories, Manga catalog, and Anime Radar meanwhile.";
  const listAr = headlines.length
    ? headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")
    : "لا عناوين جديدة بعد — راجع القصص وكتالوج المانغا ورادار الأنمي.";
  const listJa = headlines.length
    ? headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")
    : "新しい見出しはまだありません。物語・マンガ・レーダーもどうぞ。";

  return {
    slug,
    date,
    titleEn: `Heroes Daily Brief — ${date}`,
    titleAr: `موجز دليل الأبطال اليومي — ${date}`,
    titleJa: `ヒーローズデイリー — ${date}`,
    excerptEn: `Daily ClashAnime Heroes Guide update for ${date}: curated headlines and where to explore next.`,
    excerptAr: `تحديث يومي لدليل أبطال ClashAnime بتاريخ ${date}: عناوين مختارة وأين تكمل القراءة.`,
    excerptJa: `${date} のClashAnimeヒーローズガイド日次更新。注目見出しと次に読む場所。`,
    storyEn: `Welcome to the Heroes Daily Brief for ${date}.

Today's headlines
${listEn}

Copyright-safe next steps
• Read original essays in Stories
• Browse Manga and Gallery catalogs (discovery links only — no chapter dumps)
• Check Anime Radar for release calendars
• Play Anime Radio while you read

ClashAnime does not host full episodes or manga scans. Use official platforms to watch or buy.`,
    storyAr: `مرحباً في موجز دليل الأبطال ليوم ${date}.

عناوين اليوم
${listAr}

خطوات آمنة لحقوق النشر
• اقرأ مقالات أصلية في القصص
• تصفّح كتالوج المانغا ومعرض الصور (روابط اكتشاف فقط — بلا فصول)
• رادار الأنمي لتقويم الإصدارات
• راديو الأنمي أثناء القراءة

ClashAnime لا يستضيف حلقات كاملة أو مسح مانغا. استخدم المنصات الرسمية.`,
    storyJa: `${date} のヒーローズデイリーへようこそ。

本日の見出し
${listJa}

著作権に配慮した次の一歩
• 物語でオリジナルエッセイ
• マンガ/画像カタログ（発見リンクのみ・スキャンなし）
• レーダーで放送予定
• ラジオを聞きながら読書

本編やマンガスキャンは置きません。公式サービスを利用してください。`,
  };
}

export async function upsertHeroesDailyBrief(date = todayUtcDate()): Promise<{
  slug: string;
  date: string;
  headlineCount: number;
}> {
  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    throw new Error("Service role not configured");
  }

  const { data: latestRows } = await serviceRole
    .from("anime_news_articles")
    .select("slug, title_en")
    .eq("status", "published")
    .not("slug", "like", "heroes-daily-%")
    .order("published_at", { ascending: false })
    .limit(5);

  const headlines = (latestRows ?? [])
    .map((row) => (row.title_en as string | null)?.trim() || (row.slug as string))
    .filter(Boolean);

  const brief = buildBrief(date, headlines);
  const now = new Date().toISOString();

  const { error } = await serviceRole.from("anime_news_articles").upsert(
    {
      slug: brief.slug,
      source_guid: `clashanime:heroes-daily:${date}`,
      source_url: `https://www.clashanime.com/blog/anime-news/${brief.slug}`,
      source_author: "ClashAnime Heroes Desk",
      source_category: "heroes-guide",
      cover_image_url: null,
      topics: ["heroes-guide", "daily-brief", "anime-news"],
      published_at: `${date}T08:00:00.000Z`,
      status: "published",
      title_en: brief.titleEn,
      title_ar: brief.titleAr,
      title_ja: brief.titleJa,
      excerpt_en: brief.excerptEn,
      excerpt_ar: brief.excerptAr,
      excerpt_ja: brief.excerptJa,
      story_en: brief.storyEn,
      story_ar: brief.storyAr,
      story_ja: brief.storyJa,
      feed_synced_at: now,
      updated_at: now,
    },
    { onConflict: "source_guid" },
  );

  if (error) {
    throw new Error(error.message);
  }

  await serviceRole.from("site_settings").upsert({
    key: "heroes_guide_daily",
    value: {
      slug: brief.slug,
      date: brief.date,
      updatedAt: now,
      headlineCount: headlines.length,
    },
    updated_at: now,
  });

  return { slug: brief.slug, date: brief.date, headlineCount: headlines.length };
}

export async function loadHeroesDailyPointer(): Promise<{ slug: string; date: string } | null> {
  try {
    const supabase = createPublicSupabaseClient();
    if (!supabase) return null;

    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "heroes_guide_daily")
      .maybeSingle();

    const value = data?.value as { slug?: string; date?: string } | null;
    if (value?.slug && value?.date) {
      return { slug: value.slug, date: value.date };
    }

    const { data: latest } = await supabase
      .from("anime_news_articles")
      .select("slug, published_at")
      .eq("status", "published")
      .like("slug", "heroes-daily-%")
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latest?.slug) return null;
    const date = String(latest.slug).replace(/^heroes-daily-/, "");
    return { slug: latest.slug as string, date };
  } catch {
    return null;
  }
}
