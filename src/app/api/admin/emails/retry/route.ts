import { NextResponse } from "next/server";
import { retryTransactionalEmail } from "@/lib/auth/sendWelcomeEmailIfNew";
import { getAdminUser } from "@/lib/adminAuth";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type RetryBody = {
  dispatchId?: string;
  email?: string;
  emailType?: string;
  locale?: string;
};

export async function POST(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getAdminUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: RetryBody;
  try {
    body = (await request.json()) as RetryBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const dispatchId = body.dispatchId?.trim();
  const email = body.email?.trim();
  const emailType = body.emailType?.trim();

  if (!dispatchId || !email || !emailType) {
    return NextResponse.json({ error: "Missing dispatchId, email, or emailType" }, { status: 400 });
  }

  const result = await retryTransactionalEmail({
    dispatchId,
    email,
    emailType,
    locale: body.locale,
  });

  if (!result.sent) {
    return NextResponse.json({ ok: false, error: result.error ?? "Send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, emailId: result.emailId ?? null });
}
