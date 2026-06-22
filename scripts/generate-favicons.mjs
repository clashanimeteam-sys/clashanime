import { copyFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const source = "public/logo2.png";

if (!existsSync(source)) {
  throw new Error("Missing public/logo2.png");
}

const copies = [
  "public/icon.png",
  "public/icon-512.png",
  "public/logo.png",
  "src/app/icon.png",
  "src/app/apple-icon.png",
  "public/icon-180.png",
];

for (const target of copies) {
  copyFileSync(source, target);
}

// ICO needs multiple sizes; resize only for the container format, no color/crop edits.
execSync(
  `magick "${source}" -define icon:auto-resize=256,128,64,48,32,16 public/favicon.ico`,
  { stdio: "inherit" },
);

execSync(`magick "${source}" -resize 32x32 public/icon-32.png`, { stdio: "inherit" });

console.log("Icons copied from public/logo2.png without visual modification (1024x1024).");
