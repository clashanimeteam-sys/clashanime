"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  CONVERSION_POINTS_STEP,
  formatConversionPreviewAmount,
  formatUsd,
  formatUsdFromCents,
  isValidConversionAmount,
  MIN_CONVERSION_POINTS,
  MIN_WITHDRAWAL_CENTS,
  MIN_WITHDRAWAL_USD,
  parseUsdInput,
  POINTS_PER_DOLLAR,
  pointsToUsd,
  USDT_NETWORKS,
  type PaymentMethod,
  type WithdrawalRequest,
} from "@/lib/clashCoins";
import {
  BankTransferIcon,
  PayPalIcon,
  UsdtIcon,
} from "@/components/wallet/PaymentMethodIcons";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import type { Profile } from "@/lib/types";

type ClashWalletPanelProps = {
  profile: Profile;
  onProfileRefresh?: () => Promise<void>;
};

function panelBoxClassName(extra = "") {
  return `overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-amber-50/50 p-5 dark:border-zinc-800 dark:from-zinc-950 dark:via-black dark:to-amber-950/20 ${extra}`.trim();
}

const PAYMENT_METHOD_OPTIONS: Array<{
  id: PaymentMethod;
  Icon: typeof BankTransferIcon;
}> = [
  { id: "bank_transfer", Icon: BankTransferIcon },
  { id: "paypal", Icon: PayPalIcon },
  { id: "crypto_usdt", Icon: UsdtIcon },
];

export function ClashWalletPanel({ profile, onProfileRefresh }: ClashWalletPanelProps) {
  const { t, locale } = useLocale();
  const { refreshProfile } = useAuth();
  const supabase = useMemo(() => createBrowserClient(), []);

  const totalPoints = profile.points ?? 0;
  const balanceCents = profile.clash_coins ?? 0;
  const maxConvertPoints =
    Math.floor(totalPoints / CONVERSION_POINTS_STEP) * CONVERSION_POINTS_STEP;

  const [convertPoints, setConvertPoints] = useState(
    maxConvertPoints >= MIN_CONVERSION_POINTS ? String(MIN_CONVERSION_POINTS) : "",
  );
  const [withdrawUsd, setWithdrawUsd] = useState(String(MIN_WITHDRAWAL_USD));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [iban, setIban] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [usdtNetwork, setUsdtNetwork] = useState<(typeof USDT_NETWORKS)[number]>("TRC20");
  const [kycAcknowledged, setKycAcknowledged] = useState(false);
  const [converting, setConverting] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);

  const loadWithdrawals = useCallback(async () => {
    if (!supabase) return;

    const { data } = await supabase
      .from("withdrawals")
      .select(
        "id, coin_amount, usd_amount, payment_method, payment_destination, payment_details, status, kyc_acknowledged, fraud_flags, admin_notes, created_at, updated_at",
      )
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10);

    setWithdrawals((data ?? []) as WithdrawalRequest[]);
    setLoadingWithdrawals(false);
  }, [supabase, profile.id]);

  useEffect(() => {
    void loadWithdrawals();
  }, [loadWithdrawals]);

  async function refreshAll() {
    await Promise.all([refreshProfile({ silent: true }), onProfileRefresh?.(), loadWithdrawals()]);
  }

  async function handleConvert(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConverting(true);
    setError(null);
    setMessage(null);

    const points = Number(convertPoints);
    if (!Number.isInteger(points) || !isValidConversionAmount(points)) {
      setError(t.wallet.convertMinError);
      setConverting(false);
      return;
    }

    try {
      const response = await fetch("/api/wallet/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? t.wallet.convertFailed);
        setConverting(false);
        return;
      }

      setMessage(t.wallet.convertSuccess);
      await refreshAll();
    } catch {
      setError(t.wallet.convertFailed);
    }

    setConverting(false);
  }

  async function handleWithdraw(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWithdrawing(true);
    setError(null);
    setMessage(null);

    const amountCents = parseUsdInput(withdrawUsd);
    if (amountCents === null || amountCents < MIN_WITHDRAWAL_CENTS) {
      setError(t.wallet.withdrawMinError);
      setWithdrawing(false);
      return;
    }

    if (!kycAcknowledged) {
      setError(t.wallet.kycRequired);
      setWithdrawing(false);
      return;
    }

    try {
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents,
          paymentMethod,
          iban: iban.trim(),
          accountHolderName: accountHolderName.trim(),
          recipientEmail: recipientEmail.trim(),
          paypalEmail: paypalEmail.trim(),
          walletAddress: walletAddress.trim(),
          network: usdtNetwork,
          kycAcknowledged,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        withdrawal?: { status?: string };
      };

      if (!response.ok) {
        setError(payload.error ?? t.wallet.withdrawFailed);
        setWithdrawing(false);
        return;
      }

      if (payload.withdrawal?.status === "fraud_blocked") {
        setError(t.wallet.fraudBlocked);
      } else {
        setMessage(t.wallet.withdrawPendingNotice);
        setIban("");
        setAccountHolderName("");
        setRecipientEmail("");
        setPaypalEmail("");
        setWalletAddress("");
        setUsdtNetwork("TRC20");
        setKycAcknowledged(false);
      }

      await refreshAll();
    } catch {
      setError(t.wallet.withdrawFailed);
    }

    setWithdrawing(false);
  }

  function withdrawalStatusLabel(status: WithdrawalRequest["status"]) {
    return t.wallet.withdrawalStatuses[status];
  }

  function paymentMethodLabel(method: PaymentMethod) {
    return t.wallet.paymentMethodLabels[method];
  }

  function paymentMethodIcon(method: PaymentMethod, className = "h-5 w-5") {
    if (method === "paypal") return <PayPalIcon className={className} />;
    if (method === "crypto_usdt") return <UsdtIcon className={className} />;
    return <BankTransferIcon className={className} />;
  }

  const previewUsd = formatConversionPreviewAmount(
    pointsToUsd(Number(convertPoints) || 0),
    locale,
  );

  return (
    <section id="clash-wallet" className="space-y-5">
      <div className={panelBoxClassName()}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
              {t.wallet.title}
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-black dark:text-white">
              {t.wallet.subtitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              {t.wallet.description}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 px-6 py-5 text-white shadow-[0_20px_60px_rgba(249,115,22,0.25)]">
            <div className="absolute -end-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
              {t.wallet.balanceLabel}
            </p>
            <p className="mt-2 font-display text-4xl font-black">
              {formatUsdFromCents(balanceCents)}
            </p>
            <p className="mt-1 text-sm text-amber-50/90">ClashCoins</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-xs text-zinc-500">{t.wallet.exchangeRateTitle}</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
              {t.wallet.exchangeRateValue}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-xs text-zinc-500">{t.wallet.minPayoutTitle}</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
              {formatUsd(MIN_WITHDRAWAL_USD)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-xs text-zinc-500">{t.wallet.hunterPointsLabel}</p>
            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
              {totalPoints.toLocaleString()} {t.points.pointsLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={handleConvert} className={panelBoxClassName()}>
          <h3 className="text-lg font-semibold text-black dark:text-white">{t.wallet.convertTitle}</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.wallet.convertDesc}</p>

          <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.wallet.convertAmountLabel}
            <input
              type="number"
              min={MIN_CONVERSION_POINTS}
              step={CONVERSION_POINTS_STEP}
              max={maxConvertPoints || undefined}
              value={convertPoints}
              onChange={(event) => setConvertPoints(event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>

          <p className="mt-2 text-xs text-zinc-500">
            {t.wallet.convertPreview.replace("{amount}", previewUsd)}
          </p>

          <button
            type="submit"
            disabled={converting || maxConvertPoints < MIN_CONVERSION_POINTS}
            className="mt-4 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {converting ? t.wallet.processing : t.wallet.convertButton}
          </button>
        </form>

        <form onSubmit={handleWithdraw} className={panelBoxClassName()}>
          <h3 className="text-lg font-semibold text-black dark:text-white">{t.wallet.withdrawTitle}</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t.wallet.withdrawDesc}</p>

          <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.wallet.withdrawAmountLabel}
            <div className="relative mt-2">
              <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-500">
                $
              </span>
              <input
                type="number"
                min={MIN_WITHDRAWAL_USD}
                step={0.01}
                max={balanceCents / 100 || undefined}
                value={withdrawUsd}
                onChange={(event) => setWithdrawUsd(event.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 ps-8 pe-4 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>
          </label>

          <div className="mt-4">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.wallet.selectPaymentMethod}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {PAYMENT_METHOD_OPTIONS.map(({ id, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-start transition ${
                    paymentMethod === id
                      ? "border-amber-500 bg-amber-50 shadow-sm dark:border-amber-400 dark:bg-amber-950/30"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                  }`}
                >
                  <Icon className="h-7 w-7 shrink-0" />
                  <span className="text-sm font-semibold text-black dark:text-white">
                    {paymentMethodLabel(id)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            {paymentMethod === "bank_transfer" ? (
              <>
                <p className="text-sm font-semibold text-black dark:text-white">{t.wallet.bankTransferTitle}</p>
                <p className="mt-1 text-xs text-zinc-500">{t.wallet.bankTransferDesc}</p>

                <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t.wallet.ibanLabel}
                  <input
                    type="text"
                    value={iban}
                    onChange={(event) => setIban(event.target.value)}
                    placeholder={t.wallet.ibanPlaceholder}
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>

                <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t.wallet.accountHolderLabel}
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(event) => setAccountHolderName(event.target.value)}
                    placeholder={t.wallet.accountHolderPlaceholder}
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>

                <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t.wallet.recipientEmailLabel}
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(event) => setRecipientEmail(event.target.value)}
                    placeholder={t.wallet.recipientEmailPlaceholder}
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>
              </>
            ) : null}

            {paymentMethod === "paypal" ? (
              <>
                <div className="flex items-center gap-3">
                  <PayPalIcon className="h-8 w-8" />
                  <div>
                    <p className="text-sm font-semibold text-black dark:text-white">{t.wallet.paypalTitle}</p>
                    <p className="mt-1 text-xs text-zinc-500">{t.wallet.paypalDesc}</p>
                  </div>
                </div>

                <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t.wallet.paypalEmailLabel}
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(event) => setPaypalEmail(event.target.value)}
                    placeholder={t.wallet.paypalEmailPlaceholder}
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>
              </>
            ) : null}

            {paymentMethod === "crypto_usdt" ? (
              <>
                <div className="flex items-center gap-3">
                  <UsdtIcon className="h-8 w-8" />
                  <div>
                    <p className="text-sm font-semibold text-black dark:text-white">{t.wallet.usdtTitle}</p>
                    <p className="mt-1 text-xs text-zinc-500">{t.wallet.usdtDesc}</p>
                  </div>
                </div>

                <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t.wallet.usdtNetworkLabel}
                  <select
                    value={usdtNetwork}
                    onChange={(event) =>
                      setUsdtNetwork(event.target.value as (typeof USDT_NETWORKS)[number])
                    }
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    {USDT_NETWORKS.map((network) => (
                      <option key={network} value={network}>
                        {network}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t.wallet.usdtWalletLabel}
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(event) => setWalletAddress(event.target.value)}
                    placeholder={t.wallet.usdtWalletPlaceholder}
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>
              </>
            ) : null}
          </div>

          <label className="mt-4 flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={kycAcknowledged}
              onChange={(event) => setKycAcknowledged(event.target.checked)}
              className="mt-1"
            />
            <span>{t.wallet.kycAcknowledgement}</span>
          </label>

          <button
            type="submit"
            disabled={withdrawing || balanceCents < MIN_WITHDRAWAL_CENTS}
            className="mt-4 rounded-full bg-gradient-to-r from-amber-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {withdrawing ? t.wallet.processing : t.wallet.withdrawButton}
          </button>
        </form>
      </div>

      <div className={panelBoxClassName()}>
        <h3 className="text-lg font-semibold text-black dark:text-white">{t.wallet.paymentOptionsTitle}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {PAYMENT_METHOD_OPTIONS.map(({ id, Icon }) => (
            <div
              key={id}
              className="rounded-xl border border-zinc-200 bg-white/70 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-8 w-8 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {paymentMethodLabel(id)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {id === "bank_transfer"
                      ? t.wallet.bankTransferDesc
                      : id === "paypal"
                        ? t.wallet.paypalDesc
                        : t.wallet.usdtDesc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={panelBoxClassName()}>
        <h3 className="text-lg font-semibold text-black dark:text-white">{t.wallet.historyTitle}</h3>
        {loadingWithdrawals ? (
          <p className="mt-3 text-sm text-zinc-500">{t.wallet.loadingHistory}</p>
        ) : withdrawals.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">{t.wallet.noHistory}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {formatUsdFromCents(withdrawal.coin_amount)}
                  </p>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {withdrawalStatusLabel(withdrawal.status)}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                  {paymentMethodIcon(withdrawal.payment_method, "h-4 w-4")}
                  {paymentMethodLabel(withdrawal.payment_method)} ·{" "}
                  {new Date(withdrawal.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {message ? (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-xs text-zinc-500">
        {t.wallet.legalNote}{" "}
        <Link href="/terms" className="text-accent underline-offset-2 hover:underline">
          {t.footer.terms}
        </Link>
      </p>
    </section>
  );
}
