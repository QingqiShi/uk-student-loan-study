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
 * Vertical rhythm of the fold — the instrument zone at the top of an index page
 * (the homepage explorer, the overpay comparison). Tighter above than below so
 * the fold sits close to the nameplate and separates cleanly from the first seam.
 */
export const FOLD_PAD =
  "pt-[clamp(1.8rem,3.2vw,3rem)] pb-[clamp(2.2rem,4vw,4rem)]";

/** Vertical rhythm of a hairline-seamed section below the fold. */
export const SECTION_PAD = "py-[clamp(2.6rem,5vw,5.5rem)]";

/** Gap between the zones of a fold grid (head / chart / readout / controls). */
export const FOLD_GAP = "gap-[clamp(1.1rem,2vw,1.7rem)]";

/**
 * The engraved field key — the Instrument's single label treatment (DESIGN.md
 * §3: one size, one weight, one tracking) for a control's name. `Eyebrow` is
 * the same treatment with a spruce marker rule for section labels; use this
 * bare form on a field, where a marker per control would be noise.
 */
export const ENGRAVED_LABEL =
  "font-sans text-xs font-semibold tracking-label text-muted-foreground uppercase";

/**
 * Inline prose link in the accent-ink (`text-cta`) treatment — underlined, the
 * underline dropping on hover. Reuse instead of re-typing the string.
 */
export const PROSE_LINK =
  "text-cta underline underline-offset-4 hover:no-underline";
