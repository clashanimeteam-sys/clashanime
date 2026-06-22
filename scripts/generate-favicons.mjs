import { execSync } from "node:child_process";
import sharp from "sharp";

function whiteMatteRgb(data, width, height) {
  const out = Buffer.alloc(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    const ri = p * 3;
    const r = data[ri];
    const g = data[ri + 1];
    const b = data[ri + 2];
    const oi = p * 4;
    const a = 255 - Math.max(r, g, b);
    if (a <= 8) {
      out[oi] = out[oi + 1] = out[oi + 2] = out[oi + 3] = 0;
      continue;
    }
    const alpha = a / 255;
    out[oi + 3] = a;
    out[oi] = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - alpha)) / alpha)));
    out[oi + 1] = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - alpha)) / alpha)));
    out[oi + 2] = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - alpha)) / alpha)));
  }
  return out;
}

async function tightBBox(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      if (data[i + 3] > 20) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function buildCanvasIcon(sourcePath) {
  const { data, info } = await sharp(sourcePath)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const matted = whiteMatteRgb(data, info.width, info.height);
  const png = await sharp(matted, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  const box = await tightBBox(png);
  const cropped = await sharp(png).extract(box).png().toBuffer();

  const canvas = 512;
  const zoom = 1.12;
  const target = Math.round(canvas * zoom);
  const scale = Math.min(target / box.width, target / box.height);
  const logoW = Math.round(box.width * scale);
  const logoH = Math.round(box.height * scale);

  const oversized = await sharp(cropped)
    .resize(logoW, logoH, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .extend({
      top: Math.max(0, Math.floor((target - logoH) / 2)),
      bottom: Math.max(0, Math.ceil((target - logoH) / 2)),
      left: Math.max(0, Math.floor((target - logoW) / 2)),
      right: Math.max(0, Math.ceil((target - logoW) / 2)),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const meta = await sharp(oversized).metadata();
  const left = Math.floor((meta.width - canvas) / 2);
  const top = Math.floor((meta.height - canvas) / 2);

  return sharp(oversized).extract({ left, top, width: canvas, height: canvas }).png().toBuffer();
}

const icon = await buildCanvasIcon("public/logo2.png");

const outputs = [
  ["public/icon-512.png", null],
  ["public/icon.png", null],
  ["public/logo.png", null],
  ["src/app/icon.png", null],
  ["public/icon-180.png", 180],
  ["src/app/apple-icon.png", 180],
  ["public/icon-32.png", 32],
];

for (const [path, resize] of outputs) {
  await (resize ? sharp(icon).resize(resize, resize) : sharp(icon)).toFile(path);
}

await sharp(icon)
  .modulate({ brightness: 1.38, saturation: 1.45 })
  .linear(1.12, -12)
  .png()
  .toFile("public/icon-dark-512.png");

await sharp("public/icon-dark-512.png").resize(180, 180).toFile("public/icon-dark-180.png");
await sharp("public/icon-dark-512.png").resize(32, 32).toFile("public/icon-dark-32.png");

execSync(
  "magick public/icon-512.png -define icon:auto-resize=64,48,32,16 public/favicon.ico",
  { stdio: "inherit" },
);
execSync(
  "magick public/icon-dark-512.png -define icon:auto-resize=64,48,32,16 public/favicon-dark.ico",
  { stdio: "inherit" },
);

console.log("Favicons generated from public/logo2.png");
