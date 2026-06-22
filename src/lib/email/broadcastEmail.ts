import {
  containsArabic,
  emailButton,
  emailParagraph,
  emailSubheading,
  getPublicSiteUrl,
  wrapEmailHtml,
} from "@/lib/email/emailLayout";
import { sendResendEmail } from "@/lib/email/resend";
import type { Locale } from "@/lib/types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function personalize(template: string, userName: string): string {
  return template.replaceAll("{user_name}", userName);
}

function detectLocale(subject: string, body: string): Locale {
  return containsArabic(`${subject}\n${body}`) ? "ar" : "en";
}

function renderBodyHtml(body: string, locale: Locale, userName: string): string {
  const text = personalize(body, userName).trim();
  const blocks = text.split(/\n\n+/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      const lines = trimmed.split("\n").map((line) => line.trim()).filter(Boolean);
      const isBulletList = lines.length > 0 && lines.every((line) => line.startsWith("- "));

      if (isBulletList) {
        const items = lines
          .map(
            (line) =>
              `<li style="margin:0 0 10px;color:#3f3f46">${escapeHtml(line.replace(/^-+\s*/, ""))}</li>`,
          )
          .join("");
        return `<ul style="margin:0 0 16px;padding-${locale === "ar" ? "right" : "left"}:20px">${items}</ul>`;
      }

      if (trimmed.endsWith(":") && trimmed.length < 80 && !trimmed.includes("\n")) {
        return emailSubheading(trimmed);
      }

      return `<p style="margin:0 0 16px;color:#3f3f46;white-space:pre-line">${escapeHtml(trimmed)}</p>`;
    })
    .join("");
}

export function buildBroadcastEmailHtml(input: {
  subject: string;
  body: string;
  userName: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  locale?: Locale;
}): string {
  const locale = input.locale ?? detectLocale(input.subject, input.body);
  const userName = input.userName.trim() || "Hero";
  const bodyHtml = renderBodyHtml(input.body, locale, userName);
  const ctaLabel = input.ctaLabel?.trim();
  const ctaUrl = input.ctaUrl?.trim() || getPublicSiteUrl();

  const buttonHtml = ctaLabel
    ? emailButton({ href: ctaUrl, label: ctaLabel, locale })
    : "";

  return wrapEmailHtml({
    locale,
    title: personalize(input.subject, userName),
    preheader: personalize(input.body, userName).slice(0, 140),
    bodyHtml: `${bodyHtml}${buttonHtml}`,
  });
}

export async function sendBroadcastEmailToUser(input: {
  to: string;
  subject: string;
  body: string;
  userName: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  locale?: Locale;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const locale = input.locale ?? detectLocale(input.subject, input.body);
  const userName = input.userName.trim() || "Hero";
  const subject = personalize(input.subject, userName);

  return sendResendEmail({
    to: input.to,
    subject,
    html: buildBroadcastEmailHtml({
      subject: input.subject,
      body: input.body,
      userName,
      ctaLabel: input.ctaLabel,
      ctaUrl: input.ctaUrl,
      locale,
    }),
    replyTo: "support@clashanime.com",
  });
}

export const DEFAULT_SEASON_BROADCAST = {
  subject: "⏳ الفرصة الأخيرة! ( الموسم_الثالث ) يلفظ أنفاسه الأخيرة.. هل أنت مستعد؟",
  body: `يا بطل {user_name}،

العد التنازلي بدأ، والثواني تمر بسرعة في ساحة ClashAnime. الموسم يقترب من خط النهاية، وهذا يعني أن الفرصة الأخيرة لترك بصمتك واعتلاء منصة الصدارة أصبحت الآن!

لماذا يجب أن تدخل الساحة الآن؟
المراكز تتغير، والمنافسة في أشدها. مقطع واحد، أو تصويت واحد منك، قد يكون الفارق بين المركز الثالث والمركز الأول. تذكر أن الجوائز المالية تنتظر أبطال الموسم، وأسماء الفائزين ستُحفر في تاريخ المنصة.

ماذا يمكنك أن تفعل في الساعات القليلة القادمة؟

- ادعم أبطالك: تأكد من أن فيديوهاتك المفضلة في أعلى الترتيب.
- شارك لتربح: لا يزال بإمكانك جمع المزيد من الـ ClashCoins عبر مشاركة روابطك الفريدة؛ كل مشاركة قد تجلب لك الزيارات التي تحتاجها لتقفز للمركز الأول.
- ثبت أقدامك: لا تدع أحداً يزيحك عن مركزك. المنافسون لا ينامون، فهل ستظل في القمة؟

لا تجعل الموسم ينتهي وتندم على فرصة لم تغتنمها. الساحة بانتظارك، والتاريخ لا يكتبه إلا من يشارك في القتال حتى اللحظة الأخيرة.

نراك في القمة،
فريق ClashAnime`,
  ctaLabel: "ادخل الساحة الآن وأشعل النزال!",
};
