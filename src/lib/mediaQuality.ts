const THUMBNAIL_TARGET_WIDTH = 720;
const THUMBNAIL_TARGET_HEIGHT = 1280;

export const THUMBNAIL_PRESENTATION_CLASS =
  "brightness-[1.04] contrast-[1.07] saturate-[1.1]";

export function enhanceThumbnailUrl(
  url: string,
  targetWidth = THUMBNAIL_TARGET_WIDTH,
  targetHeight = THUMBNAIL_TARGET_HEIGHT,
): string {
  if (!url?.trim()) return url;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("picsum.photos")) {
      const seedMatch = url.match(/picsum\.photos\/seed\/([^/]+)/);
      if (seedMatch) {
        return `https://picsum.photos/seed/${seedMatch[1]}/${targetWidth}/${targetHeight}`;
      }
    }

    if (parsed.pathname.includes("/storage/v1/object/public/")) {
      parsed.pathname = parsed.pathname.replace(
        "/storage/v1/object/public/",
        "/storage/v1/render/image/public/",
      );
      parsed.searchParams.set("width", String(targetWidth));
      parsed.searchParams.set("height", String(targetHeight));
      parsed.searchParams.set("quality", "90");
      parsed.searchParams.set("resize", "cover");
      return parsed.toString();
    }

    return url;
  } catch {
    return url;
  }
}

export function getVideoPreload(isActive: boolean): "auto" | "metadata" {
  return isActive ? "auto" : "metadata";
}

export function getVideoPosterUrl(thumbnailUrl: string): string {
  return enhanceThumbnailUrl(thumbnailUrl, 1080, 1920);
}
