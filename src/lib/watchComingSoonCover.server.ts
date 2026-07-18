import {
  DEFAULT_WATCH_COMING_SOON_COVER,
  WATCH_COMING_SOON_COVER_KEY,
  parseWatchComingSoonCover,
  type WatchComingSoonCover,
} from "@/lib/watchComingSoonCover";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function loadWatchComingSoonCover(): Promise<WatchComingSoonCover> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { ...DEFAULT_WATCH_COMING_SOON_COVER };
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", WATCH_COMING_SOON_COVER_KEY)
    .maybeSingle();

  if (error) {
    console.error("loadWatchComingSoonCover", error.message);
    return { ...DEFAULT_WATCH_COMING_SOON_COVER };
  }

  return parseWatchComingSoonCover(data?.value);
}

export async function saveWatchComingSoonCover(
  cover: WatchComingSoonCover,
  userId: string,
): Promise<boolean> {
  const supabase = createServiceRoleClient();
  if (!supabase) return false;

  const normalized = parseWatchComingSoonCover(cover);
  const { error } = await supabase.from("site_settings").upsert({
    key: WATCH_COMING_SOON_COVER_KEY,
    value: normalized,
    updated_at: new Date().toISOString(),
    updated_by: userId,
  });

  if (error) {
    console.error("saveWatchComingSoonCover", error.message);
    return false;
  }

  return true;
}

export async function resetWatchComingSoonCover(userId: string): Promise<boolean> {
  return saveWatchComingSoonCover({ ...DEFAULT_WATCH_COMING_SOON_COVER }, userId);
}
