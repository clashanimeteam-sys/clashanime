import type { Profile } from "@/lib/types";

export type SocialPlatform = "youtube" | "instagram" | "tiktok" | "twitter" | "website";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

export type ProfileSocialUrls = {
  youtube_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
};

const PLATFORM_PATTERNS: { platform: SocialPlatform; pattern: RegExp }[] = [
  { platform: "youtube", pattern: /(?:youtube\.com|youtu\.be)/i },
  { platform: "instagram", pattern: /(?:instagram\.com|instagr\.am)/i },
  { platform: "tiktok", pattern: /(?:tiktok\.com|vm\.tiktok\.com)/i },
  { platform: "twitter", pattern: /(?:twitter\.com|x\.com)/i },
];

export function normalizeExternalUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function detectSocialPlatform(raw: string): SocialPlatform {
  const normalized = normalizeExternalUrl(raw).toLowerCase();
  for (const { platform, pattern } of PLATFORM_PATTERNS) {
    if (pattern.test(normalized)) return platform;
  }
  return "website";
}

export function profileUrlKey(platform: SocialPlatform): keyof ProfileSocialUrls {
  return `${platform}_url` as keyof ProfileSocialUrls;
}

export function parseSocialLink(raw: string): SocialLink | null {
  const url = normalizeExternalUrl(raw);
  if (!url) return null;
  return { platform: detectSocialPlatform(url), url };
}

export function getProfileSocialUrls(profile: Pick<Profile, keyof ProfileSocialUrls>): ProfileSocialUrls {
  return {
    youtube_url: profile.youtube_url?.trim() || null,
    instagram_url: profile.instagram_url?.trim() || null,
    tiktok_url: profile.tiktok_url?.trim() || null,
    twitter_url: profile.twitter_url?.trim() || null,
    website_url: profile.website_url?.trim() || null,
  };
}

export function getProfileSocialLinks(profile: Pick<Profile, keyof ProfileSocialUrls>): SocialLink[] {
  const urls = getProfileSocialUrls(profile);
  const links: SocialLink[] = [];

  for (const { platform } of PLATFORM_PATTERNS) {
    const url = urls[profileUrlKey(platform)];
    if (url) links.push({ platform, url: normalizeExternalUrl(url) });
  }

  if (urls.website_url) {
    links.push({ platform: "website", url: normalizeExternalUrl(urls.website_url) });
  }

  return links;
}

export function mergeSocialLinkInput(
  current: ProfileSocialUrls,
  raw: string,
): ProfileSocialUrls {
  const parsed = parseSocialLink(raw);
  if (!parsed) return current;
  return {
    ...current,
    [profileUrlKey(parsed.platform)]: parsed.url,
  };
}

export function clearProfileSocialUrl(
  current: ProfileSocialUrls,
  platform: SocialPlatform,
): ProfileSocialUrls {
  return {
    ...current,
    [profileUrlKey(platform)]: null,
  };
}

export function profileSocialUrlsEqual(a: ProfileSocialUrls, b: ProfileSocialUrls) {
  return (
    (a.youtube_url ?? "") === (b.youtube_url ?? "") &&
    (a.instagram_url ?? "") === (b.instagram_url ?? "") &&
    (a.tiktok_url ?? "") === (b.tiktok_url ?? "") &&
    (a.twitter_url ?? "") === (b.twitter_url ?? "") &&
    (a.website_url ?? "") === (b.website_url ?? "")
  );
}

export function formatSocialLinkLabel(url: string) {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
