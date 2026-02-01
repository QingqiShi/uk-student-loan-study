#!/usr/bin/env node
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, "..", "src", "app");

// Read the source SVG
const svgContent = readFileSync(join(appDir, "icon.svg"), "utf8");

// Generate 512x512 icon.png (for manifest/PWA)
const icon512 = new Resvg(svgContent, {
  fitTo: { mode: "width", value: 512 },
});
const icon512Png = icon512.render();
writeFileSync(join(appDir, "icon.png"), icon512Png.asPng());
console.log("Generated icon.png (512x512)");

// Generate 180x180 apple-icon.png
const icon180 = new Resvg(svgContent, {
  fitTo: { mode: "width", value: 180 },
});
const icon180Png = icon180.render();
writeFileSync(join(appDir, "apple-icon.png"), icon180Png.asPng());
console.log("Generated apple-icon.png (180x180)");

console.log("Done! Icons generated with square corners.");
