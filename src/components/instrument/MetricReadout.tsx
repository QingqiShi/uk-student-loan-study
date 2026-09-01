import Link from "next/link";
import { Figure } from "@/components/typography/Figure";
import { cn } from "@/lib/utils";

/**
 * The spec-sheet readout — ONE bordered panel split into N cells by 1px hairline
 * seams, the non-scoped equivalent of the homepage `.readout`. Lay
 * `<MetricCell>`s inside it; the grid `gap-px` over a `bg-border` ground draws
 * the etched seams and each cell's `bg-card` fills the quadrant. Never render
 * headline stats as separate floating cards — compose them here.
 *
 * Serves every headline-stat surface: the four drill-down loan metrics
 * (`InsightCards`), a detail page's hero stats, the overpay summary, and a
 * plan's key figures.
 */
const COLUMN_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/**
 * The `rail` ladder, for a readout standing in a fold's rail rather than running
 * across the page: the hero figure over a pair on a phone, a row once there is
 * room, then a single stacked column from `wide`, where the rail is too narrow to
 * hold a row of figures.
 *
 * Held as a whole ladder per column count, not as an override layered over
 * {@link COLUMN_CLASS}: composing the two would leave one readout's responsive
 * behaviour assembled from two sources of truth, so retuning a preset's middle
 * step would silently retune the rail's too.
 */
const RAIL_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2 wide:grid-cols-1",
  // Three cells don't divide into the phone's pair, so the first — the hero
  // figure — takes the full width above the other two rather than leaving a hole
  // in the grid. Set here so it can never be applied to the wrong cell, or the
  // ladder applied without it.
  3: "grid-cols-2 sm:grid-cols-3 wide:grid-cols-1 [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1",
  4: "grid-cols-2 sm:grid-cols-4 wide:grid-cols-1",
};

function MetricReadout({
  columns = 4,
  rail = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Cell count across at the widest breakpoint (1–4). Default 4. */
  columns?: 1 | 2 | 3 | 4;
  /**
   * Lay the cells out for a fold rail instead of across the page — see
   * {@link RAIL_CLASS}. The homepage fold's readout keeps a ladder of its own
   * because it collapses at `work` rather than `wide`: it is the third zone of a
   * three-zone workspace, not one of two.
   */
  rail?: boolean;
}) {
  return (
    <div
      data-slot="metric-readout"
      className={cn(
        "grid gap-px overflow-hidden rounded-lg border border-border bg-border",
        rail ? RAIL_CLASS[columns] : COLUMN_CLASS[columns],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-faint transition duration-150 group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:translate-x-0.5 group-focus-visible:text-primary"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

// The mono figure ramp is the readout's identity: default figures at `fig-lg`,
// the headline steps up to `fig-hero`, cost figures take the clay signal. Emphasis
// keeps the value in ink and flips the *label* to spruce-ink (see CellInner) — the
// homepage readout's headline treatment, now the shared standard.
export type MetricTone = "default" | "emphasis" | "cost";

const VALUE_TONE: Record<MetricTone, string> = {
  default: "text-fig-lg text-foreground",
  emphasis: "text-fig-hero text-foreground",
  cost: "text-fig-lg text-signal",
};

/**
 * The readout figure treatment on its own, for surfaces that lay out their own
 * cells (a guide's `SeamGrid`, say) but must set their figures the same way.
 *
 * `leading-none` trails the tone deliberately: a font-size utility overrides the
 * line-height set before it, so the readout's 1.0 leading has to be the last
 * word or the figure ramp would reintroduce normal leading.
 */
function metricValueClass(tone: MetricTone = "default"): string {
  return cn(
    "font-mono font-semibold tracking-tight tabular-nums",
    VALUE_TONE[tone],
    "leading-none",
  );
}

type MetricCellProps = {
  /** Engraved sans label (the metric key). */
  label: React.ReactNode;
  /** The figure — rendered mono/tabular automatically. Omit while `loading`. */
  value?: React.ReactNode;
  /**
   * Figure treatment: `default`, `emphasis` (steps the figure up to the hero size
   * and flips the label to spruce-ink, for the headline number) or `cost` (clay
   * signal, for interest/cost figures).
   */
  tone?: MetricTone;
  /** Turns the whole cell into a drill-down link with hover + focus states. */
  href?: string;
  /** Marks the cell as the current page: no link, no chevron, spruce-ink label. */
  active?: boolean;
  /** Show the drill chevron. Defaults to `true` when `href` is set. */
  chevron?: boolean;
  /** Render the skeleton state while live figures resolve. */
  loading?: boolean;
  /**
   * Height-matched placeholder for the viz slot while `loading`. Provide one that
   * mirrors the real viz structure so the cell keeps a constant height when live
   * figures resolve; falls back to a generic bar when omitted.
   */
  skeleton?: React.ReactNode;
  /** Extra sr-only context appended to the link, e.g. "open the interest breakdown". */
  linkLabel?: string;
  /** Inline viz slot (sparkline / split-bar / benchmark), pinned to the baseline. */
  children?: React.ReactNode;
  /** Optional `data-slot` on the cell root — a stable hook for e2e/scripts. */
  dataSlot?: string;
  className?: string;
};

function CellInner({
  label,
  value,
  tone = "default",
  active,
  chevron,
  loading,
  skeleton,
  linkLabel,
  children,
  hasViz,
}: MetricCellProps & { chevron: boolean; hasViz: boolean }) {
  const valueClass = metricValueClass(tone);
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "font-sans text-xs font-semibold tracking-label uppercase transition-colors",
            active || tone === "emphasis"
              ? "text-cta"
              : "text-muted-foreground group-hover:text-cta group-focus-visible:text-cta",
          )}
        >
          {label}
        </span>
        {chevron && <Chevron />}
      </div>

      {loading ? (
        // Same value classes → identical line box → no height jump when the
        // figure resolves; `text-transparent` over `bg-muted` reads as a chip.
        <div
          className={cn(
            valueClass,
            "w-28 max-w-full animate-pulse rounded-sm bg-muted text-transparent",
          )}
        >
          0
        </div>
      ) : (
        <div className={valueClass} data-slot="metric-value">
          {typeof value === "string" ? <Figure value={value} /> : value}
        </div>
      )}

      {hasViz && (
        <div className="mt-auto">
          {loading
            ? (skeleton ?? (
                <div className="h-10 w-full animate-pulse rounded-sm bg-muted" />
              ))
            : children}
        </div>
      )}

      {linkLabel && <span className="sr-only">, {linkLabel}</span>}
    </>
  );
}

/**
 * One quadrant of a `MetricReadout`: engraved label, a mono figure, and an
 * optional baseline-pinned viz. Pass `href` to make the whole cell a drill-down
 * link (hover → muted bg, label → spruce-ink, chevron nudges +2px; focus-visible
 * → inset spruce ring). Pass `active` to mark the current page.
 */
function MetricCell({
  href,
  active,
  chevron,
  className,
  dataSlot,
  ...rest
}: MetricCellProps) {
  const showChevron = chevron ?? (href != null && !active);
  // A cell only reserves the baseline viz band when it actually carries one —
  // `min-h-32` is the height a label, a figure and a sparkline need together,
  // and on a bare label-and-figure cell it is 70-odd px of empty card. While
  // loading that means the caller's `skeleton`: with no stand-in there is
  // nothing to hold the band open for, and a cell that reserves it now and
  // drops it when the figure lands would jump.
  const hasViz =
    rest.children != null || (rest.loading === true && rest.skeleton != null);
  const base = cn(
    "group flex flex-col gap-2 bg-card p-4 text-left no-underline transition-colors",
    hasViz && "min-h-32",
  );

  if (href && !active) {
    return (
      <Link
        href={href}
        data-slot={dataSlot}
        className={cn(
          base,
          "hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset",
          className,
        )}
      >
        <CellInner
          {...rest}
          active={active}
          chevron={showChevron}
          hasViz={hasViz}
        />
      </Link>
    );
  }

  return (
    <div
      className={cn(base, className)}
      data-slot={dataSlot}
      {...(active ? { "aria-current": "page" as const } : {})}
    >
      <CellInner
        {...rest}
        active={active}
        chevron={showChevron}
        hasViz={hasViz}
      />
    </div>
  );
}

export { MetricReadout, MetricCell, metricValueClass };
