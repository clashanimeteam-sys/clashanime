import { NextResponse } from "next/server";
import { listAllAuthUsers } from "@/lib/admin/listAuthUsers";
import { getAdminUser } from "@/lib/adminAuth";
import {
  containsArabic,
  getPublicSiteUrl,
} from "@/lib/email/emailLayout";
import { sendBroadcastEmailToUser } from "@/lib/email/broadcastEmail";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const BATCH_SIZE = 8;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getAdminUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    return NextResponse.json({ error: "Service role not configured" }, { status: 503 });
  }

  let body: {
    subject?: string;
    message?: string;
    ctaLabel?: string | null;
    ctaUrl?: string | null;
    confirm?: boolean;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const ctaLabel = body.ctaLabel?.trim() || null;
  const ctaUrl = body.ctaUrl?.trim() || getPublicSiteUrl();

  if (!body.confirm) {
    return NextResponse.json({ error: "confirmation_required" }, { status: 400 });
  }

  if (subject.length < 5) {
    return NextResponse.json({ error: "subject_too_short" }, { status: 400 });
  }

  if (message.length < 20) {
    return NextResponse.json({ error: "message_too_short" }, { status: 400 });
  }

  const locale: Locale = containsArabic(`${subject}\n${message}`) ? "ar" : "en";

  let authUsers: Awaited<ReturnType<typeof listAllAuthUsers>>;
  try {
    authUsers = await listAllAuthUsers();
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list users" },
      { status: 500 },
    );
  }

  const { data: campaign, error: campaignError } = await serviceRole
    .from("admin_broadcast_emails")
    .insert({
      sent_by: user.id,
      subject,
      body_template: message,
      cta_label: ctaLabel,
      cta_url: ctaUrl,
      locale,
      recipient_count: authUsers.length,
      status: "sending",
    })
    .select("id")
    .single();

  if (campaignError || !campaign) {
    return NextResponse.json({ error: campaignError?.message ?? "Could not create campaign" }, { status: 500 });
  }

  const { data: profiles } = await serviceRole
    .from("profiles")
    .select("id, username, display_name")
    .in(
      "id",
      authUsers.map((row) => row.id),
    );

  const profileById = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      profile.display_name?.trim() || profile.username,
    ]),
  );

  let sentCount = 0;
  let failedCount = 0;
  const failures: Array<{ email: string; error: string }> = [];

  for (let index = 0; index < authUsers.length; index += BATCH_SIZE) {
    const batch = authUsers.slice(index, index + BATCH_SIZE);

    await Promise.all(
      batch.map(async (authUser) => {
        const userName = profileById.get(authUser.id) ?? authUser.email.split("@")[0] ?? "Hero";
        const result = await sendBroadcastEmailToUser({
          to: authUser.email,
          subject,
          body: message,
          userName,
          ctaLabel,
          ctaUrl,
          locale,
        });

        if (result.ok) {
          sentCount += 1;
        } else {
          failedCount += 1;
          failures.push({ email: authUser.email, error: result.error });
        }
      }),
    );

    if (index + BATCH_SIZE < authUsers.length) {
      await sleep(400);
    }
  }

  const status = failedCount === authUsers.length ? "failed" : "completed";

  await serviceRole
    .from("admin_broadcast_emails")
    .update({
      sent_count: sentCount,
      failed_count: failedCount,
      status,
      error_message: failures.length ? failures.slice(0, 5).map((f) => `${f.email}: ${f.error}`).join(" | ") : null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", campaign.id);

  return NextResponse.json({
    ok: true,
    campaignId: campaign.id,
    recipientCount: authUsers.length,
    sentCount,
    failedCount,
    failures: failures.slice(0, 10),
  });
}
