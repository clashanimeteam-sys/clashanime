import type { ClashSeason } from "@/lib/clashSeasons";
import { createServerClient } from "@/lib/supabase/server";

export async function getActiveClashSeason(): Promise<ClashSeason | null> {
  const supabase = await createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("get_active_clash_season");
  if (error || !data) return null;

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  return row as ClashSeason;
}
