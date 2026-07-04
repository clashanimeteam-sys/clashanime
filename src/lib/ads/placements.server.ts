import {
  AD_PLACEMENTS_KEY,
  DEFAULT_AD_PLACEMENTS,
  parseAdPlacementSettings,
  type AdPlacementSettings,
} from "@/lib/ads/placements";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function loadAdPlacementSettings(): Promise<AdPlacementSettings> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return parseAdPlacementSettings(DEFAULT_AD_PLACEMENTS);
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", AD_PLACEMENTS_KEY)
    .maybeSingle();

  if (error) {
    console.error("loadAdPlacementSettings", error.message);
    return parseAdPlacementSettings(DEFAULT_AD_PLACEMENTS);
  }

  return parseAdPlacementSettings(data?.value ?? DEFAULT_AD_PLACEMENTS);
}

export async function saveAdPlacementSettings(
  settings: AdPlacementSettings,
  userId: string,
): Promise<boolean> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return false;
  }

  const normalized = parseAdPlacementSettings(settings);
  const timestamp = new Date().toISOString();

  const { error } = await supabase.from("site_settings").upsert({
    key: AD_PLACEMENTS_KEY,
    value: normalized,
    updated_at: timestamp,
    updated_by: userId,
  });

  if (error) {
    console.error("saveAdPlacementSettings", error.message);
    return false;
  }

  return true;
}
