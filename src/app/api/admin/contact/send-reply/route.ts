import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
import { sendContactReplyToUser } from "@/lib/email/contactEmails";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { messageId?: string; reply?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messageId = body.messageId?.trim();
  const reply = body.reply?.trim() ?? "";

  if (!messageId) {
    return NextResponse.json({ error: "messageId required" }, { status: 400 });
  }

  if (reply.length < 5) {
    return NextResponse.json({ error: "reply too short" }, { status: 400 });
  }

  const { data: row, error: fetchError } = await supabase
    .from("contact_messages")
    .select("id, email, message")
    .eq("id", messageId)
    .maybeSingle();

  if (fetchError || !row) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  const emailResult = await sendContactReplyToUser({
    to: row.email,
    replyBody: reply,
    originalMessage: row.message,
  });

  if (!emailResult.ok) {
    return NextResponse.json({ error: emailResult.error }, { status: 502 });
  }

  const { error: updateError } = await supabase
    .from("contact_messages")
    .update({
      status: "replied",
      admin_reply: reply,
      handled_by: user.id,
      handled_at: new Date().toISOString(),
    })
    .eq("id", messageId);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message, emailSent: true, emailId: emailResult.id },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, emailId: emailResult.id });
}
