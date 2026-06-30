export const BLOG_HERO_SLIDES_KEY = "blog_hero_slides";
export const BLOG_HERO_DISPLAY_KEY = "blog_hero_display";
export const MAX_BLOG_HERO_SLIDES = 10;

export type BlogHeroObjectPosition = "center" | "top" | "bottom" | "left" | "right";

export type BlogHeroSlide = {
  id: string;
  imageUrl: string;
  sortOrder: number;
  enabled: boolean;
  objectPosition: BlogHeroObjectPosition;
};

export type BlogHeroDisplaySettings = {
  carouselEnabled: boolean;
  showTextOverlay: boolean;
  overlayOpacity: number;
  autoPlaySeconds: number;
};

export const DEFAULT_BLOG_HERO_DISPLAY: BlogHeroDisplaySettings = {
  carouselEnabled: true,
  showTextOverlay: true,
  overlayOpacity: 28,
  autoPlaySeconds: 5,
};

const OBJECT_POSITIONS = new Set<BlogHeroObjectPosition>(["center", "top", "bottom", "left", "right"]);

export function parseObjectPosition(value: unknown): BlogHeroObjectPosition {
  if (typeof value === "string" && OBJECT_POSITIONS.has(value as BlogHeroObjectPosition)) {
    return value as BlogHeroObjectPosition;
  }
  return "center";
}

export function createEmptyHeroSlideSlots(): BlogHeroSlide[] {
  return Array.from({ length: MAX_BLOG_HERO_SLIDES }, (_, index) => ({
    id: `slot-${index + 1}`,
    imageUrl: "",
    sortOrder: index,
    enabled: false,
    objectPosition: "center" as const,
  }));
}

export function parseBlogHeroSlides(value: unknown): BlogHeroSlide[] {
  const slots = createEmptyHeroSlideSlots();

  if (!Array.isArray(value)) {
    return slots;
  }

  return slots.map((slot, index) => {
    const entry = value[index];
    if (!entry || typeof entry !== "object") {
      return slot;
    }

    const row = entry as Partial<BlogHeroSlide>;
    const imageUrl = typeof row.imageUrl === "string" ? row.imageUrl.trim() : "";

    return {
      id: typeof row.id === "string" && row.id ? row.id : slot.id,
      imageUrl,
      sortOrder: index,
      enabled: row.enabled !== false && Boolean(imageUrl),
      objectPosition: parseObjectPosition(row.objectPosition),
    };
  });
}

export function parseBlogHeroDisplaySettings(value: unknown): BlogHeroDisplaySettings {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_BLOG_HERO_DISPLAY };
  }

  const row = value as Partial<BlogHeroDisplaySettings>;
  const overlayOpacity =
    typeof row.overlayOpacity === "number"
      ? Math.min(80, Math.max(0, Math.round(row.overlayOpacity)))
      : DEFAULT_BLOG_HERO_DISPLAY.overlayOpacity;
  const autoPlaySeconds =
    typeof row.autoPlaySeconds === "number"
      ? Math.min(15, Math.max(3, Math.round(row.autoPlaySeconds)))
      : DEFAULT_BLOG_HERO_DISPLAY.autoPlaySeconds;

  return {
    carouselEnabled: row.carouselEnabled !== false,
    showTextOverlay: row.showTextOverlay !== false,
    overlayOpacity,
    autoPlaySeconds,
  };
}

export function normalizeBlogHeroSlidesForSave(slides: BlogHeroSlide[]): BlogHeroSlide[] {
  return slides.slice(0, MAX_BLOG_HERO_SLIDES).map((slide, index) => ({
    id: slide.id || `slot-${index + 1}`,
    imageUrl: slide.imageUrl.trim(),
    sortOrder: index,
    enabled: slide.enabled !== false && Boolean(slide.imageUrl.trim()),
    objectPosition: parseObjectPosition(slide.objectPosition),
  }));
}

export function getEnabledBlogHeroSlides(slides: BlogHeroSlide[]): BlogHeroSlide[] {
  return slides
    .filter((slide) => slide.enabled && slide.imageUrl.trim())
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function objectPositionClass(position: BlogHeroObjectPosition): string {
  switch (position) {
    case "top":
      return "object-top";
    case "bottom":
      return "object-bottom";
    case "left":
      return "object-left";
    case "right":
      return "object-right";
    default:
      return "object-center";
  }
}
