function averageHashFromPixels(data: Uint8ClampedArray): string {
  const pixels: number[] = [];

  for (let index = 0; index < data.length; index += 4) {
    pixels.push(
      data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114,
    );
  }

  const average = pixels.reduce((sum, value) => sum + value, 0) / pixels.length;
  let bits = "";

  for (const pixel of pixels) {
    bits += pixel >= average ? "1" : "0";
  }

  let hex = "";
  for (let index = 0; index < bits.length; index += 4) {
    hex += parseInt(bits.slice(index, index + 4), 2).toString(16);
  }

  return hex;
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      resolve();
    };

    const onError = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      reject(new Error("seek_failed"));
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = Math.min(Math.max(time, 0), Math.max(video.duration - 0.05, 0));
  });
}

export async function sha256File(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function computeImageFingerprint(file: File): Promise<string> {
  const url = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("image_load_failed"));
      element.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 8;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("canvas_unavailable");
    }

    context.drawImage(image, 0, 0, 8, 8);
    const imageData = context.getImageData(0, 0, 8, 8);
    return averageHashFromPixels(imageData.data);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function computeVideoFingerprint(file: File): Promise<string> {
  const url = URL.createObjectURL(file);

  try {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("video_load_failed"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 8;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("canvas_unavailable");
    }

    const positions = [0.05, 0.25, 0.5, 0.75, 0.95];
    const hashes: string[] = [];

    for (const position of positions) {
      await seekVideo(video, video.duration * position);
      context.drawImage(video, 0, 0, 8, 8);
      const imageData = context.getImageData(0, 0, 8, 8);
      hashes.push(averageHashFromPixels(imageData.data));
    }

    return hashes.join("");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export type ContentFingerprints = {
  fileHash: string;
  perceptualHash: string;
  thumbHash: string;
};

export async function computeContentFingerprints(
  videoFile: File,
  thumbnailFile: File,
): Promise<ContentFingerprints> {
  const [fileHash, perceptualHash, thumbHash] = await Promise.all([
    sha256File(videoFile),
    computeVideoFingerprint(videoFile),
    computeImageFingerprint(thumbnailFile),
  ]);

  return { fileHash, perceptualHash, thumbHash };
}
