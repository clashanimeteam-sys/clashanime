#!/usr/bin/env node
/**
 * Builds production-anime-stickers-seed-full.sql from the Gifukai library (~1000+ anime GIFs).
 * Source: https://api.gifukai.com/library (curated anime reactions, 402 series).
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const LIBRARY_URL = "https://api.gifukai.com/library";
const PAGE_SIZE = 100;
const OUTPUT = resolve("supabase/scripts/production-anime-stickers-seed-full.sql");
const SITE = "https://www.clashanime.com";

function slugify(value) {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "anime"
  );
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function uniqueSlug(base, used) {
  let slug = base;
  let suffix = 2;
  while (used.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  used.add(slug);
  return slug;
}

async function fetchAllGifs() {
  const gifs = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const response = await fetch(`${LIBRARY_URL}?limit=${PAGE_SIZE}&offset=${offset}`);
    if (!response.ok) {
      throw new Error(`Gifukai library fetch failed: ${response.status}`);
    }

    const payload = await response.json();
    total = payload.total ?? total;
    const batch = payload.gifs ?? [];
    if (!batch.length) break;

    gifs.push(...batch);
    offset += batch.length;
    process.stdout.write(`\rFetched ${gifs.length}/${total} GIFs...`);
  }

  process.stdout.write("\n");
  return gifs;
}

function buildCatalog(gifs) {
  const usedPackSlugs = new Set();
  const slugByAnime = new Map();
  const packs = new Map();

  function packSlugForAnime(anime) {
    if (slugByAnime.has(anime)) {
      return slugByAnime.get(anime);
    }

    const slug = uniqueSlug(slugify(anime), usedPackSlugs);
    slugByAnime.set(anime, slug);
    return slug;
  }

  for (const gif of gifs) {
    const anime = gif.anime?.trim() || "Anime";
    const packSlug = packSlugForAnime(anime);

    if (!packs.has(packSlug)) {
      packs.set(packSlug, {
        slug: packSlug,
        name_en: anime,
        name_ar: anime,
        name_ja: anime,
        sort_order: packs.size,
        stickers: [],
      });
    }

    const pack = packs.get(packSlug);
    const stickerSlug = `${gif.action}-${gif.pairing}-${gif.id}`;
    pack.stickers.push({
      slug: stickerSlug,
      label: `${anime} · ${gif.action}`,
      image_url: gif.url,
      sort_order: pack.stickers.length + 1,
    });
  }

  return [...packs.values()].sort((a, b) => a.name_en.localeCompare(b.name_en));
}

function renderSql(packs) {
  const stickerCount = packs.reduce((sum, pack) => sum + pack.stickers.length, 0);
  const lines = [
    "-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)",
    "-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new",
    "--",
    `-- Full anime sticker catalog: ${packs.length} series, ${stickerCount} GIFs`,
    "-- Source: Gifukai curated library (https://gifukai.com)",
    "-- Safe to re-run.",
    "",
    "truncate table public.anime_stickers;",
    "truncate table public.anime_sticker_packs cascade;",
    "",
  ];

  for (const pack of packs) {
    lines.push(
      "insert into public.anime_sticker_packs (slug, name_en, name_ar, name_ja, sort_order, active)",
      "values (",
      `  ${sqlString(pack.slug)},`,
      `  ${sqlString(pack.name_en)},`,
      `  ${sqlString(pack.name_ar)},`,
      `  ${sqlString(pack.name_ja)},`,
      `  ${pack.sort_order},`,
      "  true",
      ");",
      "",
    );
  }

  lines.push(
    "insert into public.anime_stickers (pack_id, slug, label, image_url, media_type, sort_order, active)",
    "select p.id, v.slug, v.label, v.image_url, 'gif', v.sort_order, true",
    "from public.anime_sticker_packs p",
    "join (",
    "  values",
  );

  const valueRows = [];
  for (const pack of packs) {
    for (const sticker of pack.stickers) {
      valueRows.push(
        `    (${sqlString(pack.slug)}, ${sqlString(sticker.slug)}, ${sqlString(sticker.label)}, ${sqlString(sticker.image_url)}, ${sticker.sort_order})`,
      );
    }
  }

  lines.push(valueRows.join(",\n"));
  lines.push(
    ") as v(pack_slug, slug, label, image_url, sort_order)",
    "  on v.pack_slug = p.slug;",
    "",
    "select",
    "  (select count(*) from public.anime_sticker_packs) as pack_count,",
    "  (select count(*) from public.anime_stickers) as sticker_count;",
    "",
  );

  return lines.join("\n");
}

async function main() {
  const gifs = await fetchAllGifs();
  const packs = buildCatalog(gifs);
  const sql = renderSql(packs);
  writeFileSync(OUTPUT, sql, "utf8");

  console.log(`Wrote ${OUTPUT}`);
  console.log(`Packs: ${packs.length}, Stickers: ${gifs.length}`);
  console.log(`Attribution: ${SITE} uses Gifukai CDN URLs for curated anime stickers.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
