"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FollowerCount } from "@/components/FollowButton";
import { HunterLevelBadge } from "@/components/HunterLevelBadge";
import { PointsPanel } from "@/components/PointsPanel";
import { VideoCard } from "@/components/VideoCard";
import { profileToVideoChannel } from "@/components/VideoCardChannel";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { createBrowserClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { getPublicStorageUrl } from "@/lib/upload";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import type { Profile, Video } from "@/lib/types";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileContent() {
  const router = useRouter();
  const { user, loading: authLoading, refreshProfile } = useAuth();
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const config = useMemo(() => getSupabaseConfig(), []);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState(0);

  const hasChanges =
    profile !== null &&
    (displayName.trim() !== (profile.display_name ?? profile.username) ||
      bio.trim() !== (profile.bio ?? ""));

  const loadProfile = useCallback(async () => {
    if (!supabase || !user) return;

    setLoading(true);
    setError(null);

    let { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!profileData) {
      const username =
        user.email?.split("@")[0]?.replace(/[^a-z0-9_]/gi, "").toLowerCase() ||
        `clash${user.id.slice(0, 4)}`;

      const { data: created, error: createError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username,
          display_name:
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            username,
        })
        .select("*")
        .single();

      if (createError) {
        setError(createError.message);
        setLoading(false);
        return;
      }

      profileData = created;
    } else if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    const [{ count: followers }, { data: videoData }] = await Promise.all([
      supabase
        .from("channel_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profileData.id),
      supabase
        .from("videos")
        .select(
          "id, title, thumbnail_url, video_url, likes_count, comments_count, views_count, shares_count, created_at, hashtags, duration_seconds, user_id, moderation_status, rejection_reason",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    setFollowerCount(followers ?? 0);
    setProfile(profileData);
    setDisplayName(profileData.display_name ?? profileData.username);
    setBio(profileData.bio ?? "");
    setVideos(
      (videoData ?? []).map((video) => ({
        ...video,
        trending_score: 0,
        channel: profileToVideoChannel(profileData, followers ?? 0),
      })),
    );
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    loadProfile();
  }, [authLoading, user, router, loadProfile]);

  async function uploadImage(
    bucket: "avatars" | "banners",
    file: File,
    field: "avatar_url" | "banner_url",
    setUploading: (value: boolean) => void,
  ) {
    if (!supabase || !user || !config || !profile) return;

    setUploading(true);
    setError(null);
    setMessage(null);

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const publicUrl = getPublicStorageUrl(config.url, bucket, path);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ [field]: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setUploading(false);
      return;
    }

    setProfile({ ...profile, [field]: publicUrl });
    setMessage(field === "avatar_url" ? t.profile.avatarSaved : t.profile.bannerSaved);
    setUploading(false);

    if (field === "avatar_url") {
      await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
          picture: publicUrl,
        },
      });
      await refreshProfile();
    }
  }

  async function saveProfile() {
    if (!supabase || !user || !profile) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    const nextDisplayName = displayName.trim() || profile.username;
    const nextBio = bio.trim();

    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: nextDisplayName,
        bio: nextBio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("*")
      .single();

    if (updateError) {
      setSaving(false);
      setError(updateError.message);
      return;
    }

    await supabase.auth.updateUser({
      data: {
        full_name: nextDisplayName,
      },
    });

    setProfile(updated);
    setDisplayName(updated.display_name ?? updated.username);
    setBio(updated.bio ?? "");
    setSaving(false);
    setMessage(t.profile.saved);
    await refreshProfile();
  }

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.profile.loading}</p>
      </div>
    );
  }

  if (!profile || !user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl bg-white dark:bg-black">
      <div className="relative h-40 overflow-hidden bg-zinc-200 sm:h-52 dark:bg-zinc-900">
        {profile.banner_url ? (
          <Image
            src={profile.banner_url}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        ) : null}
        <label className="absolute top-4 right-4 cursor-pointer rounded-full border border-zinc-300 bg-white/90 px-3 py-1.5 text-xs font-medium text-black backdrop-blur-sm dark:border-zinc-700 dark:bg-black/80 dark:text-white">
          {uploadingBanner ? t.profile.uploading : t.profile.changeBanner}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploadingBanner}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                uploadImage("banners", file, "banner_url", setUploadingBanner);
              }
            }}
          />
        </label>
      </div>

      <div className="px-4 pb-10 sm:px-6">
        <div className="-mt-12 flex flex-col gap-3 sm:-mt-14 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-zinc-200 sm:h-28 sm:w-28 dark:border-black dark:bg-zinc-900">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name ?? profile.username}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-zinc-500">
                  {getInitials(displayName || profile.username)}
                </div>
              )}
              <label className="absolute inset-x-0 bottom-0 cursor-pointer bg-black/60 py-1 text-center text-[10px] font-medium text-white">
                {uploadingAvatar ? "..." : t.profile.changeAvatar}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingAvatar}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      uploadImage("avatars", file, "avatar_url", setUploadingAvatar);
                    }
                  }}
                />
              </label>
            </div>

            <div className="min-w-0 pt-12 sm:pt-14">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold leading-tight text-black sm:text-3xl dark:text-white">
                  {displayName.trim() || profile.username}
                </h1>
                {profile.is_verified ? <VerifiedBadge size="md" /> : null}
              </div>
              <div className="mt-2">
                <HunterLevelBadge level={profile.level} points={profile.points} size="md" />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <Link
                  href={`/channel/${profile.username}`}
                  className="hover:text-black dark:hover:text-white"
                >
                  @{profile.username}
                </Link>
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                <span>
                  {videos.length} {t.profile.videosCount}
                </span>
                <span aria-hidden>·</span>
                <FollowerCount count={followerCount} />
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-12 sm:pt-14">
            <Link
              href="/upload"
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
            >
              {t.upload.create}
            </Link>
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving || !hasChanges}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-950"
            >
              {saving ? t.profile.saving : t.profile.saveChanges}
            </button>
          </div>
        </div>

        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (hasChanges && !saving) {
              saveProfile();
            }
          }}
        >
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-black dark:text-white">
              {t.profile.displayName}
            </span>
            <input
              value={displayName}
              onChange={(event) => {
                setDisplayName(event.target.value);
                setMessage(null);
              }}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:text-white"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-black dark:text-white">
              {t.profile.bio}
            </span>
            <textarea
              value={bio}
              onChange={(event) => {
                setBio(event.target.value);
                setMessage(null);
              }}
              rows={3}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:text-white"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={saving || !hasChanges}
              className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {saving ? t.profile.saving : t.profile.saveChanges}
            </button>
            {hasChanges && !saving && (
              <span className="text-sm text-amber-600 dark:text-amber-400">
                {t.profile.unsavedChanges}
              </span>
            )}
          </div>
        </form>

        <PointsPanel profile={profile} onProfileRefresh={loadProfile} />

        {message && (
          <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-black dark:text-white">{t.profile.myVideos}</h2>
          {videos.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{t.profile.noVideos}</p>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  rank={index + 1}
                  showModerationStatus
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
