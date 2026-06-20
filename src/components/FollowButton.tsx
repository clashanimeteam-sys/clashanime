"use client";

import { useMemo, useState } from "react";
import { useRequireSubscription } from "@/hooks/useRequireSubscription";
import { createBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";

type FollowButtonProps = {
  channelId: string;
  initialFollowing: boolean;
  initialFollowerCount: number;
  onFollowerCountChange?: (count: number) => void;
};

export function FollowButton({
  channelId,
  initialFollowing,
  initialFollowerCount,
  onFollowerCountChange,
}: FollowButtonProps) {
  const { requireSubscription } = useRequireSubscription();
  const { user } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);

  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [loading, setLoading] = useState(false);

  function updateCount(next: number) {
    setFollowerCount(next);
    onFollowerCountChange?.(next);
  }

  async function toggleFollow() {
    if (!requireSubscription()) return;

    if (!supabase || !user || user.id === channelId) return;

    setLoading(true);

    if (isFollowing) {
      const { error } = await supabase
        .from("channel_follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", channelId);

      if (!error) {
        setIsFollowing(false);
        updateCount(Math.max(0, followerCount - 1));
      }
    } else {
      const { error } = await supabase.from("channel_follows").insert({
        follower_id: user.id,
        following_id: channelId,
      });

      if (!error) {
        setIsFollowing(true);
        updateCount(followerCount + 1);
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggleFollow}
        disabled={loading || user?.id === channelId}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          isFollowing
            ? "border border-zinc-300 bg-transparent text-black hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-950"
            : "bg-black text-white hover:opacity-90 dark:bg-white dark:text-black"
        }`}
      >
        {loading
          ? t.profile.followingLoading
          : isFollowing
            ? t.profile.unfollow
            : t.profile.follow}
      </button>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {followerCount.toLocaleString()} {t.profile.followers}
      </p>
    </div>
  );
}

export function FollowerCount({ count }: { count: number }) {
  const { t } = useLocale();

  return (
    <span className="text-sm text-zinc-600 dark:text-zinc-400">
      {count.toLocaleString()} {t.profile.followers}
    </span>
  );
}
