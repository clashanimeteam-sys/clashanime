import { NextResponse } from "next/server";
import { createPresignedMediaUploadUrl } from "@/lib/r2/client";
import {
  isMediaFolder,
  isR2Configured,
  validateMediaUploadInput,
  type MediaFolder,
} from "@/lib/r2/config";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PresignBody = {
  folder?: unknown;
  filename?: unknown;
  contentType?: unknown;
  contentLength?: unknown;
};

export async function POST(request: Request) {
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

  let body: PresignBody;
  try {
    body = (await request.json()) as PresignBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const folder = typeof body.folder === "string" ? body.folder : "";
  const filename = typeof body.filename === "string" ? body.filename : "";
  const contentType = typeof body.contentType === "string" ? body.contentType : "";
  const contentLength =
    typeof body.contentLength === "number"
      ? body.contentLength
      : Number(body.contentLength);

  if (!isMediaFolder(folder)) {
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

  try {
    const signed = await createPresignedMediaUploadUrl({
      folder: folder as MediaFolder,
      userId: user.id,
      filename,
      contentType,
    });

    if (!signed) {
      return NextResponse.json({ error: "R2 unavailable" }, { status: 503 });
    }

    return NextResponse.json(signed);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "presign failed" },
      { status: 500 },
    );
  }
}
