import {
  emailButton,
  emailParagraph,
  emailSubheading,
  getPublicSiteUrl,
  wrapEmailHtml,
} from "@/lib/email/emailLayout";
import { sendResendEmail } from "@/lib/email/resend";
import type { Locale } from "@/lib/types";

type FarewellCopy = {
  subject: string;
  preheader: string;
  greeting: string;
  confirmBody: string;
  respectBody: string;
  tipTitle: string;
  tipBody: string;
  openDoorsBody: string;
  ctaLabel: string;
  wishBody: string;
  signoff: string;
  team: string;
};

const farewellCopy: Record<Locale, FarewellCopy> = {
  en: {
    subject: "🛡️ Your ClashAnime account has been deleted - we hope to see you again!",
    preheader: "Your account and data were permanently removed from ClashAnime.",
    greeting: "Dear {user_name},",
    confirmBody:
      "We confirm that your request has been processed successfully, and we have permanently deleted your account from the ClashAnime platform, including all associated data, in accordance with our Privacy Policy.",
    respectBody:
      "We fully respect your decision and appreciate the time you spent with us in the arena. We're sorry we weren't at the level you hoped for, and we hope we added even a small part of the fun to your anime experience.",
    tipTitle: "A final tip from our team:",
    tipBody:
      "If your decision came from a technical issue, a missing feature, or anything that didn't satisfy you, we'd be very grateful if you shared your feedback by replying to this email. Your notes are the fuel we use to improve the platform into the destination every anime fan deserves.",
    openDoorsBody:
      "Our doors will always remain open, and if you change your mind in the future, you can always sign up again and rejoin the heroes' arena.",
    ctaLabel: "Rejoin the Arena",
    wishBody: "We wish you all the best on your next journey.",
    signoff: "Best regards,",
    team: "ClashAnime Management",
  },
  ar: {
    subject: "🛡️ لقد تم حذف حسابك من ClashAnime - نتمنى رؤيتك مجدداً!",
    preheader: "تم حذف حسابك وبياناتك نهائياً من ClashAnime.",
    greeting: "عزيزي {user_name}،",
    confirmBody:
      "نؤكد لك أنه قد تم تنفيذ طلبك بنجاح، ولقد قمنا بحذف حسابك نهائياً من منصة ClashAnime، بما في ذلك جميع البيانات المرتبطة به، وذلك وفقاً لسياسة الخصوصية الخاصة بنا.",
    respectBody:
      "نحن في ClashAnime نحترم قرارك تماماً، ونقدر الوقت الذي قضيته معنا في ساحة النزالات. نأسف لأننا لم نكن بالمستوى الذي كنت تطمح إليه، ونتمنى أن نكون قد أضفنا ولو جزءاً بسيطاً من المتعة لتجربتك في عالم الأنمي.",
    tipTitle: "نصيحة أخيرة من فريقنا:",
    tipBody:
      "إذا كان قرارك نابعاً من وجود مشكلة تقنية، أو رغبة في ميزة معينة لم تجدها، أو حتى إذا كان هناك أي أمر لم يعجبك في تجربتنا، نكون ممتنين جداً لو شاركتنا ملاحظاتك عبر الرد على هذا الإيميل. ملاحظاتك هي الوقود الذي نستخدمه لتطوير المنصة لتصبح الوجهة التي يستحقها كل عشاق الأنمي.",
    openDoorsBody:
      "أبوابنا ستظل دائماً مفتوحة، وإذا غيرت رأيك في المستقبل، يمكنك دائماً التسجيل مجدداً والانضمام لساحة الأبطال من جديد.",
    ctaLabel: "ادخل المنصة مجدداً",
    wishBody: "نتمنى لك كل التوفيق في رحلتك القادمة.",
    signoff: "مع خالص التحية،",
    team: "إدارة ClashAnime",
  },
  ja: {
    subject: "🛡️ ClashAnime アカウントが削除されました - またお会いできることを願っています！",
    preheader: "アカウントとデータは ClashAnime から完全に削除されました。",
    greeting: "{user_name} 様",
    confirmBody:
      "ご依頼どおり、アカウントと関連データをプライバシーポリシーに従い ClashAnime から完全に削除しました。",
    respectBody:
      "ご決断を尊重し、アリーナで過ごしていただいた時間に感謝します。ご期待に応えられず申し訳ありませんが、少しでもアニメ体験の楽しさをお届けできていたら幸いです。",
    tipTitle: "チームからの最後のメッセージ:",
    tipBody:
      "技術的な問題、欲しい機能、または体験への不満が理由であれば、このメールに返信してフィードバックをいただけると大変助かります。",
    openDoorsBody:
      "いつでも再登録してヒーローのアリーナに戻ることができます。",
    ctaLabel: "プラットフォームに戻る",
    wishBody: "これからの旅に幸運をお祈りします。",
    signoff: "敬具",
    team: "ClashAnime 運営チーム",
  },
};

function applyName(template: string, userName: string): string {
  return template.replaceAll("{user_name}", userName);
}

export function buildAccountDeletedEmailHtml(userName: string, locale: Locale = "en"): string {
  const copy = farewellCopy[locale] ?? farewellCopy.en;
  const signupUrl = `${getPublicSiteUrl()}/signup`;

  const bodyHtml = `
    ${emailParagraph(applyName(copy.greeting, userName))}
    ${emailParagraph(copy.confirmBody)}
    ${emailParagraph(copy.respectBody)}
    ${emailSubheading(copy.tipTitle)}
    ${emailParagraph(copy.tipBody)}
    ${emailParagraph(copy.openDoorsBody)}
    ${emailButton({ href: signupUrl, label: copy.ctaLabel, locale })}
    ${emailParagraph(copy.wishBody)}
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

export async function sendAccountDeletedEmail(input: {
  to: string;
  userName: string;
  locale?: Locale;
}): Promise<{ ok: true; id: string; subject: string } | { ok: false; error: string }> {
  const locale: Locale = "en";
  const copy = farewellCopy[locale];
  const userName = input.userName.trim() || "Hero";

  const result = await sendResendEmail({
    to: input.to,
    subject: copy.subject,
    html: buildAccountDeletedEmailHtml(userName, locale),
    replyTo: "support@clashanime.com",
  });

  if (!result.ok) {
    return result;
  }

  return { ok: true, id: result.id, subject: copy.subject };
}

export const ACCOUNT_DELETE_CONFIRM_WORD: Record<Locale, string> = {
  en: "DELETE",
  ar: "حذف",
  ja: "削除",
};
