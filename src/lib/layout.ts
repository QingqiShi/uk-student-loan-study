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
 * Working width of a fold or a seamed section on an ultra-wide monitor.
 *
 * The shell runs to 3440px so the header, footer and paper span the display, but
 * the instrument inside it stops widening well before that: past roughly this
 * point a wider grid only stretches its contents — a chart flattens, a line of
 * prose outruns a comfortable measure — without showing anything more. Applied
 * to the fold and to every `InstrumentSection` so they cap together and the
 * page keeps one left edge and one right edge all the way down.
 */
export const WORKSPACE_MAX = "ultra:max-w-[2160px]";

/**
 * Vertical rhythm of the fold — the instrument zone at the top of an index page
 * (the homepage explorer, the overpay comparison). Tighter above than below so
 * the fold sits close to the nameplate and separates cleanly from the first seam.
 */
export const FOLD_PAD =
  "pt-[clamp(1.8rem,3.2vw,3rem)] pb-[clamp(2.2rem,4vw,4rem)]";

/** Vertical rhythm of a hairline-seamed section below the fold. */
export const SECTION_PAD = "py-[clamp(2.6rem,5vw,5.5rem)]";

/**
 * Offset from a section's masthead down to its content — and none of it once the
 * two sit side by side, because from `work` the masthead moves into its own rail
 * and there is nothing above the content to clear. Callers add their own internal
 * spacing; an index that wants a tighter offset sets its own.
 */
export const SECTION_BODY_PAD = "mt-[clamp(1.6rem,2.4vw,2.4rem)] work:mt-0";

/**
 * The fold's caption prose — the sentence that reads the figures beside it, and
 * the disclaimer under the overpay levers. Small, soft, and held to a short
 * measure so it stays a caption rather than becoming a paragraph of body copy.
 */
export const FOLD_NOTE =
  "max-w-[52ch] font-sans text-meta leading-[1.6] text-muted-foreground";

/** Gap between the zones of a fold grid (head / chart / readout / controls). */
export const FOLD_GAP = "gap-[clamp(1.1rem,2vw,1.7rem)]";

/**
 * The workspace: the four-zone fold grammar every tool page that reports on a
 * loan is built on — `head` and `controls` stacked in a left rail, `chart`
 * filling the middle, `readout` in a right rail, both spanning the rail's two
 * rows.
 *
 * Shared rather than copied because the zones staying put across a navigation
 * *is* the feature. A reader on the homepage learns that their salary is on the
 * left, the chart is in the middle and their figures are on the right; opening
 * one of those figures should swap what is in the middle and mark the one they
 * opened, not rearrange the room. Two pages that each define their own grid
 * drift apart the first time either is retuned.
 *
 * Ladder: stacked on a phone (answer, chart, controls, figures); a two-column
 * `head | chart` with the readout and controls full-width beneath it from `md`;
 * the full three-zone workspace from `work`, where there is finally room for a
 * chart between two rails.
 */
export const FOLD_WORKSPACE = `grid grid-cols-[1fr] ${FOLD_GAP} [grid-template-areas:'head'_'chart'_'controls'_'readout'] *:min-w-0 md:grid-cols-[minmax(300px,0.82fr)_1.18fr] md:items-center md:gap-[clamp(1.4rem,2.2vw,2rem)] md:[grid-template-areas:'head_chart'_'readout_readout'_'controls_controls'] work:grid-cols-[36ch_minmax(0,1fr)_33ch] work:grid-rows-[auto_1fr] work:items-start work:gap-x-[clamp(2.4rem,3vw,4rem)] work:gap-y-[clamp(1.4rem,1.6vw,2rem)] work:[grid-template-areas:'head_chart_readout'_'controls_chart_readout'] ultra:grid-cols-[40ch_minmax(0,1fr)_38ch]`;

/** Zone placements inside {@link FOLD_WORKSPACE}. */
export const FOLD_ZONE = {
  head: "[grid-area:head]",
  chart: "[grid-area:chart]",
  controls: "[grid-area:controls]",
  readout: "[grid-area:readout]",
} as const;

/**
 * The shape both two-zone folds share: a rail carrying the page's answer beside
 * the evidence column that backs it up, each zone flowing on its own height so
 * neither has to reach the other. What differs is how the width is divided —
 * see the two splits below.
 *
 * Both splits wait for `wide`. Below it the rail would be too narrow to hold a
 * figure at a sensible size, and it would tower over a short evidence column, so
 * the zones stack and each takes the full bleed instead.
 */
const FOLD_ZONES =
  "grid items-start gap-x-[clamp(2rem,3vw,4rem)] gap-y-[clamp(1.8rem,2.8vw,2.6rem)]";

/**
 * Fold split for a rail that carries only the answer, beside the chart that
 * backs it up — the four detail pages. The controls are not in here: they run
 * as a full-width band under both zones, so the reader never has to come back
 * up-left to reach them.
 *
 * The two zones flow on their own heights; what keeps that from reading as a
 * void is that {@link FOLD_CHART_BODY} is tuned against the rail's own height,
 * so neither column ends far ahead of the other. Whatever slack is left falls
 * at the foot of the fold, where the console band's full-width hairline closes
 * both columns off together.
 */
export const FOLD_SPLIT_EVIDENCE = `${FOLD_ZONES} wide:grid-cols-[minmax(20rem,0.78fr)_minmax(0,1.22fr)] work:grid-cols-[minmax(22rem,0.66fr)_minmax(0,1.34fr)] ultra:grid-cols-[minmax(24rem,0.6fr)_minmax(0,1.4fr)]`;

/**
 * The controls band under a detail page's fold: a hairline, then the console
 * across the full working width.
 *
 * Full width because that is what the console is built for — the container
 * query on the preset group opens to a single five-across row, and the salary
 * slider gets a track long enough to aim with. Folded into the fold's rail it
 * got a 500px column, which reflowed the presets into a 2×2 block with the
 * "Tailor to you" card on its own row beneath.
 */
export const FOLD_CONSOLE_BAND =
  "mt-[clamp(1.8rem,2.8vw,2.6rem)] flex flex-col gap-[clamp(1.2rem,1.8vw,1.8rem)] border-t border-border pt-[clamp(1.4rem,2.2vw,2rem)]";

/**
 * Fold split for a rail that carries the controls as well as the answer — the
 * overpay fold, whose levers (a lump-sum field, a monthly-overpayment slider)
 * are the page's subject and belong beside the verdict they move.
 *
 * Proportional the whole way up, because those inputs stay usable at any width,
 * so the rail can keep a real share of a wide monitor. A rail of bare figures
 * would not — it stops improving once the figures are legible, which is why the
 * detail folds take {@link FOLD_SPLIT_EVIDENCE} and put their console in a band
 * below instead.
 */
export const FOLD_SPLIT_CONSOLE = `${FOLD_ZONES} wide:grid-cols-[minmax(24rem,0.85fr)_minmax(0,1.15fr)] work:grid-cols-[minmax(24rem,0.62fr)_minmax(0,1.38fr)] ultra:grid-cols-[minmax(28rem,0.52fr)_minmax(0,1.48fr)]`;

/**
 * Height of the plot area for a detail page's chart — set on `ChartFrame`'s
 * `bodyClassName`, so the panel grows around it.
 *
 * Sizing the *body* rather than the panel is what keeps the plot honest: a panel
 * given a fixed height spends it on padding, the caption rail and the legend
 * first and hands the remainder to the plot, which on a phone is barely a third
 * of it — and shrinks again whenever a third legend item wraps. Sized here, the
 * chrome adds to the panel instead of eating the chart.
 *
 * Definite while the zones are stacked; from `work` the slot's, via `fill` —
 * the chart's grid cell stretches to the taller of the two rails, the panel
 * takes that height and the body takes the remainder.
 *
 * Two details this depends on, both of which fail silently:
 *
 * `basis-*` beside the stacked heights, because `fill` sets `flex-1` and a zero
 * flex basis beats `height` for a flex item's main size. With `h-65` alone the
 * plot collapses to nothing on a phone.
 *
 * `aspect-auto` from `work`, because the shadcn chart container ships a 16:9
 * aspect as the fallback for a chart given no height. Here the slot owns the
 * height, and 16:9 of a 1550px-wide middle zone is an 877px-tall plot — which
 * then becomes the tallest thing in the grid and sizes the rails, instead of
 * the rails sizing it. `min-h` is the floor it falls back to instead, low
 * enough that the rails win the row and the plot fills what they leave.
 */
export const FOLD_CHART_BODY =
  "h-65 basis-65 sm:h-75 sm:basis-75 work:h-auto work:basis-auto work:min-h-72 work:[&_[data-slot=chart]]:aspect-auto";

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
