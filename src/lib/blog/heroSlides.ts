export const BLOG_HERO_SLIDES_KEY = "blog_hero_slides";
export const BLOG_HERO_DISPLAY_KEY = "blog_hero_display";
export const MAX_BLOG_HERO_SLIDES = 10;
export const BLOG_HERO_ASPECT_WIDTH = 5;
export const BLOG_HERO_ASPECT_HEIGHT = 1;
export const BLOG_HERO_FRAME_CLASS =
  "relative w-full aspect-[5/1] overflow-hidden bg-zinc-950";
export const BLOG_HERO_LIVE_CONTAINER_CLASS = "w-full pt-3 sm:pt-4";
export const BLOG_HERO_LIVE_FRAME_CLASS = `${BLOG_HERO_FRAME_CLASS} border-y border-zinc-800 sm:rounded-xl sm:border`;

export type BlogHeroObjectPosition = "center" | "top" | "bottom" | "left" | "right";
export type BlogHeroRotation = 0 | 90 | 180 | 270;

export type BlogHeroSlide = {
  id: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  enabled: boolean;
  objectPosition: BlogHeroObjectPosition;
  focalX: number;
  focalY: number;
  rotation: BlogHeroRotation;
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
  overlayOpacity: 12,
  autoPlaySeconds: 5,
};

const OBJECT_POSITIONS = new Set<BlogHeroObjectPosition>(["center", "top", "bottom", "left", "right"]);

export function clampFocal(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function parseObjectPosition(value: unknown): BlogHeroObjectPosition {
  if (typeof value === "string" && OBJECT_POSITIONS.has(value as BlogHeroObjectPosition)) {
    return value as BlogHeroObjectPosition;
  }
  return "center";
}

export function focalFromPreset(position: BlogHeroObjectPosition): { focalX: number; focalY: number } {
  switch (position) {
    case "top":
      return { focalX: 50, focalY: 0 };
    case "bottom":
      return { focalX: 50, focalY: 100 };
    case "left":
      return { focalX: 0, focalY: 50 };
    case "right":
      return { focalX: 100, focalY: 50 };
    default:
      return { focalX: 50, focalY: 50 };
  }
}

export function parseSlideFocal(
  row: Partial<BlogHeroSlide> | null | undefined,
): { focalX: number; focalY: number } {
  if (row && typeof row.focalX === "number" && typeof row.focalY === "number") {
    return {
      focalX: clampFocal(row.focalX),
      focalY: clampFocal(row.focalY),
    };
  }

  return focalFromPreset(parseObjectPosition(row?.objectPosition));
}

export function parseRotation(value: unknown): BlogHeroRotation {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  const normalized = ((Math.round(value) % 360) + 360) % 360;
  if (normalized === 90) return 90;
  if (normalized === 180) return 180;
  if (normalized === 270) return 270;
  return 0;
}

export function rotateSlideClockwise(rotation: BlogHeroRotation): BlogHeroRotation {
  return parseRotation(rotation + 90);
}

export function rotateSlideCounterClockwise(rotation: BlogHeroRotation): BlogHeroRotation {
  return parseRotation(rotation - 90);
}

export function slideImageTransformStyle(rotation: BlogHeroRotation): { transform?: string } {
  if (rotation === 0) {
    return {};
  }

  const coverScale = BLOG_HERO_ASPECT_WIDTH / BLOG_HERO_ASPECT_HEIGHT;
  const scale = rotation === 180 ? 1 : coverScale;
  return {
    transform: `rotate(${rotation}deg) scale(${scale})`,
  };
}

export function parseImageUrl(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return trimmed;
    }
  } catch {
    return "";
  }

  return "";
}

export function parseSlideLinkUrl(value: unknown): string {
  return parseImageUrl(value);
}

export function isOptimizableHeroImageUrl(imageUrl: string): boolean {
  if (!imageUrl || imageUrl.startsWith("/")) {
    return true;
  }

  try {
    return new URL(imageUrl).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export function slideObjectPositionStyle(slide: Pick<BlogHeroSlide, "focalX" | "focalY" | "objectPosition">): string {
  const { focalX, focalY } =
    typeof slide.focalX === "number" && typeof slide.focalY === "number"
      ? { focalX: clampFocal(slide.focalX), focalY: clampFocal(slide.focalY) }
      : focalFromPreset(slide.objectPosition);

  return `${focalX}% ${focalY}%`;
}

export function createEmptyHeroSlideSlots(): BlogHeroSlide[] {
  return Array.from({ length: MAX_BLOG_HERO_SLIDES }, (_, index) => ({
    id: `slot-${index + 1}`,
    imageUrl: "",
    linkUrl: "",
    sortOrder: index,
    enabled: false,
    objectPosition: "center" as const,
    focalX: 50,
    focalY: 50,
    rotation: 0,
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
    const imageUrl = parseImageUrl(row.imageUrl);
    const focal = parseSlideFocal(row);

    return {
      id: typeof row.id === "string" && row.id ? row.id : slot.id,
      imageUrl,
      linkUrl: parseSlideLinkUrl(row.linkUrl),
      sortOrder: index,
      enabled: row.enabled !== false && Boolean(imageUrl),
      objectPosition: parseObjectPosition(row.objectPosition),
      focalX: focal.focalX,
      focalY: focal.focalY,
      rotation: parseRotation(row.rotation),
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
  return slides.slice(0, MAX_BLOG_HERO_SLIDES).map((slide, index) => {
    const focal = parseSlideFocal(slide);

    return {
      id: slide.id || `slot-${index + 1}`,
      imageUrl: parseImageUrl(slide.imageUrl),
      linkUrl: parseSlideLinkUrl(slide.linkUrl),
      sortOrder: index,
      enabled: slide.enabled !== false && Boolean(slide.imageUrl.trim()),
      objectPosition: parseObjectPosition(slide.objectPosition),
      focalX: focal.focalX,
      focalY: focal.focalY,
      rotation: parseRotation(slide.rotation),
    };
  });
}

export function getEnabledBlogHeroSlides(slides: BlogHeroSlide[]): BlogHeroSlide[] {
  return slides
    .filter((slide) => slide.enabled && slide.imageUrl.trim())
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function applyPresetToSlide(preset: BlogHeroObjectPosition): Pick<BlogHeroSlide, "objectPosition" | "focalX" | "focalY"> {
  const focal = focalFromPreset(preset);
  return {
    objectPosition: preset,
    focalX: focal.focalX,
    focalY: focal.focalY,
  };
}
