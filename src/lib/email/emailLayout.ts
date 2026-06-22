import type { Locale } from "@/lib/types";

const SITE_URL = "https://www.clashanime.com";
const LOGO_URL = `${SITE_URL}/logo-dark.png`;
const BRAND_RED = "#E33124";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function getPublicSiteUrl(): string {
  return SITE_URL;
}

export function wrapEmailHtml(input: {
  locale: Locale;
  title: string;
  bodyHtml: string;
  preheader?: string;
}): string {
  const isRtl = input.locale === "ar";
  const dir = isRtl ? "rtl" : "ltr";
  const align = isRtl ? "right" : "left";
  const fontFamily =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const preheader = input.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(input.preheader)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="${input.locale}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:${fontFamily};color:#18181b;line-height:1.6">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7">
          <tr>
            <td align="center" style="padding:28px 24px 20px;background:#ffffff;border-bottom:1px solid #f0f0f0">
              <a href="${SITE_URL}" style="text-decoration:none">
                <img src="${LOGO_URL}" width="180" height="auto" alt="ClashAnime" style="display:block;border:0;max-width:180px;height:auto" />
              </a>
            </td>
          </tr>
          <tr>
            <td dir="${dir}" style="padding:28px 28px 32px;text-align:${align};font-size:15px">
              ${input.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 28px;border-top:1px solid #f0f0f0;text-align:center;font-size:12px;color:#71717a">
              <p style="margin:0 0 8px">© ${new Date().getFullYear()} ClashAnime</p>
              <p style="margin:0">
                <a href="${SITE_URL}" style="color:${BRAND_RED};text-decoration:none">clashanime.com</a>
                ·
                <a href="${SITE_URL}/contact" style="color:${BRAND_RED};text-decoration:none">Support</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton(input: { href: string; label: string; locale: Locale }): string {
  const isRtl = input.locale === "ar";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto ${isRtl ? "28px 0" : "28px 0"}">
      <tr>
        <td align="center" style="border-radius:999px;background:${BRAND_RED}">
          <a href="${escapeHtml(input.href)}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px">
            ${escapeHtml(input.label)}
          </a>
        </td>
      </tr>
    </table>`;
}

export function emailHeading(text: string): string {
  return `<h1 style="margin:0 0 18px;font-size:22px;line-height:1.35;color:#09090b;font-weight:800">${escapeHtml(text)}</h1>`;
}

export function emailParagraph(text: string): string {
  return `<p style="margin:0 0 16px;color:#3f3f46">${escapeHtml(text)}</p>`;
}

export function emailSubheading(text: string): string {
  return `<h2 style="margin:24px 0 12px;font-size:17px;line-height:1.4;color:#09090b;font-weight:700">${escapeHtml(text)}</h2>`;
}

export function emailListItem(text: string): string {
  return `<li style="margin:0 0 10px;color:#3f3f46">${escapeHtml(text)}</li>`;
}

export function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}
