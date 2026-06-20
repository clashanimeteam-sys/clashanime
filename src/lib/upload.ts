export function parseHashtags(input: string): string[] {
  const tags = input
    .split(/[\s,#]+/)
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());

  return [...new Set(tags)].slice(0, 12);
}

export function formatHashtags(tags: string[]): string {
  return tags.map((tag) => `#${tag}`).join(" ");
}

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("invalid-video"));
    };

    video.src = url;
  });
}

export function getPublicStorageUrl(
  supabaseUrl: string,
  bucket: string,
  path: string,
): string {
  const base = supabaseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
