import { NextResponse } from "next/server";
import { sendWelcomeEmailIfNew } from "@/lib/auth/sendWelcomeEmailIfNew";
import { createServerClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/types";

const LOCALES = new Set<Locale>(["en", "ar", "ja"]);

export async function POST(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let locale: Locale = "en";
  try {
    const body = (await request.json()) as { locale?: string };
    if (LOCALES.has(body.locale as Locale)) {
      locale = body.locale as Locale;
    }
  } catch {
    // default locale
  }

  const result = await sendWelcomeEmailIfNew({
    userId: user.id,
    email: user.email,
    locale,
    supabaseClient: supabase,
    createdAt: user.created_at,
  });

  return NextResponse.json({
    ok: true,
    sent: result.sent,
    skipped: result.skipped ?? null,
    error: result.error ?? null,
    emailId: result.emailId ?? null,
  });
}
