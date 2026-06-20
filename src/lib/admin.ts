import type { Profile } from "@/lib/types";

export type UserRole = "user" | "moderator" | "admin";

export type SiteGeneralSettings = {
  site_name: string;
  site_tagline: string;
  maintenance_mode: boolean;
  allow_uploads: boolean;
  allow_signups: boolean;
  anime_radio_enabled: boolean;
  anime_radio_autoplay: boolean;
  anime_radio_default_volume: number;
};

export type SiteModerationSettings = {
  auto_approve_enabled: boolean;
  review_new_creators: boolean;
  reject_suspicious_uploads: boolean;
};

export const DEFAULT_GENERAL_SETTINGS: SiteGeneralSettings = {
  site_name: "ClashAnime",
  site_tagline: "Duel System",
  maintenance_mode: false,
  allow_uploads: true,
  allow_signups: true,
  anime_radio_enabled: true,
  anime_radio_autoplay: true,
  anime_radio_default_volume: 0.35,
};

export const DEFAULT_MODERATION_SETTINGS: SiteModerationSettings = {
  auto_approve_enabled: true,
  review_new_creators: true,
  reject_suspicious_uploads: true,
};

export function isStaff(profile: Pick<Profile, "role"> | null | undefined): boolean {
  return profile?.role === "admin" || profile?.role === "moderator";
}

export function isAdmin(profile: Pick<Profile, "role"> | null | undefined): boolean {
  return profile?.role === "admin";
}

export function canAccessAdminSettings(profile: Pick<Profile, "role"> | null | undefined): boolean {
  return isAdmin(profile);
}

export function canManageUsers(profile: Pick<Profile, "role"> | null | undefined): boolean {
  return isAdmin(profile);
}
