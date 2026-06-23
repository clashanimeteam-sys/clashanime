"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminNavBadge } from "@/components/admin/AdminNavBadge";
import { AdminTopHashtags } from "@/components/admin/AdminTopHashtags";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAdminReviewCountsContext } from "@/providers/AdminReviewCountsProvider";
import { useLocale } from "@/providers/LocaleProvider";

type DashboardStats = {
  users: number;
  videos: number;
  reviewVideos: number;
  openReports: number;
  bannedUsers: number;
  activeHunters: number;
  pendingVerifications: number;
  communityPosts: number;
  bountyEvents: number;
  clipChallenges: number;
  pointsWagerDuels: number;
  pendingWagerInvites: number;
  pendingWithdrawals: number;
  pendingKyc: number;
  openContactMessages: number;
  welcomeEmailsSent: number;
  accountDeletions: number;
    inAppNotifications: number;
    legendWinners: number;
  };

export function AdminDashboard() {
  const { t, formatNumber, formatDateTime } = useLocale();
  const { counts } = useAdminReviewCountsContext();
  const supabase = useMemo(() => createBrowserClient(), []);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;

    async function loadStats() {
      if (!supabase) return;

      const client = supabase;
      const [
        { count: users },
        { count: videos },
        { count: reviewVideos },
        { count: openReports },
        { count: bannedUsers },
        { count: activeHunters },
        { count: pendingVerifications },
        { count: communityPosts },
        { count: bountyEvents },
        clipChallengesResult,
        pointsWagerDuelsResult,
        pendingWagerInvitesResult,
        pendingWithdrawalsResult,
        pendingKycResult,
        openContactMessagesResult,
        welcomeEmailsResult,
        accountDeletionsResult,
        inAppNotificationsResult,
        legendWinnersResult,
      ] = await Promise.all([
        client.from("profiles").select("*", { count: "exact", head: true }),
        client.from("videos").select("*", { count: "exact", head: true }),
        client
          .from("videos")
          .select("*", { count: "exact", head: true })
          .in("moderation_status", ["review", "pending"]),
        client
          .from("content_reports")
          .select("*", { count: "exact", head: true })
          .eq("status", "open"),
        client.from("profiles").select("*", { count: "exact", head: true }).eq("is_banned", true),
        client.from("profiles").select("*", { count: "exact", head: true }).gt("points", 0),
        client
          .from("verification_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        client.from("community_posts").select("*", { count: "exact", head: true }),
        client.from("point_transactions").select("*", { count: "exact", head: true }),
        client.from("video_duels").select("*", { count: "exact", head: true }).then((result) => {
          if (result.error) {
            return { count: null as number | null, error: true as const };
          }
          return { count: result.count, error: false as const };
        }),
        client.from("points_wager_duels").select("*", { count: "exact", head: true }).then((result) => {
          if (result.error) {
            return { count: null as number | null, error: true as const };
          }
          return { count: result.count, error: false as const };
        }),
        client
          .from("points_wager_duels")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")
          .then((result) => {
            if (result.error) {
              return { count: null as number | null, error: true as const };
            }
            return { count: result.count, error: false as const };
          }),
        client
          .from("withdrawals")
          .select("*", { count: "exact", head: true })
          .in("status", ["pending", "reviewing", "fraud_blocked"])
          .then((result) => {
            if (result.error) {
              return { count: null as number | null, error: true as const };
            }
            return { count: result.count, error: false as const };
          }),
        client
          .from("payout_kyc_submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")
          .then((result) => {
            if (result.error) {
              return { count: null as number | null, error: true as const };
            }
            return { count: result.count, error: false as const };
          }),
        client
          .from("contact_messages")
          .select("*", { count: "exact", head: true })
          .eq("status", "open")
          .then((result) => {
            if (result.error) {
              return { count: null as number | null, error: true as const };
            }
            return { count: result.count, error: false as const };
          }),
        client
          .from("transactional_emails")
          .select("*", { count: "exact", head: true })
          .eq("email_type", "welcome")
          .eq("status", "sent")
          .then((result) => {
            if (result.error) {
              return { count: null as number | null, error: true as const };
            }
            return { count: result.count, error: false as const };
          }),
        client
          .from("account_deletion_log")
          .select("*", { count: "exact", head: true })
          .then((result) => {
            if (result.error) {
              return { count: null as number | null, error: true as const };
            }
            return { count: result.count, error: false as const };
          }),
        client
          .from("user_notifications")
          .select("*", { count: "exact", head: true })
          .then((result) => {
            if (result.error) {
              return { count: null as number | null, error: true as const };
            }
            return { count: result.count, error: false as const };
          }),
        client
          .from("clash_season_winners")
          .select("*", { count: "exact", head: true })
          .then((result) => {
            if (result.error) {
              return { count: null as number | null, error: true as const };
            }
            return { count: result.count, error: false as const };
          }),
      ]);

      const clipChallengesCount =
        clipChallengesResult.error ? 0 : (clipChallengesResult.count ?? 0);

      const pointsWagerDuelsCount =
        pointsWagerDuelsResult.error ? 0 : (pointsWagerDuelsResult.count ?? 0);

      const pendingWagerInvitesCount =
        pendingWagerInvitesResult.error ? 0 : (pendingWagerInvitesResult.count ?? 0);

      const pendingWithdrawalsCount =
        pendingWithdrawalsResult.error ? 0 : (pendingWithdrawalsResult.count ?? 0);

      const pendingKycCount = pendingKycResult.error ? 0 : (pendingKycResult.count ?? 0);
      const openContactMessagesCount =
        openContactMessagesResult.error ? 0 : (openContactMessagesResult.count ?? 0);
      const welcomeEmailsSentCount =
        welcomeEmailsResult.error ? 0 : (welcomeEmailsResult.count ?? 0);
      const accountDeletionsCount =
        accountDeletionsResult.error ? 0 : (accountDeletionsResult.count ?? 0);
      const inAppNotificationsCount =
        inAppNotificationsResult.error ? 0 : (inAppNotificationsResult.count ?? 0);
      const legendWinnersCount =
        legendWinnersResult.error ? 0 : (legendWinnersResult.count ?? 0);

      setStats({
        users: users ?? 0,
        videos: videos ?? 0,
        reviewVideos: reviewVideos ?? 0,
        openReports: openReports ?? 0,
        bannedUsers: bannedUsers ?? 0,
        activeHunters: activeHunters ?? 0,
        pendingVerifications: pendingVerifications ?? 0,
        communityPosts: communityPosts ?? 0,
        bountyEvents: bountyEvents ?? 0,
        clipChallenges: clipChallengesCount,
        pointsWagerDuels: pointsWagerDuelsCount,
        pendingWagerInvites: pendingWagerInvitesCount,
        pendingWithdrawals: pendingWithdrawalsCount,
        pendingKyc: pendingKycCount,
        openContactMessages: openContactMessagesCount,
        welcomeEmailsSent: welcomeEmailsSentCount,
        accountDeletions: accountDeletionsCount,
        inAppNotifications: inAppNotificationsCount,
        legendWinners: legendWinnersCount,
      });
      setLoading(false);
    }

    loadStats();
  }, [supabase]);

  const cards = [
    { label: t.admin.stats.users, value: stats?.users ?? 0, href: "/admin/users" },
    { label: t.admin.stats.activeHunters, value: stats?.activeHunters ?? 0, href: "/admin/users" },
    { label: t.admin.stats.bountyEvents, value: stats?.bountyEvents ?? 0, href: "/admin/users" },
    { label: t.admin.stats.clipChallenges, value: stats?.clipChallenges ?? 0, href: "/exclusives" },
    { label: t.admin.stats.pointsWagerDuels, value: stats?.pointsWagerDuels ?? 0, href: "/exclusives" },
    { label: t.admin.stats.pendingWagerInvites, value: stats?.pendingWagerInvites ?? 0, href: "/exclusives" },
    {
      label: t.admin.stats.pendingWithdrawals,
      value: counts.pendingWithdrawals,
      href: "/admin/withdrawals",
      review: true,
    },
    { label: t.admin.stats.pendingKyc, value: counts.pendingKyc, href: "/admin/kyc", review: true },
    {
      label: t.admin.stats.openContactMessages,
      value: counts.openContactMessages,
      href: "/admin/contact",
      review: true,
    },
    { label: t.admin.stats.welcomeEmailsSent, value: stats?.welcomeEmailsSent ?? 0, href: "/admin/emails" },
    { label: t.admin.stats.accountDeletions, value: stats?.accountDeletions ?? 0, href: "/admin/emails" },
    { label: t.admin.stats.inAppNotifications, value: stats?.inAppNotifications ?? 0, href: "/admin/emails" },
    { label: t.admin.stats.legendWinners, value: stats?.legendWinners ?? 0, href: "/admin/legends" },
    {
      label: t.admin.stats.pendingVerifications,
      value: counts.pendingVerifications,
      href: "/admin/users",
      review: true,
    },
    { label: t.admin.stats.communityPosts, value: stats?.communityPosts ?? 0, href: "/community" },
    { label: t.admin.stats.videos, value: stats?.videos ?? 0, href: "/admin/videos" },
    {
      label: t.admin.stats.reviewQueue,
      value: counts.reviewVideos,
      href: "/admin/videos?status=review",
      review: true,
    },
    {
      label: t.admin.stats.openReports,
      value: counts.openReports,
      href: "/admin/reports",
      review: true,
    },
    { label: t.admin.stats.bannedUsers, value: stats?.bannedUsers ?? 0, href: "/admin/users?filter=banned" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.admin.dashboardTitle}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t.admin.dashboardSubtitle}</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">{t.admin.loading}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className={`rounded-2xl border p-5 transition-colors hover:border-accent/40 ${
                card.review && card.value > 0
                  ? "border-red-500/40 bg-red-500/5"
                  : "border-zinc-800 bg-zinc-900/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-zinc-400">{card.label}</p>
                {card.review ? <AdminNavBadge count={card.value} /> : null}
              </div>
              <p className="mt-2 text-3xl font-bold text-white">{formatNumber(card.value)}</p>
            </Link>
          ))}
        </div>
      )}

      <AdminTopHashtags />

      <div className="grid gap-4 lg:grid-cols-2">
        <QuickLink
          title={t.admin.quickActions.reviewVideos}
          description={t.admin.quickActions.reviewVideosDesc}
          href="/admin/videos?status=review"
          badge={counts.reviewVideos}
        />
        <QuickLink
          title={t.admin.quickActions.handleReports}
          description={t.admin.quickActions.handleReportsDesc}
          href="/admin/reports"
          badge={counts.openReports}
        />
        <QuickLink
          title={t.admin.quickActions.manageUsers}
          description={t.admin.quickActions.manageUsersDesc}
          href="/admin/users"
        />
        <QuickLink
          title={t.points.systemTitle}
          description={t.points.bountyRewardsHint}
          href="/admin/users"
        />
        <QuickLink
          title={t.admin.quickActions.siteSettings}
          description={t.admin.quickActions.siteSettingsDesc}
          href="/admin/settings"
        />
        <QuickLink
          title={t.admin.beatsLounge.title}
          description={t.admin.beatsLounge.subtitle}
          href="/admin/beats-lounge"
        />
        <QuickLink
          title={t.admin.animeTracker.title}
          description={t.admin.animeTracker.subtitle}
          href="/admin/anime-tracker"
        />
        <QuickLink
          title={t.admin.quickActions.animeRadioSettings}
          description={t.admin.quickActions.animeRadioSettingsDesc}
          href="/admin/settings#anime-radio"
        />
        <QuickLink
          title={t.admin.quickActions.exclusivesFeatures}
          description={t.admin.quickActions.exclusivesFeaturesDesc}
          href="/exclusives"
        />
        <QuickLink
          title={t.admin.legends.title}
          description={t.admin.legends.subtitle}
          href="/admin/legends"
        />
        <QuickLink
          title={t.admin.quickActions.pointsWagerDuels}
          description={t.admin.quickActions.pointsWagerDuelsDesc}
          href="/exclusives"
        />
        <QuickLink
          title={t.admin.quickActions.reviewKyc}
          description={t.admin.quickActions.reviewKycDesc}
          href="/admin/kyc"
          badge={counts.pendingKyc}
        />
        <QuickLink
          title={t.admin.quickActions.reviewContact}
          description={t.admin.quickActions.reviewContactDesc}
          href="/admin/contact"
          badge={counts.openContactMessages}
        />
        <QuickLink
          title={t.admin.quickActions.reviewWithdrawals}
          description={t.admin.quickActions.reviewWithdrawalsDesc}
          href="/admin/withdrawals"
          badge={counts.pendingWithdrawals}
        />
      </div>
    </div>
  );
}

function QuickLink({
  title,
  description,
  href,
  badge = 0,
}: {
  title: string;
  description: string;
  href: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border p-5 transition-colors hover:border-zinc-700 ${
        badge > 0 ? "border-red-500/40 bg-red-500/5" : "border-zinc-800 bg-black"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <AdminNavBadge count={badge} />
      </div>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </Link>
  );
}
