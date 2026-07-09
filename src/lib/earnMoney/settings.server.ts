import {
  DEFAULT_EARN_MONEY_SETTINGS,
  EARN_MONEY_SETTINGS_KEY,
  parseEarnMoneySettings,
  type EarnMoneySettings,
} from "@/lib/earnMoney/settings";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function loadEarnMoneySettings(): Promise<EarnMoneySettings> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { ...DEFAULT_EARN_MONEY_SETTINGS };
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", EARN_MONEY_SETTINGS_KEY)
    .maybeSingle();

  if (error) {
    console.error("loadEarnMoneySettings", error.message);
    return { ...DEFAULT_EARN_MONEY_SETTINGS };
  }

  return parseEarnMoneySettings(data?.value ?? DEFAULT_EARN_MONEY_SETTINGS);
}

export async function saveEarnMoneySettings(
  settings: EarnMoneySettings,
  userId: string,
): Promise<boolean> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return false;
  }

  const normalized = parseEarnMoneySettings(settings);
  const timestamp = new Date().toISOString();

  const { error } = await supabase.from("site_settings").upsert({
    key: EARN_MONEY_SETTINGS_KEY,
    value: normalized,
    updated_at: timestamp,
    updated_by: userId,
  });

  if (error) {
    console.error("saveEarnMoneySettings", error.message);
    return false;
  }

  return true;
}
