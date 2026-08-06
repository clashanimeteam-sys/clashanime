import type { Locale } from "@/lib/types";

export type GuideSection = { heading: string; body: string };

export type GuidePageCopy = {
  title: string;
  intro: string;
  sections: GuideSection[];
  closing: string;
};

const faqEn: GuidePageCopy = {
  title: "ClashAnime FAQ — Stories, Manga & Copyright-Safe Culture",
  intro:
    "ClashAnime is a copyright-safe anime culture hub: original stories and essays, manga notes, image moodboards, anime radar, anime radio, and the Heroes Guide. We do not offer episode streaming, user upload arenas, channels, or cash contests.",
  sections: [
    {
      heading: "What is ClashAnime now?",
      body: "A reading and discovery site. Explore Stories, Manga Notes, Images, Anime Radar, Anime Radio, and Heroes Guide editorial content in Arabic, English, and Japanese.",
    },
    {
      heading: "Do I need an account?",
      body: "No. The public hub is open without login. Account tools for uploads and wallets are not part of the public product.",
    },
    {
      heading: "Can I watch full anime episodes here?",
      body: "No. We do not host full episodes. Use licensed streaming services. Our radar helps you track release schedules; our essays help you understand stories.",
    },
    {
      heading: "Do you publish manga scans?",
      body: "No. Manga Notes is educational commentary about craft and pacing — not a scanlation library.",
    },
    {
      heading: "How do you handle copyright?",
      body: "We prioritize original text, fair commentary, and links to legal options. Report abuse via the Report page. Review Terms, Privacy, Community Guidelines, and DMCA in the footer.",
    },
    {
      heading: "Where should I start?",
      body: "Home → Stories or Manga → Heroes Guide blog → Anime Radar → Anime Radio.",
    },
  ],
  closing: "Questions? Use Contact. Thanks for supporting legal anime culture.",
};

const faqAr: GuidePageCopy = {
  title: "الأسئلة الشائعة — قصص ومانغا وثقافة آمنة",
  intro:
    "ClashAnime مركز ثقافة أنمي آمن لحقوق النشر: قصص ومقالات، ملاحظات مانغا، صور، رادار، راديو، ودليل الأبطال. لا بث حلقات، ولا ساحة رفع، ولا قنوات، ولا مسابقات ربح.",
  sections: [
    {
      heading: "ما هو الموقع الآن؟",
      body: "موقع قراءة واكتشاف. قصص، مانغا، صور، رادار، راديو، ودليل الأبطال بالعربية والإنجليزية واليابانية.",
    },
    {
      heading: "هل أحتاج حساباً؟",
      body: "لا. المركز العام مفتوح بلا تسجيل.",
    },
    {
      heading: "هل أشاهد حلقات كاملة؟",
      body: "لا. استخدم منصات مرخّصة. الرادار للتقويم؛ المقالات للفهم.",
    },
    {
      heading: "هل تنشرون مسح مانغا؟",
      body: "لا. ملاحظات المانغا تعليق تعليمي وليست مكتبة مسح.",
    },
    {
      heading: "حقوق النشر؟",
      body: "نص أصلي وتعليق عادل وروابط قانونية. أبلغ عبر صفحة الإبلاغ. راجع السياسات في التذييل.",
    },
    {
      heading: "من أين أبدأ؟",
      body: "الرئيسية → قصص أو مانغا → دليل الأبطال → رادار → راديو.",
    },
  ],
  closing: "أسئلة؟ تواصل معنا. شكراً لدعم ثقافة أنمي قانونية.",
};

const faqJa: GuidePageCopy = {
  title: "よくある質問 — 物語・マンガ・安全なカルチャー",
  intro:
    "ClashAnimeは著作権に配慮したアニカルチャーハブです。物語・マンガノート・画像・レーダー・ラジオ・ヒーローズガイド。本編配信・投稿アリーナ・チャンネル・賞金コンテストはありません。",
  sections: [
    {
      heading: "今のClashAnimeは？",
      body: "読書と発見のサイト。三言語でハブを公開しています。",
    },
    {
      heading: "アカウントは必要？",
      body: "不要です。公開ハブはログインなしで使えます。",
    },
    {
      heading: "本編は見られる？",
      body: "いいえ。正規配信サービスを使ってください。",
    },
    {
      heading: "スキャンはある？",
      body: "いいえ。マンガノートは教育的解説です。",
    },
    {
      heading: "著作権は？",
      body: "オリジナル文章と公正な論評、合法リンクを優先。通報ページとポリシーを確認。",
    },
    {
      heading: "始め方は？",
      body: "ホーム→物語/マンガ→ヒーローズガイド→レーダー→ラジオ。",
    },
  ],
  closing: "お問い合わせは Contact へ。合法なアニカルチャーを応援ありがとうございます。",
};

export function getFaqCopy(locale: Locale): GuidePageCopy {
  if (locale === "ar") return faqAr;
  if (locale === "ja") return faqJa;
  return faqEn;
}
