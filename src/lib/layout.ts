/**
 * Shared layout class strings — the one place the full-bleed shell width and
 * the fluid page gutter are defined, so the header, footer, main and homepage
 * sections stay in lockstep instead of repeating the magic values inline.
 */

/** Ultra-wide page cap — matches the 3-zone workspace max width. */
export const SHELL_MAX = "max-w-[3440px]";

/** Fluid horizontal gutter for full-bleed shells and homepage sections. */
export const SHELL_GUTTER = "px-[clamp(1.15rem,4.2vw,5rem)]";

/** Wide shell: ultra-wide cap + fluid gutter (header / footer / main, full bleed). */
export const SHELL_WIDE = `${SHELL_MAX} ${SHELL_GUTTER}`;

/**
 * Inline prose link in the accent-ink (`text-cta`) treatment — underlined, the
 * underline dropping on hover. Reuse instead of re-typing the string.
 */
export const PROSE_LINK =
  "text-cta underline underline-offset-4 hover:no-underline";
