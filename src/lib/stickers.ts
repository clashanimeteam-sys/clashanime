import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/types";

export type AnimeStickerPack = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  name_ja: string;
  sort_order: number;
  active: boolean;
};

export type AnimeSticker = {
  id: string;
  pack_id: string;
  slug: string;
  label: string;
  image_url: string;
  media_type: "gif" | "webp" | "png";
  sort_order: number;
  active: boolean;
};

export type StickerPackWithStickers = AnimeStickerPack & {
  stickers: AnimeSticker[];
};

const STICKER_UUID =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export const STICKER_TOKEN_REGEX = new RegExp(
  `\\[sticker:(${STICKER_UUID.source})\\]`,
  "gi",
);

export type BodySegment =
  | { type: "text"; value: string }
  | { type: "sticker"; value: string };

export function getPackName(pack: AnimeStickerPack, locale: Locale) {
  if (locale === "ar") return pack.name_ar;
  if (locale === "ja") return pack.name_ja;
  return pack.name_en;
}

export function appendStickerToken(body: string, stickerId: string) {
  return `${body}[sticker:${stickerId}]`;
}

export function splitBodyWithStickers(body: string): BodySegment[] {
  if (!body) return [];

  const segments: BodySegment[] = [];
  let lastIndex = 0;
  const regex = new RegExp(STICKER_TOKEN_REGEX.source, "gi");
  let match: RegExpExecArray | null;

  while ((match = regex.exec(body)) !== null) {
    const text = body.slice(lastIndex, match.index);
    if (text) segments.push({ type: "text", value: text });
    segments.push({ type: "sticker", value: match[1].toLowerCase() });
    lastIndex = match.index + match[0].length;
  }

  const trailing = body.slice(lastIndex);
  if (trailing) segments.push({ type: "text", value: trailing });

  return segments.length > 0 ? segments : [{ type: "text", value: body }];
}

export function bodyHasRenderableContent(body: string) {
  return splitBodyWithStickers(body.trim()).some(
    (segment) => segment.type === "sticker" || segment.value.trim().length > 0,
  );
}

export async function fetchStickerCatalog(
  supabase: SupabaseClient,
  options?: { includeInactive?: boolean },
) {
  const includeInactive = options?.includeInactive ?? false;

  let packsQuery = supabase
    .from("anime_sticker_packs")
    .select("id, slug, name_en, name_ar, name_ja, sort_order, active")
    .order("sort_order", { ascending: true });

  if (!includeInactive) {
    packsQuery = packsQuery.eq("active", true);
  }

  let stickersQuery = supabase
    .from("anime_stickers")
    .select("id, pack_id, slug, label, image_url, media_type, sort_order, active")
    .order("sort_order", { ascending: true });

  if (!includeInactive) {
    stickersQuery = stickersQuery.eq("active", true);
  }

  const [{ data: packs, error: packsError }, { data: stickers, error: stickersError }] =
    await Promise.all([packsQuery, stickersQuery]);

  if (packsError) throw packsError;
  if (stickersError) throw stickersError;

  const packRows = (packs ?? []) as AnimeStickerPack[];
  const stickerRows = (stickers ?? []) as AnimeSticker[];
  const activePackIds = new Set(packRows.filter((pack) => pack.active).map((pack) => pack.id));

  const stickersByPack = new Map<string, AnimeSticker[]>();
  for (const sticker of stickerRows) {
    if (!includeInactive && !activePackIds.has(sticker.pack_id)) continue;
    const list = stickersByPack.get(sticker.pack_id) ?? [];
    list.push(sticker);
    stickersByPack.set(sticker.pack_id, list);
  }

  const catalog: StickerPackWithStickers[] = packRows
    .map((pack) => ({
      ...pack,
      stickers: stickersByPack.get(pack.id) ?? [],
    }))
    .filter((pack) => includeInactive || pack.active);

  const stickerMap = new Map<string, AnimeSticker>();
  for (const pack of catalog) {
    for (const sticker of pack.stickers) {
      stickerMap.set(sticker.id, sticker);
    }
  }

  return { catalog, stickerMap };
}

export async function uploadAnimeStickerFile(
  supabase: SupabaseClient,
  supabaseUrl: string,
  file: File,
  packSlug: string,
  stickerSlug: string,
) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "gif";
  const mediaType =
    extension === "webp" ? "webp" : extension === "png" ? "png" : "gif";
  const path = `${packSlug}/${stickerSlug}.${extension}`;

  const { error } = await supabase.storage.from("anime-stickers").upload(path, file, {
    upsert: true,
    contentType: file.type || `image/${mediaType === "gif" ? "gif" : mediaType}`,
  });

  if (error) return null;

  return {
    imageUrl: `${supabaseUrl}/storage/v1/object/public/anime-stickers/${path}`,
    mediaType,
  } as const;
}
