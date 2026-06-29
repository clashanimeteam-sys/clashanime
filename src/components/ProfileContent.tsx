"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FollowerCount } from "@/components/FollowButton";
import { HunterLevelBadge } from "@/components/HunterLevelBadge";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import { MentionHashtagTextarea } from "@/components/MentionHashtagTextarea";
import { OwnVideoCard } from "@/components/profile/OwnVideoCard";
import { ProfileChannelPreview } from "@/components/profile/ProfileChannelPreview";
import { ProfileSocialLinksEditor, applySocialLinkInput, getProfileSocialUrls, profileSocialUrlsEqual } from "@/components/profile/ProfileSocialLinksEditor";
import { ProfileCountrySetupModal } from "@/components/profile/ProfileCountrySetupModal";
import type { ProfileSocialUrls } from "@/lib/socialLinks";
import type { ChannelCommunityPost } from "@/components/channel/ChannelCommunityPosts";
import { KYC_COUNTRIES, DEFAULT_KYC_COUNTRY, getKycCountryByCode, getKycCountryLabel } from "@/lib/kycCountries";
import { VideoCard } from "@/components/VideoCard";
import { profileToVideoChannel } from "@/components/VideoCardChannel";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { createBrowserClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { deleteMediaObjects } from "@/lib/mediaUpload";
import { uploadToStorageWithFallback } from "@/lib/upload";
import {
  canChangeProfileDisplayNameForProfile,
  getProfileDisplayNameCooldownRemainingDays,
  isDisplayNameCooldownError,
  rememberDisplayNameChange,
} from "@/lib/profileDisplayName";
import {
  canChangeProfileUsernameForProfile,
  getProfileUsernameCooldownRemainingDays,
  isUsernameCooldownError,
  isUsernameInvalidError,
  isUsernameTakenError,
  normalizeUsernameInput,
} from "@/lib/profileUsername";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { useProfileSection } from "@/providers/ProfileSectionProvider";
import type { Profile, Video } from "@/lib/types";

const ReferralPanel = dynamic(
  () => import("@/components/ReferralPanel").then((mod) => mod.ReferralPanel),
  { ssr: false },
);

const PointsPanel = dynamic(
  () => import("@/components/PointsPanel").then((mod) => mod.PointsPanel),
  { ssr: false },
);

const ClashWalletPanel = dynamic(
  () => import("@/components/ClashWalletPanel").then((mod) => mod.ClashWalletPanel),
  { ssr: false },
);

function settingsBoxClassName(extra = "") {
  return `rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 ${extra}`.trim();
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileContent() {
  const router = useRouter();
  const { user, loading: authLoading, refreshProfile, signOut } = useAuth();
  const { t, formatNumber, formatDateTime, locale } = useLocale();
  const { section: activeSection, setSection } = useProfileSection();
  const supabase = useMemo(() => createBrowserClient(), []);
  const config = useMemo(() => getSupabaseConfig(), []);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [communityPosts, setCommunityPosts] = useState<ChannelCommunityPost[]>([]);
  const [videoCount, setVideoCount] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [countryCode, setCountryCode] = useState(DEFAULT_KYC_COUNTRY.code);
  const [socialUrls, setSocialUrls] = useState<ProfileSocialUrls>({
    youtube_url: null,
    instagram_url: null,
    tiktok_url: null,
    twitter_url: null,
    website_url: null,
  });
  const [socialLinkInput, setSocialLinkInput] = useState("");
  const [showCountrySetup, setShowCountrySetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const loadedProfileUserRef = useRef<string | null>(null);

  const displayNameChanged =
    profile !== null &&
    displayName.trim() !== (profile.display_name ?? profile.username);
  const canChangeDisplayName = canChangeProfileDisplayNameForProfile(profile);
  const displayNameCooldownDays = getProfileDisplayNameCooldownRemainingDays(profile);
  const canChangeUsername = canChangeProfileUsernameForProfile(profile);
  const usernameCooldownDays = getProfileUsernameCooldownRemainingDays(profile);
  const usernameChanged =
    profile !== null && normalizeUsernameInput(username) !== profile.username;
  const bioChanged = profile !== null && bio.trim() !== (profile.bio ?? "");
  const countryChanged =
    profile !== null && countryCode !== (profile.country_code ?? DEFAULT_KYC_COUNTRY.code);
  const savedSocialUrls = profile !== null ? getProfileSocialUrls(profile) : null;
  const socialChanged =
    savedSocialUrls !== null &&
    (!profileSocialUrlsEqual(socialUrls, savedSocialUrls) || socialLinkInput.trim().length > 0);

  const previewProfile = useMemo(() => {
    if (!profile) return null;
    const country = getKycCountryByCode(countryCode);
    const previewSocialUrls = socialLinkInput.trim()
      ? applySocialLinkInput(socialUrls, socialLinkInput)
      : socialUrls;
    return {
      ...profile,
      display_name: displayName.trim() || profile.username,
      username: normalizeUsernameInput(username) || profile.username,
      bio: bio.trim(),
      country_code: countryCode,
      country_name: country ? getKycCountryLabel(country, locale) : profile.country_name,
      ...previewSocialUrls,
    };
  }, [profile, displayName, username, bio, countryCode, socialUrls, socialLinkInput, locale]);

  const approvedChannelVideos = useMemo(
    () => videos.filter((video) => video.moderation_status === "approved"),
    [videos],
  );

  const hasChanges =
    profile !== null &&
    ((displayNameChanged && canChangeDisplayName) ||
      (usernameChanged && canChangeUsername) ||
      bioChanged ||
      countryChanged ||
      socialChanged);

  const userId = user?.id;

  const loadProfile = useCallback(async (options?: { silent?: boolean }) => {
    if (!supabase || !userId) return;

    if (!options?.silent) {
      setLoading(true);
      setError(null);
    }

    let { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!profileData) {
      const { data: authData } = await supabase.auth.getUser();
      const authUser = authData.user;
      const username =
        authUser?.email?.split("@")[0]?.replace(/[^a-z0-9_]/gi, "").toLowerCase() ||
        `clash${userId.slice(0, 4)}`;

      const { data: created, error: createError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          username,
          display_name:
            authUser?.user_metadata?.full_name ??
            authUser?.user_metadata?.name ??
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

    const [{ count: followers }, { count: videosTotal }, { data: videoData }, { data: postData }] =
      await Promise.all([
      supabase
        .from("channel_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", profileData.id),
      supabase
        .from("videos")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("videos")
        .select(
          "id, title, thumbnail_url, video_url, likes_count, comments_count, views_count, shares_count, created_at, hashtags, duration_seconds, user_id, moderation_status, rejection_reason",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("community_posts")
        .select(
          "id, body, image_url, created_at, likes_count, dislikes_count, comments_count, shares_count",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

    setFollowerCount(followers ?? 0);
    setVideoCount(videosTotal ?? 0);
    setProfile(profileData);
    if (!options?.silent) {
      setDisplayName(profileData.display_name ?? profileData.username);
      setUsername(profileData.username);
      setBio(profileData.bio ?? "");
      setCountryCode(profileData.country_code ?? DEFAULT_KYC_COUNTRY.code);
      setSocialUrls(getProfileSocialUrls(profileData));
      setSocialLinkInput("");
      setShowCountrySetup(!profileData.country_code);
    }
    if (profileData.display_name_changed_at) {
      rememberDisplayNameChange(profileData.id, profileData.display_name_changed_at);
    }
    setVideos(
      (videoData ?? []).map((video) => ({
        ...video,
        trending_score: 0,
        channel: profileToVideoChannel(profileData, followers ?? 0),
      })),
    );
    setCommunityPosts((postData ?? []) as ChannelCommunityPost[]);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      loadedProfileUserRef.current = null;
      router.replace("/login");
      return;
    }
    if (loadedProfileUserRef.current === user.id) return;
    loadedProfileUserRef.current = user.id;
    void loadProfile();
  }, [authLoading, user?.id, router, loadProfile]);

  useEffect(() => {
    if (!profile || canChangeProfileDisplayNameForProfile(profile)) return;
    setDisplayName(profile.display_name ?? profile.username);
  }, [profile]);

  useEffect(() => {
    if (!profile || canChangeProfileUsernameForProfile(profile)) return;
    setUsername(profile.username);
  }, [profile]);

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
    const filename = `${Date.now()}.${extension}`;

    let publicUrl: string;
    let objectKey: string | null = null;

    try {
      const uploaded = await uploadToStorageWithFallback({
        supabase,
        config,
        folder: bucket,
        bucket,
        storagePath: path,
        filename,
        file,
        upsert: true,
      });
      publicUrl = uploaded.publicUrl;
      objectKey = uploaded.objectKey;
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : t.upload.uploadFailed);
      setUploading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ [field]: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      if (objectKey) {
        await deleteMediaObjects([objectKey]).catch(() => undefined);
      } else {
        await supabase.storage.from(bucket).remove([path]);
      }
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
      await refreshProfile({ silent: true });
    }
  }

  async function saveProfile() {
    if (!supabase || !user || !profile) return;

    const nextDisplayName = displayName.trim() || profile.username;
    const nextBio = bio.trim();
    const nextUsername = normalizeUsernameInput(username) || profile.username;
    const nextCountry = getKycCountryByCode(countryCode) ?? DEFAULT_KYC_COUNTRY;
    const nextSocialUrls = applySocialLinkInput(socialUrls, socialLinkInput);
    const nameChanged = nextDisplayName !== (profile.display_name ?? profile.username);
    const handleChanged = nextUsername !== profile.username;

    if (nameChanged && !canChangeProfileDisplayNameForProfile(profile)) {
      setError(
        t.profile.displayNameCooldown.replace(
          "{days}",
          String(getProfileDisplayNameCooldownRemainingDays(profile)),
        ),
      );
      setDisplayName(profile.display_name ?? profile.username);
      return;
    }

    if (handleChanged && !canChangeProfileUsernameForProfile(profile)) {
      setError(
        t.profile.usernameCooldown.replace(
          "{days}",
          String(getProfileUsernameCooldownRemainingDays(profile)),
        ),
      );
      setUsername(profile.username);
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    let savedProfile: Profile | null = null;
    let saveError: { message: string } | null = null;

    const rpcResult = await supabase.rpc("update_own_profile_settings", {
      p_bio: nextBio,
      p_display_name: nextDisplayName,
      p_username: handleChanged ? nextUsername : null,
      p_country_code: nextCountry.code,
      p_country_name: getKycCountryLabel(nextCountry, locale),
      p_youtube_url: nextSocialUrls.youtube_url ?? "",
      p_instagram_url: nextSocialUrls.instagram_url ?? "",
      p_tiktok_url: nextSocialUrls.tiktok_url ?? "",
      p_twitter_url: nextSocialUrls.twitter_url ?? "",
      p_website_url: nextSocialUrls.website_url ?? "",
    });

    if (!rpcResult.error && rpcResult.data) {
      savedProfile = rpcResult.data as Profile;
    } else {
      const missingRpc =
        rpcResult.error?.code === "PGRST202" ||
        rpcResult.error?.message.includes("update_own_profile_settings") ||
        rpcResult.error?.message.includes("Could not find the function");

      if (!missingRpc) {
        saveError = rpcResult.error;
      } else {
        const patch: {
          bio: string;
          updated_at: string;
          display_name?: string;
          display_name_changed_at?: string;
        } = {
          bio: nextBio,
          updated_at: new Date().toISOString(),
        };

        if (nameChanged) {
          patch.display_name = nextDisplayName;
          patch.display_name_changed_at = new Date().toISOString();
        }

        let directResult = await supabase
          .from("profiles")
          .update(patch)
          .eq("id", user.id)
          .select("*")
          .single();

        if (directResult.error && nameChanged && patch.display_name_changed_at) {
          const { display_name_changed_at: _ignored, ...patchWithoutCooldown } = patch;
          directResult = await supabase
            .from("profiles")
            .update(patchWithoutCooldown)
            .eq("id", user.id)
            .select("*")
            .single();
        }

        savedProfile = directResult.data;
        saveError = directResult.error;
      }
    }

    if (saveError || !savedProfile) {
      setSaving(false);
      if (saveError && isUsernameTakenError(saveError.message)) {
        setError(t.profile.usernameTaken);
        setUsername(profile.username);
        return;
      }
      if (saveError && isUsernameInvalidError(saveError.message)) {
        setError(t.profile.usernameInvalid);
        setUsername(profile.username);
        return;
      }
      setError(
        saveError && isDisplayNameCooldownError(saveError.message)
          ? t.profile.displayNameCooldown.replace(
              "{days}",
              String(getProfileDisplayNameCooldownRemainingDays(profile)),
            )
          : saveError && isUsernameCooldownError(saveError.message)
            ? t.profile.usernameCooldown.replace(
                "{days}",
                String(getProfileUsernameCooldownRemainingDays(profile)),
              )
            : (saveError?.message ?? "Could not save profile."),
      );
      if (saveError && isDisplayNameCooldownError(saveError.message)) {
        setDisplayName(profile.display_name ?? profile.username);
      }
      if (saveError && isUsernameCooldownError(saveError.message)) {
        setUsername(profile.username);
      }
      return;
    }

    const savedNameChanged =
      nextDisplayName !== (profile.display_name ?? profile.username);

    if (savedNameChanged) {
      const changedAt = savedProfile.display_name_changed_at ?? new Date().toISOString();
      rememberDisplayNameChange(user.id, changedAt);
      savedProfile = { ...savedProfile, display_name_changed_at: changedAt };

      await supabase.auth.updateUser({
        data: {
          full_name: nextDisplayName,
        },
      });
    }

    setProfile(savedProfile);
    setDisplayName(savedProfile.display_name ?? savedProfile.username);
    setUsername(savedProfile.username);
    setBio(savedProfile.bio ?? "");
    setCountryCode(savedProfile.country_code ?? DEFAULT_KYC_COUNTRY.code);
    setSocialUrls(getProfileSocialUrls(savedProfile));
    setSocialLinkInput("");
    setShowCountrySetup(!savedProfile.country_code);
    setSaving(false);
    setMessage(t.profile.saved);
    await refreshProfile({ silent: true });
  }

  function handleSignOut() {
    if (!window.confirm(t.auth.confirmSignOut)) return;
    void signOut();
  }

  if ((authLoading || loading) && !profile) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.profile.loading}</p>
      </div>
    );
  }

  if (!profile || !user) {
    if (error) {
      return (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-sm text-red-500" role="alert">
            {error || t.profile.loadFailed}
          </p>
          <button
            type="button"
            onClick={() => void loadProfile()}
            className="mt-4 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            {t.profile.retry}
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={`mx-auto bg-white px-4 pb-10 dark:bg-black sm:px-6 ${
        activeSection === "my-videos" || activeSection === "channel" ? "max-w-[1920px]" : "max-w-6xl"
      }`}
    >
      {activeSection === "settings" ? (
        <>
          <div className={settingsBoxClassName("overflow-hidden p-0")}>
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

            <div className="p-5">
              <div className="-mt-12 flex flex-col gap-3 sm:-mt-14 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-zinc-200 sm:h-28 sm:w-28 dark:border-zinc-950 dark:bg-zinc-900">
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
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <HunterLevelBadge level={profile.level} points={profile.points} size="md" />
                      <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                        {formatNumber(profile.points ?? 0)} {t.points.pointsLabel}
                      </span>
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
                        {videoCount} {t.profile.videosCount}
                      </span>
                      <span aria-hidden>·</span>
                      <FollowerCount count={followerCount} />
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-12 sm:pt-14">
                  <Link
                    href="/upload"
                    className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
                  >
                    {t.upload.create}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <form
            id="settings"
            className={`${settingsBoxClassName("mt-6")} grid gap-4 sm:grid-cols-2`}
            onSubmit={(event) => {
              event.preventDefault();
              if (hasChanges && !saving) {
                saveProfile();
              }
            }}
          >
            <div className="sm:col-span-2">
              <h2 className="text-lg font-semibold text-black dark:text-white">{t.nav.channelSettings}</h2>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                {t.profile.displayName}
              </span>
              <input
                value={displayName}
                onChange={(event) => {
                  if (!canChangeDisplayName) return;
                  setDisplayName(event.target.value);
                  setMessage(null);
                }}
                readOnly={!canChangeDisplayName}
                aria-readonly={!canChangeDisplayName}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:text-white ${
                  canChangeDisplayName
                    ? "border-zinc-300 bg-white text-black dark:border-zinc-700 dark:bg-black"
                    : "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                }`}
              />
              {!canChangeDisplayName ? (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  {t.profile.displayNameCooldown.replace(
                    "{days}",
                    String(displayNameCooldownDays),
                  )}
                </p>
              ) : (
                <p className="mt-2 text-xs text-zinc-500">{t.profile.displayNameCooldownDays}</p>
              )}
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                {t.profile.username}
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
                  @
                </span>
                <input
                  value={username}
                  onChange={(event) => {
                    if (!canChangeUsername) return;
                    setUsername(normalizeUsernameInput(event.target.value));
                    setMessage(null);
                  }}
                  readOnly={!canChangeUsername}
                  aria-readonly={!canChangeUsername}
                  className={`w-full rounded-lg border py-2 ps-7 pe-3 text-sm outline-none focus:border-zinc-500 dark:text-white ${
                    canChangeUsername
                      ? "border-zinc-300 bg-white text-black dark:border-zinc-700 dark:bg-black"
                      : "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                  }`}
                />
              </div>
              {!canChangeUsername ? (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  {t.profile.usernameCooldown.replace("{days}", String(usernameCooldownDays))}
                </p>
              ) : (
                <p className="mt-2 text-xs text-zinc-500">{t.profile.usernameCooldownDays}</p>
              )}
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                {t.profile.profileCountry}
              </span>
              <select
                value={countryCode}
                onChange={(event) => {
                  setCountryCode(event.target.value);
                  setMessage(null);
                }}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:text-white"
              >
                {KYC_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {getKycCountryLabel(country, locale)}
                  </option>
                ))}
              </select>
            </label>
            <div className="sm:col-span-2">
              <ProfileSocialLinksEditor
                socialUrls={socialUrls}
                socialLinkInput={socialLinkInput}
                onSocialLinkInputChange={(value) => {
                  setSocialLinkInput(value);
                  setMessage(null);
                }}
                onSocialUrlsChange={(urls) => {
                  setSocialUrls(urls);
                  setMessage(null);
                }}
              />
            </div>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-black dark:text-white">
                {t.profile.bio}
              </span>
              <MentionHashtagTextarea
                value={bio}
                onChange={(value) => {
                  setBio(value);
                  setMessage(null);
                }}
                rows={3}
                excludeUserId={user.id}
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

          {previewProfile ? (
            <section id="channel-preview" className={`${settingsBoxClassName("mt-6")}`}>
              <ProfileChannelPreview
                profile={previewProfile}
                followerCount={followerCount}
                videos={approvedChannelVideos}
                communityPosts={communityPosts}
                onEditSettings={() => {
                  document.getElementById("settings")?.scrollIntoView({ behavior: "smooth" });
                }}
                showEditBar
              />
            </section>
          ) : null}

          <div className={`${settingsBoxClassName("mt-6")}`}>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              {t.auth.signOut}
            </button>
          </div>

          <DeleteAccountSection />
        </>
      ) : null}

      {activeSection === "channel" && previewProfile ? (
        <section id="channel" className={settingsBoxClassName()}>
          <ProfileChannelPreview
            profile={previewProfile}
            followerCount={followerCount}
            videos={approvedChannelVideos}
            communityPosts={communityPosts}
            onEditSettings={() => setSection("settings")}
            showEditBar
          />
        </section>
      ) : null}

      {activeSection === "hunter-system" ? (
        <PointsPanel
          profile={profile}
          onProfileRefresh={() => loadProfile({ silent: true })}
          section="hunter-system"
        />
      ) : null}

      {activeSection === "bounty-log" ? (
        <PointsPanel
          profile={profile}
          onProfileRefresh={() => loadProfile({ silent: true })}
          section="bounty-log"
        />
      ) : null}

      {activeSection === "referral" ? (
        <ReferralPanel profile={profile} />
      ) : null}

      {activeSection === "wallet" ? (
        <ClashWalletPanel
          profile={profile}
          onProfileRefresh={() => loadProfile({ silent: true })}
        />
      ) : null}

      {activeSection === "my-videos" ? (
        <section id="my-videos" className={settingsBoxClassName()}>
          <h2 className="text-lg font-semibold text-black dark:text-white">{t.nav.myVideos}</h2>
          {videos.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{t.profile.noVideos}</p>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {videos.map((video, index) => (
                <OwnVideoCard
                  key={video.id}
                  video={video}
                  rank={index + 1}
                  onUpdated={(updated) => {
                    setVideos((current) =>
                      current.map((entry) => (entry.id === updated.id ? updated : entry)),
                    );
                    setMessage(t.profile.videoUpdated);
                    setError(null);
                  }}
                  onDeleted={(videoId) => {
                    setVideos((current) => current.filter((entry) => entry.id !== videoId));
                    setVideoCount((count) => Math.max(0, count - 1));
                    setMessage(t.profile.videoDeleted);
                    setError(null);
                  }}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

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

      <ProfileCountrySetupModal
        open={showCountrySetup}
        onComplete={() => {
          setShowCountrySetup(false);
          void loadProfile({ silent: true });
          void refreshProfile({ silent: true });
        }}
      />
    </div>
  );
}
