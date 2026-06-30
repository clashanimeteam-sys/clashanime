import {
  BLOG_HERO_DISPLAY_KEY,
  BLOG_HERO_SLIDES_KEY,
  getEnabledBlogHeroSlides,
  normalizeBlogHeroSlidesForSave,
  parseBlogHeroDisplaySettings,
  parseBlogHeroSlides,
  type BlogHeroDisplaySettings,
  type BlogHeroSlide,
} from "@/lib/blog/heroSlides";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function loadBlogHeroSlides(): Promise<BlogHeroSlide[]> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", BLOG_HERO_SLIDES_KEY)
    .maybeSingle();

  if (error) {
    console.error("loadBlogHeroSlides", error.message);
    return [];
  }

  return parseBlogHeroSlides(data?.value);
}

export async function loadBlogHeroDisplaySettings(): Promise<BlogHeroDisplaySettings> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return parseBlogHeroDisplaySettings(null);
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", BLOG_HERO_DISPLAY_KEY)
    .maybeSingle();

  if (error) {
    console.error("loadBlogHeroDisplaySettings", error.message);
    return parseBlogHeroDisplaySettings(null);
  }

  return parseBlogHeroDisplaySettings(data?.value);
}

export async function loadEnabledBlogHeroSlides(): Promise<BlogHeroSlide[]> {
  return getEnabledBlogHeroSlides(await loadBlogHeroSlides());
}

export async function saveBlogHeroSlides(slides: BlogHeroSlide[], userId: string): Promise<boolean> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return false;
  }

  const normalized = normalizeBlogHeroSlidesForSave(slides);
  const timestamp = new Date().toISOString();

  const { error } = await supabase.from("site_settings").upsert({
    key: BLOG_HERO_SLIDES_KEY,
    value: normalized,
    updated_at: timestamp,
    updated_by: userId,
  });

  if (error) {
    console.error("saveBlogHeroSlides", error.message);
    return false;
  }

  return true;
}

export async function saveBlogHeroDisplaySettings(
  display: BlogHeroDisplaySettings,
  userId: string,
): Promise<boolean> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return false;
  }

  const normalized = parseBlogHeroDisplaySettings(display);
  const timestamp = new Date().toISOString();

  const { error } = await supabase.from("site_settings").upsert({
    key: BLOG_HERO_DISPLAY_KEY,
    value: normalized,
    updated_at: timestamp,
    updated_by: userId,
  });

  if (error) {
    console.error("saveBlogHeroDisplaySettings", error.message);
    return false;
  }

  return true;
}
