import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function rpcExists(error: { message?: string; code?: string } | null) {
  if (!error) return false;
  return (
    error.message?.includes("not authenticated") ||
    error.message?.includes("minimum") ||
    error.message?.includes("insufficient") ||
    error.message?.includes("invalid") ||
    error.message?.includes("required") ||
    error.message?.includes("staff only") ||
    error.message?.includes("not found") ||
    error.code === "P0001"
  );
}

export async function GET() {
  const supabase = await createServerClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing Supabase configuration",
      },
      { status: 503 },
    );
  }

  const [
    { error: profilesError },
    { error: coinTransactionsError },
    { error: withdrawalsError },
  ] = await Promise.all([
    supabase.from("profiles").select("clash_coins").limit(1),
    supabase.from("coin_transactions").select("id", { head: true, count: "exact" }),
    supabase.from("withdrawals").select("id", { head: true, count: "exact" }),
  ]);

  const clashCoinsColumn = !profilesError;
  const coinTransactionsTable = !coinTransactionsError;
  const withdrawalsTable = !withdrawalsError;

  let convertRpc = false;
  let requestWithdrawalRpc = false;
  let resolveWithdrawalRpc = false;

  if (clashCoinsColumn) {
    const { error } = await supabase.rpc("convert_points_to_clash_coins", {
      point_amount: 1000,
    });
    convertRpc = rpcExists(error);
  }

  if (withdrawalsTable) {
    const { error } = await supabase.rpc("request_clash_coin_withdrawal", {
      p_amount_cents: 5000,
      p_iban: "DE89370400440532013000",
      p_account_holder_name: "Health Check",
      p_recipient_email: "health-check@example.com",
      p_kyc_acknowledged: true,
    });
    requestWithdrawalRpc = rpcExists(error);

    const { error: resolveError } = await supabase.rpc("resolve_clash_coin_withdrawal", {
      p_withdrawal_id: "00000000-0000-0000-0000-000000000000",
      p_status: "completed",
    });
    resolveWithdrawalRpc = rpcExists(resolveError);
  }

  return NextResponse.json({
    ok:
      clashCoinsColumn &&
      coinTransactionsTable &&
      withdrawalsTable &&
      convertRpc &&
      requestWithdrawalRpc &&
      resolveWithdrawalRpc,
    clashCoinsColumn,
    coinTransactionsTable,
    withdrawalsTable,
    convertRpc,
    requestWithdrawalRpc,
    resolveWithdrawalRpc,
    profilesError: profilesError?.message ?? null,
    sqlScripts: [
      "supabase/scripts/production-clash-coins-wallet.sql",
      "supabase/scripts/production-clash-coins-usd-cents-bank-transfer.sql",
    ],
    sqlEditor:
      "https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new",
  });
}
