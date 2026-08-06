import type { Locale } from "@/lib/types";
import type { GuidePageCopy } from "@/lib/faqCopy";

const howEn: GuidePageCopy = {
  title: "How ClashAnime Works — Content Hubs",
  intro:
    "ClashAnime is organized as a copyright-safe culture site. This page explains each public hub and how they fit together — without accounts, uploads, streaming, or prize contests.",
  sections: [
    {
      heading: "1) Stories & Tales",
      body: "Read original essays and narrative commentary about anime storytelling craft, themes, and culture. Text-first content designed for learning and enjoyment.",
    },
    {
      heading: "2) Manga Notes",
      body: "Explore panel rhythm, pacing, and adaptation talk as educational notes — never full chapter scans.",
    },
    {
      heading: "3) Images",
      body: "Browse atmosphere moodboards and visual inspiration tips without stolen key-art warehouses.",
    },
    {
      heading: "4) Anime Radar",
      body: "Check release calendars and season heat so you know what is airing — then watch legally elsewhere.",
    },
    {
      heading: "5) Anime Radio",
      body: "Listen to soundtrack ambience and lounge beats while you read.",
    },
    {
      heading: "6) Heroes Guide",
      body: "Editorial blog and anime news summaries that keep the site informative for humans and search engines.",
    },
  ],
  closing: "Start on Home, pick a hub, and explore. Legal pages live in the footer.",
};

const howAr: GuidePageCopy = {
  title: "كيف يعمل ClashAnime — مراكز المحتوى",
  intro:
    "ClashAnime منظم كموقع ثقافة آمن لحقوق النشر. هذه الصفحة تشرح كل مركز عام — بلا حسابات أو رفع أو بث أو مسابقات جوائز.",
  sections: [
    {
      heading: "1) قصص وحكايات",
      body: "مقالات أصلية وتعليق سردي عن حرفة القصص والثيمات والثقافة.",
    },
    {
      heading: "2) مانغا",
      body: "إيقاع اللوحات والاقتباس كملاحظات تعليمية — بلا مسح فصول كاملة.",
    },
    {
      heading: "3) صور",
      body: "أجواء وإلهام بصري بلا مخازن فن مسروق.",
    },
    {
      heading: "4) رادار الأنمي",
      body: "تقويم الإصدارات وحرارة الموسم — والمشاهدة القانونية خارج الموقع.",
    },
    {
      heading: "5) راديو الأنمي",
      body: "أجواء صوتية أثناء القراءة.",
    },
    {
      heading: "6) دليل الأبطال",
      body: "مدونة تحريرية وأخبار أنمي لإبقاء الموقع غنياً بالمعلومات.",
    },
  ],
  closing: "ابدأ من الرئيسية واختر مركزاً. السياسات في التذييل.",
};

const howJa: GuidePageCopy = {
  title: "ClashAnimeの仕組み — コンテンツハブ",
  intro:
    "著作権に配慮したカルチャーサイトです。アカウント・投稿・配信・賞金コンテストなしで各ハブを説明します。",
  sections: [
    {
      heading: "1) 物語",
      body: "オリジナルエッセイと物語解説。",
    },
    {
      heading: "2) マンガ",
      body: "コマとテンポの教育的ノート。スキャンなし。",
    },
    {
      heading: "3) 画像",
      body: "ムードボードと視覚ヒント。盗用倉庫なし。",
    },
    {
      heading: "4) レーダー",
      body: "放送カレンダー。視聴は正規サービスで。",
    },
    {
      heading: "5) ラジオ",
      body: "読書中のサウンド雰囲気。",
    },
    {
      heading: "6) ヒーローズガイド",
      body: "編集ブログとニュース要約。",
    },
  ],
  closing: "ホームからハブを選んで探索。法務はフッターへ。",
};

export function getHowItWorksCopy(locale: Locale): GuidePageCopy {
  if (locale === "ar") return howAr;
  if (locale === "ja") return howJa;
  return howEn;
}
