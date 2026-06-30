import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
import {
  loadBlogHeroDisplaySettings,
  loadBlogHeroSlides,
  saveBlogHeroDisplaySettings,
  saveBlogHeroSlides,
} from "@/lib/blog/heroSlides.server";
import {
  normalizeBlogHeroSlidesForSave,
  parseBlogHeroDisplaySettings,
  parseBlogHeroSlides,
  type BlogHeroDisplaySettings,
  type BlogHeroSlide,
} from "@/lib/blog/heroSlides";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function GET() {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [slides, display] = await Promise.all([loadBlogHeroSlides(), loadBlogHeroDisplaySettings()]);
  return NextResponse.json({ slides, display });
}

type SaveBody = {
  slides?: BlogHeroSlide[];
  display?: BlogHeroDisplaySettings;
};

export async function PUT(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SaveBody;
  try {
    body = (await request.json()) as SaveBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.slides)) {
    return NextResponse.json({ error: "slides array required" }, { status: 400 });
  }

  const slides = normalizeBlogHeroSlidesForSave(parseBlogHeroSlides(body.slides));
  const display = parseBlogHeroDisplaySettings(body.display);

  const [slidesOk, displayOk] = await Promise.all([
    saveBlogHeroSlides(slides, user.id),
    saveBlogHeroDisplaySettings(display, user.id),
  ]);

  if (!slidesOk || !displayOk) {
    return NextResponse.json({ error: "Failed to save hero settings" }, { status: 500 });
  }

  return NextResponse.json({ slides, display });
}

export async function POST(request: Request) {
  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { user } = await getStaffUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getSupabaseConfig();
  const serviceRole = createServiceRoleClient();
  if (!config || !serviceRole) {
    return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, or WebP images are allowed" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 5 MB or smaller" }, { status: 400 });
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `blog-hero/${randomUUID()}.${extension}`;

  const { error: uploadError } = await serviceRole.storage.from("banners").upload(path, file, {
    upsert: false,
    contentType: file.type,
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const imageUrl = `${config.url}/storage/v1/object/public/banners/${path}`;
  return NextResponse.json({ imageUrl });
}
