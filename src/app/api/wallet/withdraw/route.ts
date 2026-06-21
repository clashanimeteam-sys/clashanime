import { NextResponse } from "next/server";
import { PAYMENT_METHODS } from "@/lib/clashCoins";
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
    coinAmount?: number;
    paymentMethod?: string;
    paymentDestination?: string;
    kycAcknowledged?: boolean;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const coinAmount = body.coinAmount;
  const paymentMethod = body.paymentMethod?.trim();
  const paymentDestination = body.paymentDestination?.trim();
  const kycAcknowledged = body.kycAcknowledged === true;

  if (typeof coinAmount !== "number" || !Number.isInteger(coinAmount) || coinAmount <= 0) {
    return NextResponse.json({ error: "Invalid coin amount" }, { status: 400 });
  }

  if (!paymentMethod || !PAYMENT_METHODS.includes(paymentMethod as (typeof PAYMENT_METHODS)[number])) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  if (!paymentDestination || paymentDestination.length < 3) {
    return NextResponse.json({ error: "Payment destination required" }, { status: 400 });
  }

  const { data: withdrawalId, error } = await supabase.rpc("request_clash_coin_withdrawal", {
    p_coin_amount: coinAmount,
    p_payment_method: paymentMethod,
    p_payment_destination: paymentDestination,
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
