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

function MetricReadout({
  columns = 4,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Cell count across at the widest breakpoint (1–4). Default 4. */
  columns?: 1 | 2 | 3 | 4;
}) {
  return (
    <div
      data-slot="metric-readout"
      className={cn(
        "grid gap-px overflow-hidden rounded-lg border border-border bg-border",
        COLUMN_CLASS[columns],
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
const VALUE_TONE: Record<"default" | "emphasis" | "cost", string> = {
  default: "text-fig-lg text-foreground",
  emphasis: "text-fig-hero text-foreground",
  cost: "text-fig-lg text-signal",
};

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
  tone?: "default" | "emphasis" | "cost";
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
}: MetricCellProps & { chevron: boolean }) {
  const valueClass = cn(
    "font-mono leading-none font-semibold tracking-tight tabular-nums",
    VALUE_TONE[tone],
  );
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
        <div className={valueClass}>
          {typeof value === "string" ? <Figure value={value} /> : value}
        </div>
      )}

      <div className="mt-auto">
        {loading
          ? (skeleton ?? (
              <div className="h-10 w-full animate-pulse rounded-sm bg-muted" />
            ))
          : children}
      </div>

      {linkLabel && <span className="sr-only"> — {linkLabel}</span>}
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
  ...rest
}: MetricCellProps) {
  const showChevron = chevron ?? (href != null && !active);
  const base =
    "group flex min-h-32 flex-col gap-2 bg-card p-4 text-left no-underline transition-colors";

  if (href && !active) {
    return (
      <Link
        href={href}
        className={cn(
          base,
          "hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset",
          className,
        )}
      >
        <CellInner {...rest} active={active} chevron={showChevron} />
      </Link>
    );
  }

  return (
    <div
      className={cn(base, className)}
      {...(active ? { "aria-current": "page" as const } : {})}
    >
      <CellInner {...rest} active={active} chevron={showChevron} />
    </div>
  );
}

export { MetricReadout, MetricCell, Chevron };
