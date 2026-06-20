import { createBrowserClient } from "@/lib/supabase/client";
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_MODERATION_SETTINGS,
  type SiteGeneralSettings,
  type SiteModerationSettings,
} from "@/lib/admin";

type SettingsRow = {
  key: string;
  value: SiteGeneralSettings | SiteModerationSettings;
};

export async function fetchSiteSettings(supabase: ReturnType<typeof createBrowserClient>) {
  if (!supabase) {
    return {
      general: DEFAULT_GENERAL_SETTINGS,
      moderation: DEFAULT_MODERATION_SETTINGS,
    };
  }

  const { data } = await supabase.from("site_settings").select("key, value");

  const rows = (data ?? []) as SettingsRow[];
  const generalRow = rows.find((row) => row.key === "general")?.value as Partial<SiteGeneralSettings> | undefined;
  const general: SiteGeneralSettings = {
    ...DEFAULT_GENERAL_SETTINGS,
    ...generalRow,
  };
  const moderation =
    (rows.find((row) => row.key === "moderation")?.value as SiteModerationSettings | undefined) ??
    DEFAULT_MODERATION_SETTINGS;

  return { general, moderation };
}

export async function saveSiteSettings(
  supabase: ReturnType<typeof createBrowserClient>,
  userId: string,
  general: SiteGeneralSettings,
  moderation: SiteModerationSettings,
) {
  if (!supabase) return false;

  const timestamp = new Date().toISOString();
  const updates = [
    supabase.from("site_settings").upsert({
      key: "general",
      value: general,
      updated_at: timestamp,
      updated_by: userId,
    }),
    supabase.from("site_settings").upsert({
      key: "moderation",
      value: moderation,
      updated_at: timestamp,
      updated_by: userId,
    }),
  ];

  const results = await Promise.all(updates);
  return results.every(({ error }) => !error);
}

export async function fetchPublicSiteFlags(supabase: ReturnType<typeof createBrowserClient>) {
  const settings = await fetchSiteSettings(supabase);
  return {
    maintenanceMode: settings.general.maintenance_mode,
    allowUploads: settings.general.allow_uploads,
    allowSignups: settings.general.allow_signups,
    animeRadioEnabled: settings.general.anime_radio_enabled,
    animeRadioAutoplay: settings.general.anime_radio_autoplay,
    animeRadioDefaultVolume: settings.general.anime_radio_default_volume,
  };
}
