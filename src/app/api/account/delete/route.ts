import { NextResponse } from "next/server";
import { deleteUserAccount } from "@/lib/account/deleteAccount";
import { ACCOUNT_DELETE_CONFIRM_WORD } from "@/lib/email/accountDeletedEmail";
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

  let body: {
    confirmChecked?: boolean;
    confirmText?: string;
    locale?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const locale = LOCALES.has(body.locale as Locale) ? (body.locale as Locale) : "en";
  const expectedWord = ACCOUNT_DELETE_CONFIRM_WORD[locale];
  const confirmText = body.confirmText?.trim() ?? "";

  if (!body.confirmChecked) {
    return NextResponse.json({ error: "confirmation_required" }, { status: 400 });
  }

  if (confirmText !== expectedWord) {
    return NextResponse.json({ error: "confirmation_word_mismatch" }, { status: 400 });
  }

  const result = await deleteUserAccount({
    userId: user.id,
    locale,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
