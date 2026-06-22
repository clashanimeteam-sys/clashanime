import {
  emailButton,
  emailHeading,
  emailListItem,
  emailParagraph,
  emailSubheading,
  getPublicSiteUrl,
  wrapEmailHtml,
} from "@/lib/email/emailLayout";
import { sendResendEmail } from "@/lib/email/resend";
import type { Locale } from "@/lib/types";

type WelcomeCopy = {
  subject: string;
  preheader: string;
  greeting: string;
  intro: string;
  whyTitle: string;
  whyBody: string;
  awaitsTitle: string;
  bulletStart: string;
  bulletCoins: string;
  bulletRanks: string;
  tipTitle: string;
  tipBody: string;
  platformBody: string;
  ctaQuestion: string;
  ctaLabel: string;
  helpBody: string;
  signoff: string;
  team: string;
};

const welcomeCopy: Record<Locale, WelcomeCopy> = {
  en: {
    subject: "⚡ Welcome to the Arena.. You're now one of ClashAnime's heroes!",
    preheader: "Your anime journey just leveled up. Enter the arena now.",
    greeting: "Welcome, hero, to the world of ClashAnime,",
    intro:
      "You've taken the first step to elevate your anime experience from ordinary viewer to a hunter seeking excellence in the global battle arena. We're thrilled to have you join us from all corners of the earth to be part of this unique community.",
    whyTitle: "Why ClashAnime?",
    whyBody:
      "We designed this platform to be more than just a video site; it's a digital arena built to honor your passion. Here, every second you spend and every interaction brings you closer to becoming a legend. We believe anime isn't just stories—it's an experience worth competing for, analyzing, and sharing with a global community that understands its value.",
    awaitsTitle: "What awaits you now?",
    bulletStart:
      "Start the clash: Share your clips, vote for the best, and make your voice heard in real-time battle results.",
    bulletCoins:
      "Collect ClashCoins: Every interaction is an investment. Gather your points, climb the ranks, and make everyone see your name on the leaderboard.",
    bulletRanks:
      "Your path to the top: Ranks A and S aren't just titles—they're your key to unlocking exclusive publishing permissions and real prizes.",
    tipTitle: "Tip from the heroes:",
    tipBody:
      "Don't stop at watching! Start sharing your links right away, collect points, and get ready for the next season. We're here to turn your passion into value and your time into achievements.",
    platformBody:
      "At ClashAnime we develop the platform every day to be faster, smarter, and fairer, because our goal isn't just to be the best—we want to be the arena you return to every day.",
    ctaQuestion: "Are you ready to take your anime experience to the next level?",
    ctaLabel: "Enter the Arena Now",
    helpBody:
      "If you need any help or have a suggestion to improve this arena, don't hesitate to contact us. We're here to serve heroes like you.",
    signoff: "Stay exceptional,",
    team: "The ClashAnime Team",
  },
  ar: {
    subject: "⚡ مرحباً بك في الساحة.. أنت الآن أحد أبطال ClashAnime!",
    preheader: "رحلتك في عالم الأنمي بدأت للتو. ادخل الساحة الآن.",
    greeting: "أهلاً بك يا بطل في عالم ClashAnime،",
    intro:
      "لقد اتخذت الخطوة الأولى للارتقاء بتجربتك في عالم الأنمي من مجرد مشاهد عادي إلى \"صياد\" يبحث عن التميز في ساحة النزالات العالمية. نحن سعداء جداً بانضمامك إلينا من كل صقاع الأرض لتكون جزءاً من هذا المجتمع الفريد.",
    whyTitle: "لماذا ClashAnime؟",
    whyBody:
      "لقد صممنا هذه المنصة لتكون أكثر من مجرد موقع فيديوهات؛ إنها \"أرينا\" رقمية صُممت لتقدر شغفك. هنا، كل ثانية تقضيها وكل تفاعل تقوم به يجعلك أقرب لتصبح أسطورة. نحن نؤمن أن الأنمي ليس مجرد قصص، بل هو تجربة تستحق التنافس، والتحليل، والمشاركة مع مجتمع عالمي يفهم قيمتها.",
    awaitsTitle: "ما الذي ينتظرك الآن؟",
    bulletStart:
      "ابدأ النزال: شارك مقاطعك، صوّت للأفضل، واجعل صوتك مسموعاً في نتائج النزالات اللحظية.",
    bulletCoins:
      "اجمع الـ ClashCoins: كل تفاعل تقوم به هو استثمار. اجمع نقاطك، ارتقِ في الرتب، واجعل الجميع يرى اسمك في لوحة الصدارة.",
    bulletRanks:
      "طريقك للقمة: تذكر أن الرتبة A و S ليست مجرد لقب، بل هي مفتاحك لفتح صلاحيات النشر الحصرية والجوائز الحقيقية.",
    tipTitle: "نصيحة من الأبطال:",
    tipBody:
      "لا تتوقف عند المشاهدة! ابدأ فوراً بمشاركة روابطك، واجمع النقاط، واستعد للموسم القادم. نحن هنا لنحول شغفك إلى قيمة، ونحول وقتك إلى إنجازات.",
    platformBody:
      "نحن في ClashAnime نطور المنصة كل يوم لتكون أسرع، أذكى، وأكثر عدلاً، لأن هدفنا ليس أن نكون الأفضل فحسب، بل أن نكون ساحتك المفضلة التي تعود إليها يومياً.",
    ctaQuestion: "هل أنت مستعد لنقل تجربتك في الأنمي إلى المستوى التالي؟",
    ctaLabel: "ادخل الساحة الآن",
    helpBody:
      "في حال احتجت لأي مساعدة أو كان لديك اقتراح لتطوير هذا الصرح، لا تتردد في مراسلتنا. نحن هنا لخدمة الأبطال مثلك.",
    signoff: "دمت متميزاً،",
    team: "فريق ClashAnime",
  },
  ja: {
    subject: "⚡ アリーナへようこそ.. あなたは ClashAnime のヒーローです！",
    preheader: "アニメ体験がレベルアップしました。今すぐアリーナへ。",
    greeting: "ClashAnime の世界へようこそ、ヒーロー。",
    intro:
      "あなたは普通の視聴者から、世界のバトルアリーナで卓越を目指す「ハンター」へと進化する第一歩を踏み出しました。地球のあらゆる場所から参加してくれて嬉しいです。",
    whyTitle: "なぜ ClashAnime？",
    whyBody:
      "このプラットフォームは単なる動画サイトではありません。あなたの情熱を称えるデジタルアリーナです。ここでの一秒一秒、すべてのインタラクションが伝説への近道になります。",
    awaitsTitle: "今あなたを待っているもの",
    bulletStart: "バトル開始: クリップを共有し、投票し、リアルタイム結果で声を届けましょう。",
    bulletCoins:
      "ClashCoins を集める: すべてのインタラクションが投資です。ポイントを集め、ランクを上げ、リーダーボードに名前を刻みましょう。",
    bulletRanks:
      "頂点への道: A・Sランクは称号だけでなく、限定投稿権限と本物の賞品への鍵です。",
    tipTitle: "ヒーローからのヒント:",
    tipBody:
      "視聴だけで終わらないで！ すぐにリンクを共有し、ポイントを集め、次のシーズンに備えましょう。",
    platformBody:
      "ClashAnime は毎日、より速く、より賢く、より公平なプラットフォームを目指して開発を続けています。",
    ctaQuestion: "アニメ体験を次のレベルへ上げる準備はできましたか？",
    ctaLabel: "今すぐアリーナへ",
    helpBody: "サポートや改善提案があれば、いつでもお問い合わせください。",
    signoff: "これからも輝いてください。",
    team: "ClashAnime チーム",
  },
};

export function buildWelcomeEmailHtml(locale: Locale): string {
  const copy = welcomeCopy[locale] ?? welcomeCopy.en;
  const siteUrl = getPublicSiteUrl();

  const bodyHtml = `
    ${emailHeading(copy.subject.replace(/^⚡\s*/, ""))}
    ${emailParagraph(copy.greeting)}
    ${emailParagraph(copy.intro)}
    ${emailSubheading(copy.whyTitle)}
    ${emailParagraph(copy.whyBody)}
    ${emailSubheading(copy.awaitsTitle)}
    <ul style="margin:0 0 16px;padding-${locale === "ar" ? "right" : "left"}:20px">
      ${emailListItem(copy.bulletStart)}
      ${emailListItem(copy.bulletCoins)}
      ${emailListItem(copy.bulletRanks)}
    </ul>
    ${emailSubheading(copy.tipTitle)}
    ${emailParagraph(copy.tipBody)}
    ${emailParagraph(copy.platformBody)}
    ${emailParagraph(copy.ctaQuestion)}
    ${emailButton({ href: siteUrl, label: copy.ctaLabel, locale })}
    ${emailParagraph(copy.helpBody)}
    <p style="margin:24px 0 4px;color:#3f3f46">${copy.signoff}</p>
    <p style="margin:0;font-weight:700;color:#09090b">${copy.team}</p>
  `;

  return wrapEmailHtml({
    locale,
    title: copy.subject,
    preheader: copy.preheader,
    bodyHtml,
  });
}

export async function sendWelcomeEmail(input: {
  to: string;
  locale: Locale;
}): Promise<{ ok: true; id: string; subject: string } | { ok: false; error: string }> {
  const locale = welcomeCopy[input.locale] ? input.locale : "en";
  const copy = welcomeCopy[locale];

  const result = await sendResendEmail({
    to: input.to,
    subject: copy.subject,
    html: buildWelcomeEmailHtml(locale),
    replyTo: "support@clashanime.com",
  });

  if (!result.ok) {
    return result;
  }

  return { ok: true, id: result.id, subject: copy.subject };
}
