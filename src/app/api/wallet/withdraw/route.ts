import { NextResponse } from "next/server";
import {
  isPaymentMethod,
  MIN_WITHDRAWAL_CENTS,
  USDT_NETWORKS,
  type PaymentMethod,
} from "@/lib/clashCoins";
import { createServerClient } from "@/lib/supabase/server";

function buildPaymentDetails(
  paymentMethod: PaymentMethod,
  body: {
    iban?: string;
    accountHolderName?: string;
    recipientEmail?: string;
    paypalEmail?: string;
    walletAddress?: string;
    network?: string;
  },
): { details: Record<string, string> } | { error: string } {
  if (paymentMethod === "bank_transfer") {
    const iban = body.iban?.trim();
    const accountHolderName = body.accountHolderName?.trim();
    const recipientEmail = body.recipientEmail?.trim().toLowerCase();

    if (!iban || iban.replace(/\s+/g, "").length < 15) {
      return { error: "Valid IBAN required" };
    }
    if (!accountHolderName || accountHolderName.length < 2) {
      return { error: "Account holder name required" };
    }
    if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      return { error: "Valid recipient email required" };
    }

    return {
      details: {
        iban,
        account_holder_name: accountHolderName,
        recipient_email: recipientEmail,
      },
    };
  }

  if (paymentMethod === "paypal") {
    const paypalEmail = body.paypalEmail?.trim().toLowerCase();
    if (!paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
      return { error: "Valid PayPal email required" };
    }

    return { details: { paypal_email: paypalEmail } };
  }

  const walletAddress = body.walletAddress?.trim();
  const network = body.network?.trim().toUpperCase();

  if (!walletAddress || walletAddress.length < 10) {
    return { error: "Valid USDT wallet address required" };
  }
  if (!network || !(USDT_NETWORKS as readonly string[]).includes(network)) {
    return { error: "Valid USDT network required" };
  }

  return {
    details: {
      wallet_address: walletAddress,
      network,
    },
  };
}

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
    paymentMethod?: string;
    iban?: string;
    accountHolderName?: string;
    recipientEmail?: string;
    paypalEmail?: string;
    walletAddress?: string;
    network?: string;
    kycAcknowledged?: boolean;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const amountCents = body.amountCents;
  const paymentMethod = body.paymentMethod?.trim();
  const kycAcknowledged = body.kycAcknowledged === true;

  if (typeof amountCents !== "number" || !Number.isInteger(amountCents) || amountCents <= 0) {
    return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
  }

  if (amountCents < MIN_WITHDRAWAL_CENTS) {
    return NextResponse.json({ error: "Minimum withdrawal is $50.00" }, { status: 400 });
  }

  if (!paymentMethod || !isPaymentMethod(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  if (!kycAcknowledged) {
    return NextResponse.json({ error: "KYC policy acknowledgement required" }, { status: 400 });
  }

  const paymentDetailsResult = buildPaymentDetails(paymentMethod, body);
  if ("error" in paymentDetailsResult) {
    return NextResponse.json({ error: paymentDetailsResult.error }, { status: 400 });
  }

  const { data: withdrawalId, error } = await supabase.rpc("request_clash_coin_withdrawal", {
    p_amount_cents: amountCents,
    p_payment_method: paymentMethod,
    p_payment_details: paymentDetailsResult.details,
    p_kyc_acknowledged: kycAcknowledged,
  });

  if (error) {
    const message =
      error.message?.includes("payout kyc approval required")
        ? "Payout KYC approval required"
        : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
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
