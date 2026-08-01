/**
 * Shared surface treatments — the one place the site's card look is defined.
 *
 * Flat by default in the Instrument voice: a surface separates from the paper
 * background by a tonal step (`bg-card` on `bg-background`) plus a hairline
 * (`ring-1 ring-border`), not by elevation. The `shadow-card` token is a
 * barely-there lift, never a drop shadow. Radius is the panel radius
 * (`rounded-xl` = 14px). Reuse these instead of re-typing the string, and
 * prefer the shared `Panel` primitive for chart/readout frames.
 */

/** Flat instrument panel: card surface on the paper background, hairline, faint lift. */
export const surfaceCard = "rounded-xl bg-card ring-1 ring-border shadow-card";
