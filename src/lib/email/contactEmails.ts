import type { Locale } from "@/lib/types";
import { getContactNotifyEmail, sendResendEmail } from "@/lib/email/resend";

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
    html: `
      <h2>${escapeHtml(copy.heading)}</h2>
      <p>${escapeHtml(copy.body)}</p>
      <p style="color:#666;font-size:13px">${escapeHtml(copy.footer)}</p>
      <p>— ClashAnime Support</p>
    `,
  });

  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function sendContactReplyToUser(input: {
  to: string;
  replyBody: string;
  originalMessage: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  return sendResendEmail({
    to: input.to,
    subject: "Re: Your ClashAnime support message",
    html: `
      <p style="white-space:pre-line">${escapeHtml(input.replyBody)}</p>
      <hr />
      <p style="color:#666;font-size:13px">Your original message:</p>
      <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;white-space:pre-line">
        ${escapeHtml(input.originalMessage)}
      </blockquote>
      <p>— ClashAnime Support</p>
    `,
  });
}
