import { NextResponse } from "next/server";
import { buildMediaObjectKey, getR2PublicUrl, isR2Configured, validateMediaUploadInput, type MediaFolder } from "@/lib/r2/config";
import { createUploadToken, getUploadTokenSecret } from "@/lib/r2/uploadToken";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type UploadSessionBody = {
  folder?: unknown;
  filename?: unknown;
  contentType?: unknown;
  contentLength?: unknown;
};

export async function POST(request: Request) {
  const uploadWorkerUrl = process.env.NEXT_PUBLIC_R2_UPLOAD_URL?.trim().replace(/\/$/, "");
  const uploadSecret = getUploadTokenSecret();

  if (!uploadWorkerUrl || !uploadSecret) {
    return NextResponse.json({ error: "R2 worker upload not configured" }, { status: 503 });
  }

  const supabase = await createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isR2Configured()) {
    return NextResponse.json({ error: "R2 not configured" }, { status: 503 });
  }

  let body: UploadSessionBody;
  try {
    body = (await request.json()) as UploadSessionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const folder = typeof body.folder === "string" ? body.folder : "";
  const filename = typeof body.filename === "string" ? body.filename : "";
  const contentType = typeof body.contentType === "string" ? body.contentType : "application/octet-stream";
  const contentLength =
    typeof body.contentLength === "number" ? body.contentLength : Number(body.contentLength);

  if (folder !== "clips" && folder !== "thumbnails" && folder !== "avatars" && folder !== "banners") {
    return NextResponse.json({ error: "invalid folder" }, { status: 400 });
  }

  const validationError = validateMediaUploadInput(
    folder as MediaFolder,
    filename,
    contentType,
    contentLength,
  );

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const key = buildMediaObjectKey(folder as MediaFolder, user.id, filename);
  const publicUrl = getR2PublicUrl(key);
  if (!publicUrl) {
    return NextResponse.json({ error: "R2 unavailable" }, { status: 503 });
  }

  const token = createUploadToken(
    {
      userId: user.id,
      folder: folder as MediaFolder,
      filename,
    },
    uploadSecret,
  );

  return NextResponse.json({
    uploadUrl: uploadWorkerUrl,
    token,
    key,
    publicUrl,
  });
}
