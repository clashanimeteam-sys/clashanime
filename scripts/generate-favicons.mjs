import { execSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import sharp from "sharp";

const source = "public/logo2.png";
const canvas = 1024;
const fillRatio = 1.18;
/** Move logo down in tab (lower crop top = logo sits lower in icon). */
const verticalShiftDown = 72;
/** Move logo left in tab (higher crop left = logo sits left in icon). */
const horizontalShiftLeft = 36;

if (!existsSync(source)) {
  throw new Error("Missing public/logo2.png");
}

const trimmed = await sharp(source).trim({ threshold: 8 }).png().toBuffer();
const stageSize = Math.round(canvas * fillRatio);

const staged = await sharp(trimmed)
  .resize(stageSize, stageSize, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const cropOffset = Math.floor((stageSize - canvas) / 2);
const cropTop = Math.max(0, cropOffset - verticalShiftDown);
const cropLeft = Math.min(stageSize - canvas, cropOffset + horizontalShiftLeft);

const icon = await sharp(staged)
  .extract({
    left: cropLeft,
    top: cropTop,
    width: canvas,
    height: canvas,
  })
  .png()
  .toBuffer();

const faviconOutputs = [
  "public/icon.png",
  "public/icon-512.png",
  "src/app/icon.png",
  "src/app/apple-icon.png",
  "public/icon-180.png",
];

for (const path of faviconOutputs) {
  await sharp(icon).toFile(path);
}

copyFileSync(source, "public/logo.png");

await sharp(icon).resize(32, 32).toFile("public/icon-32.png");

execSync(
  "magick public/icon.png -define icon:auto-resize=256,128,64,48,32,16 public/favicon.ico",
  { stdio: "inherit" },
);

copyFileSync("public/favicon.ico", "src/app/favicon.ico");

console.log(
  `Icons generated: ${Math.round(fillRatio * 100)}% scale, crop ${cropLeft},${cropTop} (${canvas}x${canvas}).`,
);
