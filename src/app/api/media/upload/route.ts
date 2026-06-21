import { NextResponse } from "next/server";
import { uploadMediaObject } from "@/lib/r2/client";
import {
  isMediaFolder,
  isR2Configured,
  validateMediaUploadInput,
  type MediaFolder,
} from "@/lib/r2/config";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SERVER_UPLOAD_MAX_BYTES = 45 * 1024 * 1024;

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

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const folderValue = formData.get("folder");
  const filenameValue = formData.get("filename");
  const fileValue = formData.get("file");

  if (typeof folderValue !== "string" || typeof filenameValue !== "string" || !(fileValue instanceof File)) {
    return NextResponse.json({ error: "folder, filename, and file are required" }, { status: 400 });
  }

  if (!isMediaFolder(folderValue)) {
    return NextResponse.json({ error: "invalid folder" }, { status: 400 });
  }

  const folder = folderValue as MediaFolder;
  const contentType = fileValue.type || guessContentType(folder, filenameValue);

  if (fileValue.size > SERVER_UPLOAD_MAX_BYTES) {
    return NextResponse.json({ error: "file too large for server upload" }, { status: 413 });
  }

  const validationError = validateMediaUploadInput(
    folder,
    filenameValue,
    contentType,
    fileValue.size,
  );

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const body = Buffer.from(await fileValue.arrayBuffer());
    const uploaded = await uploadMediaObject({
      folder,
      userId: user.id,
      filename: filenameValue,
      contentType,
      body,
    });

    if (!uploaded) {
      return NextResponse.json({ error: "R2 unavailable" }, { status: 503 });
    }

    return NextResponse.json(uploaded);
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload failed";
    const friendly =
      message.includes("EPROTO") || message.includes("SSL") || message.includes("handshake")
        ? "R2 SSL connection failed. Verify R2_ACCOUNT_ID and API token on Vercel."
        : message;
    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}

function guessContentType(folder: MediaFolder, filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();

  if (folder === "clips") {
    if (extension === "webm") return "video/webm";
    if (extension === "mov") return "video/quicktime";
    return "video/mp4";
  }

  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  if (extension === "gif") return "image/gif";
  return "image/jpeg";
}
