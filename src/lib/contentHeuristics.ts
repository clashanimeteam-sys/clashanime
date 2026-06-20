export type ContentSuspicionFlag =
  | "suspicious_filename"
  | "top_text_overlay"
  | "letterbox_bars"
  | "download_metadata";

export type ContentSuspicionResult = {
  score: number;
  flags: ContentSuspicionFlag[];
};

const SUSPICIOUS_FILENAME =
  /youtube|youtu\.be|shorts|ytmp3|y2mate|savefrom|snaptik|tiktok|instagram|reels|download|ripped|clip/i;

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

function luminanceAt(data: Uint8ClampedArray, index: number): number {
  return (
    data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114
  );
}

function analyzeBand(
  data: Uint8ClampedArray,
  width: number,
  yStart: number,
  yEnd: number,
): { edgeDensity: number; variance: number; darkRatio: number } {
  const luminances: number[] = [];
  let edgeSum = 0;
  let darkPixels = 0;
  let pixelCount = 0;

  for (let y = yStart; y < yEnd; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const lum = luminanceAt(data, index);
      luminances.push(lum);
      pixelCount += 1;

      if (lum < 24) {
        darkPixels += 1;
      }

      if (x > 0) {
        const prev = luminanceAt(data, (y * width + (x - 1)) * 4);
        edgeSum += Math.abs(lum - prev);
      }

      if (y > yStart) {
        const above = luminanceAt(data, ((y - 1) * width + x) * 4);
        edgeSum += Math.abs(lum - above);
      }
    }
  }

  const mean = luminances.reduce((sum, value) => sum + value, 0) / luminances.length;
  const variance =
    luminances.reduce((sum, value) => sum + (value - mean) ** 2, 0) / luminances.length;

  return {
    edgeDensity: edgeSum / Math.max(pixelCount * 2, 1),
    variance,
    darkRatio: darkPixels / Math.max(pixelCount, 1),
  };
}

function hasTopTextOverlay(data: Uint8ClampedArray, width: number, height: number): boolean {
  const topEnd = Math.max(Math.floor(height * 0.18), 8);
  const middleStart = Math.floor(height * 0.42);
  const middleEnd = Math.floor(height * 0.58);

  const top = analyzeBand(data, width, 0, topEnd);
  const middle = analyzeBand(data, width, middleStart, middleEnd);

  const edgeRatio = top.edgeDensity / Math.max(middle.edgeDensity, 1);
  const varianceRatio = top.variance / Math.max(middle.variance, 1);

  return edgeRatio >= 1.35 && varianceRatio >= 1.25 && top.variance >= 900;
}

function hasLetterboxBars(data: Uint8ClampedArray, width: number, height: number): boolean {
  const topEnd = Math.max(Math.floor(height * 0.08), 4);
  const bottomStart = Math.floor(height * 0.92);
  const top = analyzeBand(data, width, 0, topEnd);
  const bottom = analyzeBand(data, width, bottomStart, height);

  return top.darkRatio >= 0.72 && bottom.darkRatio >= 0.72;
}

async function scanVideoFrames(file: File): Promise<ContentSuspicionFlag[]> {
  const url = URL.createObjectURL(file);
  const flags = new Set<ContentSuspicionFlag>();

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
    const sampleWidth = 180;
    const sampleHeight = 320;
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      return [];
    }

    const positions = [0.12, 0.35, 0.55, 0.78];
    let overlayHits = 0;
    let letterboxHits = 0;

    for (const position of positions) {
      await seekVideo(video, video.duration * position);
      context.drawImage(video, 0, 0, sampleWidth, sampleHeight);
      const imageData = context.getImageData(0, 0, sampleWidth, sampleHeight);

      if (hasTopTextOverlay(imageData.data, sampleWidth, sampleHeight)) {
        overlayHits += 1;
      }

      if (hasLetterboxBars(imageData.data, sampleWidth, sampleHeight)) {
        letterboxHits += 1;
      }
    }

    if (overlayHits >= 2) {
      flags.add("top_text_overlay");
    }

    if (letterboxHits >= 2) {
      flags.add("letterbox_bars");
    }
  } finally {
    URL.revokeObjectURL(url);
  }

  return [...flags];
}

function scanFilename(file: File): ContentSuspicionFlag | null {
  if (SUSPICIOUS_FILENAME.test(file.name)) {
    return "suspicious_filename";
  }

  return null;
}

export async function analyzeContentAuthenticity(
  videoFile: File,
): Promise<ContentSuspicionResult> {
  const flags: ContentSuspicionFlag[] = [];
  let score = 0;

  const filenameFlag = scanFilename(videoFile);
  if (filenameFlag) {
    flags.push(filenameFlag);
    score += 35;
  }

  const frameFlags = await scanVideoFrames(videoFile);

  for (const flag of frameFlags) {
    flags.push(flag);
  }

  if (frameFlags.includes("top_text_overlay")) {
    score += 55;
  }

  if (frameFlags.includes("letterbox_bars")) {
    score += 30;
  }

  return { score, flags };
}

export const REJECT_SUSPICION_SCORE = 45;
export const REVIEW_SUSPICION_SCORE = 20;
