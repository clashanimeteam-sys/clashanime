import { NextResponse } from "next/server";
import { isEarnMoneyTaskType } from "@/lib/earnMoney";
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
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let body: {
    taskType?: string;
    contentUrl?: string;
    notes?: string | null;
    locale?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const taskType = body.taskType?.trim() ?? "";
  const contentUrl = body.contentUrl?.trim() ?? "";
  const notes = body.notes?.trim() || null;
  const locale = LOCALES.has(body.locale as Locale) ? (body.locale as Locale) : "en";

  if (!isEarnMoneyTaskType(taskType)) {
    return NextResponse.json({ error: "Invalid task type" }, { status: 400 });
  }

  const { data: submissionId, error } = await supabase.rpc("submit_earn_money_submission", {
    p_task_type: taskType,
    p_content_url: contentUrl,
    p_notes: notes,
    p_locale: locale,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: String(submissionId) });
}
