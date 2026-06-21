import { createHmac, timingSafeEqual } from "crypto";
import { isMediaFolder, type MediaFolder } from "@/lib/r2/config";

export type UploadTokenPayload = {
  userId: string;
  folder: MediaFolder;
  filename: string;
  exp: number;
};

const TOKEN_TTL_MS = 10 * 60 * 1000;

function encodeBase64Url(value: Buffer): string {
  return value.toString("base64url");
}

function decodeBase64Url(value: string): Buffer | null {
  try {
    return Buffer.from(value, "base64url");
  } catch {
    return null;
  }
}

export function getUploadTokenSecret(): string | null {
  return process.env.R2_UPLOAD_SECRET?.trim() || null;
}

export function createUploadToken(
  params: Omit<UploadTokenPayload, "exp">,
  secret: string,
): string {
  const payload: UploadTokenPayload = {
    ...params,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload));
  const signature = createHmac("sha256", secret).update(body).digest();
  return `${encodeBase64Url(body)}.${encodeBase64Url(signature)}`;
}

export function verifyUploadToken(token: string, secret: string): UploadTokenPayload | null {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const body = decodeBase64Url(token.slice(0, separator));
  const signature = decodeBase64Url(token.slice(separator + 1));
  if (!body || !signature) return null;

  const expected = createHmac("sha256", secret).update(body).digest();
  if (expected.length !== signature.length || !timingSafeEqual(expected, signature)) {
    return null;
  }

  let payload: UploadTokenPayload;
  try {
    payload = JSON.parse(body.toString("utf8")) as UploadTokenPayload;
  } catch {
    return null;
  }

  if (
    !payload.userId ||
    !payload.filename ||
    typeof payload.exp !== "number" ||
    !isMediaFolder(payload.folder)
  ) {
    return null;
  }

  if (payload.exp < Date.now()) return null;
  return payload;
}
