import { NextResponse } from "next/server";
import {
  notifyTeamOfContactMessage,
  sendContactAutoReply,
} from "@/lib/email/contactEmails";
import { createServerClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALES = new Set<Locale>(["en", "ar", "ja"]);

export async function POST(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  let body: {
    email?: string;
    message?: string;
    whatsapp?: string | null;
    locale?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const message = body.message?.trim() ?? "";
  const whatsapp = body.whatsapp?.trim() || null;
  const locale = LOCALES.has(body.locale as Locale) ? (body.locale as Locale) : "en";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json({ error: "message too short" }, { status: 400 });
  }

  const { data: messageId, error } = await supabase.rpc("submit_contact_message", {
    p_email: email,
    p_message: message,
    p_whatsapp: whatsapp,
    p_locale: locale,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const id = String(messageId);

  const [teamResult, userResult] = await Promise.all([
    notifyTeamOfContactMessage({
      email,
      message,
      whatsapp,
      locale,
      messageId: id,
    }),
    sendContactAutoReply({ to: email, locale }),
  ]);

  return NextResponse.json({
    ok: true,
    id,
    emailDelivery: {
      teamNotified: teamResult.ok,
      userAutoReply: userResult.ok,
      teamError: teamResult.error ?? null,
      userError: userResult.error ?? null,
    },
  });
}
