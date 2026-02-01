#!/usr/bin/env node
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, "..", "src", "app");

// Load brand colors from single source of truth
const brandColors = JSON.parse(
  readFileSync(
    join(__dirname, "..", "src", "lib", "brand-colors.json"),
    "utf-8",
  ),
);

// Social image dimensions
const WIDTH = 1200;
const HEIGHT = 630;

// Brand colors from shared source
const EMERALD_500 = brandColors.emerald["500"];
const EMERALD_600 = brandColors.emerald["600"];
const EMERALD_400 = brandColors.emerald["400"];
const EMERALD_300 = brandColors.emerald["300"];

// Icon settings
const ICON_SIZE = 100;
const ICON_X = (WIDTH - ICON_SIZE) / 2;
const ICON_Y = 130;
const ICON_RADIUS = Math.round((ICON_SIZE / 44) * 10);

// Create the social image SVG with enhanced design
const socialSvg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient - deeper with more color -->
    <radialGradient id="bgGradient" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
      <stop offset="0%" stop-color="#0A1F15"/>
      <stop offset="60%" stop-color="#050A08"/>
      <stop offset="100%" stop-color="#020403"/>
    </radialGradient>

    <!-- Dramatic icon glow -->
    <filter id="iconGlow" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="20" result="blur1"/>
      <feGaussianBlur stdDeviation="8" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur1"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Large ambient glow -->
    <filter id="ambientGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="60" result="blur"/>
    </filter>

    <!-- Grid pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${EMERALD_500}" stroke-width="0.3" opacity="0.15"/>
    </pattern>

    <!-- Gradient for accent line -->
    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${EMERALD_500}" stop-opacity="0"/>
      <stop offset="20%" stop-color="${EMERALD_400}" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="${EMERALD_300}" stop-opacity="1"/>
      <stop offset="80%" stop-color="${EMERALD_400}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${EMERALD_500}" stop-opacity="0"/>
    </linearGradient>

    <!-- Bottom bar gradient -->
    <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${EMERALD_500}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${EMERALD_500}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${EMERALD_500}" stop-opacity="0"/>
    </linearGradient>

    <!-- Chart area gradient -->
    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${EMERALD_500}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${EMERALD_500}" stop-opacity="0"/>
    </linearGradient>

    <!-- Clip path for icon -->
    <clipPath id="iconClip">
      <rect x="${ICON_X}" y="${ICON_Y}" width="${ICON_SIZE}" height="${ICON_SIZE}" rx="${ICON_RADIUS}"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGradient)"/>

  <!-- Subtle grid overlay - fades towards edges -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <!-- Abstract chart visualization in background (left side) -->
  <g opacity="0.4">
    <path d="M0 ${HEIGHT} L0 480 Q100 420 200 450 T400 380 T600 300 L600 ${HEIGHT} Z" fill="url(#chartGradient)"/>
    <path d="M0 480 Q100 420 200 450 T400 380 T600 300" fill="none" stroke="${EMERALD_500}" stroke-width="1.5" opacity="0.3"/>
  </g>

  <!-- Abstract chart visualization (right side, mirrored feel) -->
  <g opacity="0.3">
    <path d="M${WIDTH} ${HEIGHT} L${WIDTH} 500 Q1100 460 1000 420 T800 480 T600 520 L600 ${HEIGHT} Z" fill="url(#chartGradient)"/>
    <path d="M${WIDTH} 500 Q1100 460 1000 420 T800 480 T600 520" fill="none" stroke="${EMERALD_500}" stroke-width="1" opacity="0.25"/>
  </g>

  <!-- Decorative floating dots/particles -->
  <circle cx="150" cy="200" r="2" fill="${EMERALD_400}" opacity="0.4"/>
  <circle cx="280" cy="350" r="1.5" fill="${EMERALD_400}" opacity="0.3"/>
  <circle cx="100" cy="450" r="2.5" fill="${EMERALD_400}" opacity="0.25"/>
  <circle cx="1050" cy="180" r="2" fill="${EMERALD_400}" opacity="0.35"/>
  <circle cx="1100" cy="320" r="1.5" fill="${EMERALD_400}" opacity="0.3"/>
  <circle cx="950" cy="480" r="2" fill="${EMERALD_400}" opacity="0.2"/>
  <circle cx="350" cy="150" r="1" fill="${EMERALD_300}" opacity="0.5"/>
  <circle cx="850" cy="140" r="1" fill="${EMERALD_300}" opacity="0.5"/>

  <!-- Large ambient glow behind icon -->
  <ellipse cx="${WIDTH / 2}" cy="${ICON_Y + ICON_SIZE / 2 + 20}" rx="200" ry="150" fill="${EMERALD_500}" filter="url(#ambientGlow)" opacity="0.25"/>

  <!-- Secondary smaller glow -->
  <ellipse cx="${WIDTH / 2}" cy="${ICON_Y + ICON_SIZE / 2}" rx="100" ry="80" fill="${EMERALD_400}" filter="url(#ambientGlow)" opacity="0.15"/>

  <!-- Brand icon with wave design -->
  <g filter="url(#iconGlow)">
    <!-- Icon background -->
    <rect x="${ICON_X}" y="${ICON_Y}" width="${ICON_SIZE}" height="${ICON_SIZE}" rx="${ICON_RADIUS}" fill="${EMERALD_500}"/>
    <!-- Wave shape -->
    <g clip-path="url(#iconClip)">
      <path d="M${ICON_X + ICON_SIZE} ${ICON_Y + ICON_SIZE}l0-${(20 * ICON_SIZE) / 44}q-${(11 * ICON_SIZE) / 44}-${(16 * ICON_SIZE) / 44}-${(22 * ICON_SIZE) / 44}-${(12 * ICON_SIZE) / 44}-${(11 * ICON_SIZE) / 44} ${(5 * ICON_SIZE) / 44}-${(22 * ICON_SIZE) / 44} ${(16 * ICON_SIZE) / 44}l0 ${(16 * ICON_SIZE) / 44}z" fill="${EMERALD_600}"/>
    </g>
  </g>

  <!-- Decorative accent line below icon -->
  <rect x="400" y="270" width="400" height="2" fill="url(#lineGradient)" rx="1"/>

  <!-- Title -->
  <text x="${WIDTH / 2}" y="340" text-anchor="middle" font-family="Space Grotesk, system-ui, sans-serif" font-size="56" font-weight="700" fill="white" letter-spacing="-1.5">UK Student Loan Study</text>

  <!-- Tagline -->
  <text x="${WIDTH / 2}" y="405" text-anchor="middle" font-family="Space Grotesk, system-ui, sans-serif" font-size="24" font-weight="400" fill="#A1A1AA" letter-spacing="0.3">See how much you'll actually repay</text>

  <!-- Bottom accent bar -->
  <rect x="0" y="620" width="${WIDTH}" height="10" fill="url(#bottomGradient)" opacity="0.6"/>

  <!-- Domain URL -->
  <text x="${WIDTH / 2}" y="560" text-anchor="middle" font-family="Space Grotesk, system-ui, sans-serif" font-size="15" font-weight="600" fill="${EMERALD_400}" letter-spacing="3">STUDENTLOANSTUDY.UK</text>

  <!-- Subtle decorative corners -->
  <path d="M30 0 L30 30 L0 30" fill="none" stroke="${EMERALD_500}" stroke-width="1" opacity="0.2"/>
  <path d="M${WIDTH - 30} 0 L${WIDTH - 30} 30 L${WIDTH} 30" fill="none" stroke="${EMERALD_500}" stroke-width="1" opacity="0.2"/>
  <path d="M30 ${HEIGHT} L30 ${HEIGHT - 30} L0 ${HEIGHT - 30}" fill="none" stroke="${EMERALD_500}" stroke-width="1" opacity="0.2"/>
  <path d="M${WIDTH - 30} ${HEIGHT} L${WIDTH - 30} ${HEIGHT - 30} L${WIDTH} ${HEIGHT - 30}" fill="none" stroke="${EMERALD_500}" stroke-width="1" opacity="0.2"/>
</svg>`;

// Convert to PNG
const resvg = new Resvg(socialSvg, {
  font: {
    loadSystemFonts: true,
    defaultFontFamily: "Space Grotesk",
  },
});
const pngData = resvg.render();
const pngBuffer = pngData.asPng();

// Write both opengraph and twitter images (identical)
writeFileSync(join(appDir, "opengraph-image.png"), pngBuffer);
console.log("Generated opengraph-image.png (1200x630)");

writeFileSync(join(appDir, "twitter-image.png"), pngBuffer);
console.log("Generated twitter-image.png (1200x630)");

console.log("Done! Enhanced social images generated.");
