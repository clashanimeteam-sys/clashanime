import type { Locale } from "@/lib/types";
import { getContactNotifyEmail, sendResendEmail } from "@/lib/email/resend";
import {
  containsArabic,
  emailParagraph,
  wrapEmailHtml,
} from "@/lib/email/emailLayout";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const autoReplyCopy: Record<
  Locale,
  { subject: string; heading: string; body: string; footer: string }
> = {
  en: {
    subject: "We received your message — ClashAnime",
    heading: "Thanks for contacting ClashAnime",
    body: "Our team received your message and will reply as soon as possible, usually within 24–48 hours.",
    footer: "Please do not reply to this automated message unless you want to add more details.",
  },
  ar: {
    subject: "تم استلام رسالتك — ClashAnime",
    heading: "شكراً لتواصلك مع ClashAnime",
    body: "استلم فريقنا رسالتك وسنرد عليك في أقرب وقت، عادةً خلال 24–48 ساعة.",
    footer: "هذه رسالة تلقائية. يمكنك إرسال تفاصيل إضافية بالرد على هذا الإيميل إن رغبت.",
  },
  ja: {
    subject: "お問い合わせを受け付けました — ClashAnime",
    heading: "ClashAnime へのお問い合わせありがとうございます",
    body: "チームがメッセージを受け取りました。通常24〜48時間以内に返信します。",
    footer: "これは自動送信メールです。追加情報がある場合のみ返信してください。",
  },
};

export async function notifyTeamOfContactMessage(input: {
  email: string;
  message: string;
  whatsapp?: string | null;
  locale: string;
  messageId: string;
}): Promise<{ ok: boolean; error?: string }> {
  const whatsappLine = input.whatsapp
    ? `<p><strong>WhatsApp:</strong> ${escapeHtml(input.whatsapp)}</p>`
    : "";

  const result = await sendResendEmail({
    to: getContactNotifyEmail(),
    replyTo: input.email,
    subject: `[ClashAnime Contact] ${input.email}`,
    html: `
      <h2>New contact form message</h2>
      <p><strong>From:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Locale:</strong> ${escapeHtml(input.locale)}</p>
      <p><strong>Message ID:</strong> ${escapeHtml(input.messageId)}</p>
      ${whatsappLine}
      <hr />
      <p style="white-space:pre-line">${escapeHtml(input.message)}</p>
      <p><a href="https://www.clashanime.com/admin/contact">Open in admin panel</a></p>
    `,
  });

  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function sendContactAutoReply(input: {
  to: string;
  locale: Locale;
}): Promise<{ ok: boolean; error?: string }> {
  const copy = autoReplyCopy[input.locale] ?? autoReplyCopy.en;

  const result = await sendResendEmail({
    to: input.to,
    subject: copy.subject,
    html: wrapEmailHtml({
      locale: input.locale,
      title: copy.heading,
      bodyHtml: `
        <h1 style="margin:0 0 18px;font-size:22px;line-height:1.35;color:#09090b;font-weight:800">${escapeHtml(copy.heading)}</h1>
        ${emailParagraph(copy.body)}
        <p style="color:#71717a;font-size:13px;margin:0">${escapeHtml(copy.footer)}</p>
        <p style="margin:24px 0 0;font-weight:600;color:#09090b">— ClashAnime Support</p>
      `,
    }),
  });

  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function sendContactReplyToUser(input: {
  to: string;
  replyBody: string;
  originalMessage: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const locale: Locale = containsArabic(input.replyBody) ? "ar" : "en";

  return sendResendEmail({
    to: input.to,
    subject: "Re: Your ClashAnime support message",
    html: wrapEmailHtml({
      locale,
      title: "ClashAnime Support",
      bodyHtml: `
        <p style="margin:0 0 16px;color:#3f3f46;white-space:pre-line">${escapeHtml(input.replyBody)}</p>
        <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0" />
        <p style="color:#71717a;font-size:13px;margin:0 0 8px">Your original message:</p>
        <blockquote style="margin:0;padding-${locale === "ar" ? "right" : "left"}:14px;border-${locale === "ar" ? "right" : "left"}:3px solid #d4d4d8;color:#52525b;white-space:pre-line">
          ${escapeHtml(input.originalMessage)}
        </blockquote>
        <p style="margin:24px 0 0;font-weight:600;color:#09090b">— ClashAnime Support</p>
      `,
    }),
  });
}
