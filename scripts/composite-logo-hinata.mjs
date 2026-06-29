import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SIZE = 1024;
const CX = 512;
const CY = 505;
const R = 285;

const LOGO = join(ROOT, "public/logo2.png");
const HINATA = join(ROOT, "public/brand-hinata-peek.png");

const OUT_FULL = join(ROOT, "public/brand-logo-hinata-inner.png");
const OUT_TRIMMED = join(ROOT, "public/brand-logo-hinata-inner-trimmed.png");
const OUT_ASSETS = join(ROOT, "assets/clashanime-logo-hinata-inner.png");
const OUT_ASSETS_TRIMMED = join(ROOT, "assets/clashanime-logo-hinata-inner-trimmed.png");

function circleMaskSvg(radius = R) {
  return Buffer.from(
    `<svg width="${SIZE}" height="${SIZE}"><circle cx="${CX}" cy="${CY}" r="${radius}" fill="white"/></svg>`,
  );
}

async function knockOutDark(buffer, threshold = 42) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= threshold && g <= threshold && b <= threshold) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toBuffer();
}

async function buildHinataLayer() {
  const hinataSize = 720;
  const hinataSquare = await sharp(HINATA)
    .resize(hinataSize, hinataSize, { fit: "cover", position: "right bottom" })
    .png()
    .toBuffer();

  const hinataNoBg = await knockOutDark(hinataSquare, 38);

  const offsetLeft = CX - R - 40;
  const offsetTop = CY - R + 30;

  return sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: hinataNoBg, top: offsetTop, left: offsetLeft },
      { input: circleMaskSvg(), blend: "dest-in" },
    ])
    .png()
    .toBuffer();
}

async function buildLogoWithHole() {
  return sharp(LOGO)
    .ensureAlpha()
    .composite([{ input: circleMaskSvg(), blend: "dest-out" }])
    .png()
    .toBuffer();
}

async function buildPlayOverlay() {
  const extract = { left: CX - 210, top: CY - 210, width: 420, height: 420 };
  const playCrop = await sharp(LOGO).extract(extract).png().toBuffer();
  const playTransparent = await knockOutDark(playCrop, 48);

  return { playTransparent, extract };
}

async function trimTransparent(buffer) {
  return sharp(buffer).trim().png().toBuffer();
}

async function main() {
  if (!existsSync(LOGO)) throw new Error(`Missing ${LOGO}`);
  if (!existsSync(HINATA)) throw new Error(`Missing ${HINATA}`);

  const [hinataLayer, logoWithHole, play] = await Promise.all([
    buildHinataLayer(),
    buildLogoWithHole(),
    buildPlayOverlay(),
  ]);

  const composite = await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: hinataLayer },
      { input: logoWithHole },
      {
        input: play.playTransparent,
        top: play.extract.top,
        left: play.extract.left,
      },
    ])
    .png()
    .toBuffer();

  const trimmed = await trimTransparent(composite);

  await sharp(composite).toFile(OUT_FULL);
  await sharp(trimmed).toFile(OUT_TRIMMED);
  await sharp(composite).toFile(OUT_ASSETS);
  await sharp(trimmed).toFile(OUT_ASSETS_TRIMMED);

  console.log("Wrote:", OUT_FULL, OUT_TRIMMED);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
