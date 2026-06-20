import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;
let browserConfigKey: string | null = null;

export function createBrowserClient(): SupabaseClient | null {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  const configKey = `${config.url}:${config.anonKey}`;

  if (!browserClient || browserConfigKey !== configKey) {
    browserClient = createSupabaseBrowserClient(config.url, config.anonKey);
    browserConfigKey = configKey;
  }

  return browserClient;
}
