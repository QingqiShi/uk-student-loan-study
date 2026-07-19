import { cn } from "@/lib/utils";
import { Panel, PanelHeader } from "./Panel";

export interface ChartLegendItem {
  /** Legend label (sans). */
  label: string;
  /** Swatch colour as a CSS value, e.g. "var(--chart-1)". Defaults to the Principal data colour. */
  color?: string;
  /** Swatch shape: a line (default), a dot, or a dashed rule. */
  variant?: "line" | "dot" | "dash";
}

function Swatch({ color, variant = "line" }: Omit<ChartLegendItem, "label">) {
  const c = color ?? "var(--chart-principal)";
  if (variant === "dot") {
    return (
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: c }}
      />
    );
  }
  if (variant === "dash") {
    return (
      <span
        aria-hidden="true"
        className="w-3.5 shrink-0 border-t-2 border-dashed"
        style={{ borderColor: c }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="h-0.5 w-3.5 shrink-0 rounded-full"
      style={{ backgroundColor: c }}
    />
  );
}

/**
 * Wraps a chart in a `Panel` with the Fig caption rail (caption left, key figure
 * right) and an optional legend row beneath. The non-scoped equivalent of the
 * homepage `ChartPanel` — use it to turn every chart into an instrument and to
 * retire centred muted `<figcaption>`s. Renders the chart (`children`) inside
 * the panel body; the chart owns its own height/aspect.
 */
function ChartFrame({
  caption,
  figure,
  figureTone = "spruce",
  legend,
  bodyClassName,
  className,
  children,
}: {
  /** Left rail caption, e.g. "Fig. 1 — Lifetime repaid · Plan 2". */
  caption: React.ReactNode;
  /** Optional right-rail key figure (mono), e.g. "Peak £124,361". */
  figure?: React.ReactNode;
  /** Key-figure colour: `spruce` (default) or `cost` (brick — peak/cost). */
  figureTone?: "spruce" | "cost";
  /** Optional legend rendered beneath the chart. */
  legend?: ChartLegendItem[];
  /** Extra classes on the chart body wrapper. */
  bodyClassName?: string;
  className?: string;
  /** The chart. */
  children: React.ReactNode;
}) {
  return (
    // `min-w-0` lets the frame shrink inside flex/grid parents; `max-w-full`
    // + `overflow-hidden` clip recharts' wide SVG so a phone rotating back from
    // landscape to portrait can't leave the chart forcing horizontal overflow —
    // the clipped, shrinkable box lets ResponsiveContainer remeasure narrower.
    <Panel className={cn("max-w-full min-w-0 overflow-hidden", className)}>
      <PanelHeader caption={caption} figure={figure} tone={figureTone} />
      <div className={cn("max-w-full min-w-0 overflow-hidden", bodyClassName)}>
        {children}
      </div>
      {legend && legend.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
          {legend.map((item) => (
            <li key={item.label} className="inline-flex items-center gap-1.5">
              <Swatch color={item.color} variant={item.variant} />
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export { ChartFrame };
