export const BLOG_HERO_SLIDES_KEY = "blog_hero_slides";
export const MAX_BLOG_HERO_SLIDES = 10;

export type BlogHeroSlide = {
  id: string;
  imageUrl: string;
  sortOrder: number;
  enabled: boolean;
};

export function createEmptyHeroSlideSlots(): BlogHeroSlide[] {
  return Array.from({ length: MAX_BLOG_HERO_SLIDES }, (_, index) => ({
    id: `slot-${index + 1}`,
    imageUrl: "",
    sortOrder: index,
    enabled: false,
  }));
}

export function parseBlogHeroSlides(value: unknown): BlogHeroSlide[] {
  const slots = createEmptyHeroSlideSlots();

  if (!Array.isArray(value)) {
    return slots;
  }

  const parsed = value
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") return null;
      const row = entry as Partial<BlogHeroSlide>;
      const imageUrl = typeof row.imageUrl === "string" ? row.imageUrl.trim() : "";
      if (!imageUrl) return null;

      return {
        id: typeof row.id === "string" && row.id ? row.id : `slide-${index + 1}`,
        imageUrl,
        sortOrder: typeof row.sortOrder === "number" ? row.sortOrder : index,
        enabled: row.enabled !== false,
      } satisfies BlogHeroSlide;
    })
    .filter((slide): slide is BlogHeroSlide => slide !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, MAX_BLOG_HERO_SLIDES);

  return slots.map((slot, index) => parsed[index] ?? slot);
}

export function normalizeBlogHeroSlidesForSave(slides: BlogHeroSlide[]): BlogHeroSlide[] {
  return slides
    .slice(0, MAX_BLOG_HERO_SLIDES)
    .map((slide, index) => ({
      id: slide.id || `slot-${index + 1}`,
      imageUrl: slide.imageUrl.trim(),
      sortOrder: index,
      enabled: slide.enabled !== false && Boolean(slide.imageUrl.trim()),
    }));
}

export function getEnabledBlogHeroSlides(slides: BlogHeroSlide[]): BlogHeroSlide[] {
  return slides
    .filter((slide) => slide.enabled && slide.imageUrl.trim())
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
