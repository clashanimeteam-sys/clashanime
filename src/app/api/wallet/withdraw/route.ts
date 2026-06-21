import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    amountCents?: number;
    iban?: string;
    accountHolderName?: string;
    recipientEmail?: string;
    kycAcknowledged?: boolean;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const amountCents = body.amountCents;
  const iban = body.iban?.trim();
  const accountHolderName = body.accountHolderName?.trim();
  const recipientEmail = body.recipientEmail?.trim().toLowerCase();
  const kycAcknowledged = body.kycAcknowledged === true;

  if (typeof amountCents !== "number" || !Number.isInteger(amountCents) || amountCents <= 0) {
    return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
  }

  if (!iban || iban.replace(/\s+/g, "").length < 15) {
    return NextResponse.json({ error: "Valid IBAN required" }, { status: 400 });
  }

  if (!accountHolderName || accountHolderName.length < 2) {
    return NextResponse.json({ error: "Account holder name required" }, { status: 400 });
  }

  if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return NextResponse.json({ error: "Valid recipient email required" }, { status: 400 });
  }

  const { data: withdrawalId, error } = await supabase.rpc("request_clash_coin_withdrawal", {
    p_amount_cents: amountCents,
    p_iban: iban,
    p_account_holder_name: accountHolderName,
    p_recipient_email: recipientEmail,
    p_kyc_acknowledged: kycAcknowledged,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data: withdrawal } = await supabase
    .from("withdrawals")
    .select("id, status, coin_amount, usd_amount, payment_method, created_at")
    .eq("id", withdrawalId)
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    withdrawalId,
    withdrawal,
  });
}
