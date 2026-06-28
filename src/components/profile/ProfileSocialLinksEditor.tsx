"use client";

import { SocialLinkIcon } from "@/components/channel/SocialLinkIcon";
import {
  clearProfileSocialUrl,
  detectSocialPlatform,
  formatSocialLinkLabel,
  getProfileSocialLinks,
  getProfileSocialUrls,
  mergeSocialLinkInput,
  type ProfileSocialUrls,
  type SocialPlatform,
} from "@/lib/socialLinks";
import { useLocale } from "@/providers/LocaleProvider";

type ProfileSocialLinksEditorProps = {
  socialUrls: ProfileSocialUrls;
  socialLinkInput: string;
  onSocialLinkInputChange: (value: string) => void;
  onSocialUrlsChange: (urls: ProfileSocialUrls) => void;
};

export function ProfileSocialLinksEditor({
  socialUrls,
  socialLinkInput,
  onSocialLinkInputChange,
  onSocialUrlsChange,
}: ProfileSocialLinksEditorProps) {
  const { t } = useLocale();
  const detectedPlatform = socialLinkInput.trim()
    ? detectSocialPlatform(socialLinkInput)
    : null;
  const savedLinks = getProfileSocialLinks(socialUrls);

  function removeLink(platform: SocialPlatform) {
    onSocialUrlsChange(clearProfileSocialUrl(socialUrls, platform));
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-black dark:text-white">
          {t.profile.profileSocialLink}
        </span>
        <input
          value={socialLinkInput}
          onChange={(event) => onSocialLinkInputChange(event.target.value)}
          placeholder={t.profile.profileSocialPlaceholder}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-black dark:text-white"
        />
        {detectedPlatform ? (
          <p className="mt-2 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <SocialLinkIcon platform={detectedPlatform} className="h-3.5 w-3.5" />
            {t.profile.profileSocialDetected.replace(
              "{platform}",
              t.profile.socialPlatforms[detectedPlatform],
            )}
          </p>
        ) : (
          <p className="mt-2 text-xs text-zinc-500">{t.profile.profileSocialHint}</p>
        )}
      </label>

      {savedLinks.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {t.profile.profileSocialSavedLinks}
          </p>
          <ul className="space-y-2">
            {savedLinks.map((link) => (
              <li
                key={link.platform}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <span className="shrink-0 text-zinc-500">
                  <SocialLinkIcon platform={link.platform} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-black dark:text-white">
                    {t.profile.socialPlatforms[link.platform]}
                  </p>
                  <p className="truncate text-xs text-zinc-500">{formatSocialLinkLabel(link.url)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeLink(link.platform)}
                  className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  {t.profile.profileSocialRemove}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function applySocialLinkInput(
  socialUrls: ProfileSocialUrls,
  socialLinkInput: string,
): ProfileSocialUrls {
  if (!socialLinkInput.trim()) return socialUrls;
  return mergeSocialLinkInput(socialUrls, socialLinkInput);
}

export { getProfileSocialUrls, profileSocialUrlsEqual } from "@/lib/socialLinks";
