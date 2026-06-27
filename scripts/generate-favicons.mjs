import { execSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import sharp from "sharp";

const source = "public/logo2.png";
const canvas = 1024;
const zoom = 1.18;

if (!existsSync(source)) {
  throw new Error("Missing public/logo2.png");
}

const meta = await sharp(source).metadata();
const width = meta.width ?? canvas;
const height = meta.height ?? canvas;

const scaledW = Math.round(width * zoom);
const scaledH = Math.round(height * zoom);

const icon = await sharp(source)
  .resize(scaledW, scaledH, { fit: "fill", kernel: sharp.kernel.lanczos3 })
  .extract({
    left: Math.floor((scaledW - canvas) / 2),
    top: Math.floor((scaledH - canvas) / 2),
    width: canvas,
    height: canvas,
  })
  .png()
  .toBuffer();

const outputs = [
  "public/icon.png",
  "public/icon-512.png",
  "public/logo.png",
  "src/app/icon.png",
  "src/app/apple-icon.png",
  "public/icon-180.png",
];

for (const path of outputs) {
  await sharp(icon).toFile(path);
}

await sharp(icon).resize(32, 32).toFile("public/icon-32.png");

execSync(
  "magick public/icon.png -define icon:auto-resize=256,128,64,48,32,16 public/favicon.ico",
  { stdio: "inherit" },
);

copyFileSync("public/favicon.ico", "src/app/favicon.ico");

console.log(`Icons generated from logo2.png at ${Math.round(zoom * 100)}% zoom (${canvas}x${canvas}).`);
