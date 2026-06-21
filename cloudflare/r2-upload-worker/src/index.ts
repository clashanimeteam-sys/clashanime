type UploadPayload = {
  userId: string;
  folder: "clips" | "thumbnails" | "avatars" | "banners";
  filename: string;
  exp: number;
};

export interface Env {
  MEDIA: R2Bucket;
  UPLOAD_SECRET: string;
  PUBLIC_URL: string;
}

const ALLOWED_ORIGINS = new Set([
  "https://www.clashanime.com",
  "https://clashanime.com",
  "http://localhost:3000",
]);

const ALLOWED_FOLDERS = new Set(["clips", "thumbnails", "avatars", "banners"]);

function corsHeaders(origin: string | null): HeadersInit {
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://www.clashanime.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Upload-Token",
    "Access-Control-Max-Age": "86400",
  };
}

function decodeBase64Url(value: string): Uint8Array | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  } catch {
    return null;
  }
}

async function verifyUploadToken(token: string, secret: string): Promise<UploadPayload | null> {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const bodyBytes = decodeBase64Url(token.slice(0, separator));
  const signatureBytes = decodeBase64Url(token.slice(separator + 1));
  if (!bodyBytes || !signatureBytes) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const valid = await crypto.subtle.verify("HMAC", key, signatureBytes, bodyBytes);
  if (!valid) return null;

  let payload: UploadPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(bodyBytes)) as UploadPayload;
  } catch {
    return null;
  }

  if (
    !payload.userId ||
    !payload.filename ||
    typeof payload.exp !== "number" ||
    !ALLOWED_FOLDERS.has(payload.folder)
  ) {
    return null;
  }

  if (payload.exp < Date.now()) return null;
  return payload;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders(origin),
      });
    }

    const token = request.headers.get("X-Upload-Token");
    if (!token) {
      return Response.json({ error: "missing upload token" }, { status: 401, headers: corsHeaders(origin) });
    }

    const payload = await verifyUploadToken(token, env.UPLOAD_SECRET);
    if (!payload) {
      return Response.json({ error: "invalid upload token" }, { status: 401, headers: corsHeaders(origin) });
    }

    if (!request.body) {
      return Response.json({ error: "missing file body" }, { status: 400, headers: corsHeaders(origin) });
    }

    const key = `${payload.folder}/${payload.userId}/${payload.filename}`;
    const contentType = request.headers.get("Content-Type") ?? undefined;

    await env.MEDIA.put(key, request.body, {
      httpMetadata: contentType ? { contentType } : undefined,
    });

    const publicUrl = `${env.PUBLIC_URL.replace(/\/$/, "")}/${key}`;

    return Response.json(
      {
        key,
        publicUrl,
      },
      { headers: corsHeaders(origin) },
    );
  },
};
