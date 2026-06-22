"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatUsdFromCents,
  type PaymentMethod,
  type WithdrawalStatus,
} from "@/lib/clashCoins";
import {
  BankTransferIcon,
  PayPalIcon,
  UsdtIcon,
} from "@/components/wallet/PaymentMethodIcons";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type AdminWithdrawal = {
  id: string;
  user_id: string;
  coin_amount: number;
  usd_amount: number;
  payment_method: PaymentMethod;
  payment_destination: string;
  payment_details?: {
    iban?: string;
    account_holder_name?: string;
    recipient_email?: string;
    paypal_email?: string;
    wallet_address?: string;
    network?: string;
  } | null;
  status: WithdrawalStatus;
  fraud_flags: unknown[];
  admin_notes: string | null;
  created_at: string;
  username?: string | null;
};

const STATUS_FILTERS: Array<WithdrawalStatus | "all"> = [
  "all",
  "pending",
  "reviewing",
  "fraud_blocked",
  "completed",
  "rejected",
];

function PaymentMethodBadge({
  method,
  label,
}: {
  method: PaymentMethod;
  label: string;
}) {
  const Icon =
    method === "paypal" ? PayPalIcon : method === "crypto_usdt" ? UsdtIcon : BankTransferIcon;

  return (
    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/80 px-3 py-1">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-semibold text-zinc-100">{label}</span>
    </div>
  );
}

export function AdminWithdrawalsPanel() {
  const { t, locale, formatNumber, formatDateTime } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [statusFilter, setStatusFilter] = useState<WithdrawalStatus | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadWithdrawals = useCallback(async () => {
    if (!supabase) return;

    setLoading(true);
    setError(null);

    let query = supabase
      .from("withdrawals")
      .select(
        "id, user_id, coin_amount, usd_amount, payment_method, payment_destination, payment_details, status, fraud_flags, admin_notes, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    const userIds = [...new Set(rows.map((row) => row.user_id))];

    let profileMap = new Map<string, string>();
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);
      profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]));
    }

    setWithdrawals(
      rows.map((row) => ({
        ...row,
        username: profileMap.get(row.user_id) ?? null,
      })) as AdminWithdrawal[],
    );
    setLoading(false);
  }, [supabase, statusFilter]);

  useEffect(() => {
    void loadWithdrawals();
  }, [loadWithdrawals]);

  async function resolveWithdrawal(
    withdrawalId: string,
    status: "completed" | "rejected" | "reviewing",
  ) {
    if (!supabase) return;

    setMessage(null);
    setError(null);

    const { error: rpcError } = await supabase.rpc("resolve_clash_coin_withdrawal", {
      p_withdrawal_id: withdrawalId,
      p_status: status,
      p_admin_notes: null,
    });

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    setMessage(t.admin.saved);
    await loadWithdrawals();
  }

  function paymentMethodLabel(method: PaymentMethod) {
    return t.wallet.paymentMethodLabels[method] ?? method;
  }

  function renderPaymentDetails(withdrawal: AdminWithdrawal) {
    const details = withdrawal.payment_details;

    if (withdrawal.payment_method === "bank_transfer") {
      return (
        <>
          {details?.iban ? (
            <p className="mt-1 text-xs text-zinc-300">
              {t.wallet.ibanLabel}: {details.iban}
            </p>
          ) : null}
          {details?.account_holder_name ? (
            <p className="mt-1 text-xs text-zinc-300">
              {t.wallet.accountHolderLabel}: {details.account_holder_name}
            </p>
          ) : null}
          {details?.recipient_email ? (
            <p className="mt-1 text-xs text-zinc-300">
              {t.wallet.recipientEmailLabel}: {details.recipient_email}
            </p>
          ) : (
            <p className="mt-1 text-xs text-zinc-500">{withdrawal.payment_destination}</p>
          )}
        </>
      );
    }

    if (withdrawal.payment_method === "paypal") {
      return (
        <p className="mt-1 text-xs text-zinc-300">
          {t.wallet.paypalEmailLabel}: {details?.paypal_email ?? withdrawal.payment_destination}
        </p>
      );
    }

    return (
      <>
        {details?.network ? (
          <p className="mt-1 text-xs text-zinc-300">
            {t.wallet.usdtNetworkLabel}: {details.network}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-zinc-300">
          {t.wallet.usdtWalletLabel}: {details?.wallet_address ?? withdrawal.payment_destination}
        </p>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.withdrawalsTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.withdrawalsSubtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              statusFilter === status
                ? "bg-accent text-white"
                : "border border-zinc-700 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {status === "all" ? t.admin.allStatuses : t.wallet.withdrawalStatuses[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : withdrawals.length === 0 ? (
        <p className="text-sm text-zinc-400">{t.admin.noWithdrawals}</p>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <article
              key={withdrawal.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    @{withdrawal.username ?? withdrawal.user_id.slice(0, 8)}
                  </p>
                  <p className="mt-1 text-lg font-bold text-amber-300">
                    {formatUsdFromCents(withdrawal.coin_amount, locale)}
                  </p>
                  <PaymentMethodBadge
                    method={withdrawal.payment_method}
                    label={paymentMethodLabel(withdrawal.payment_method)}
                  />
                  {renderPaymentDetails(withdrawal)}
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatDateTime(withdrawal.created_at)}
                  </p>
                </div>

                <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-200">
                  {t.wallet.withdrawalStatuses[withdrawal.status]}
                </span>
              </div>

              {Array.isArray(withdrawal.fraud_flags) && withdrawal.fraud_flags.length > 0 ? (
                <p className="mt-3 rounded-xl border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-300">
                  {t.admin.fraudFlags}: {JSON.stringify(withdrawal.fraud_flags)}
                </p>
              ) : null}

              {!["completed", "rejected"].includes(withdrawal.status) ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => resolveWithdrawal(withdrawal.id, "reviewing")}
                    className="rounded-full border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/10"
                  >
                    {t.admin.markReviewing}
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveWithdrawal(withdrawal.id, "completed")}
                    className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    {t.admin.approveWithdrawal}
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveWithdrawal(withdrawal.id, "rejected")}
                    className="rounded-full bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    {t.admin.rejectWithdrawal}
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
