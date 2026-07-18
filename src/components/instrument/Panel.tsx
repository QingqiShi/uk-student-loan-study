import { surfaceCard } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

/**
 * The Instrument frame — the flat, hairlined surface every chart and first-class
 * readout lives inside. This is the non-scoped equivalent of the homepage
 * `.panel`: a `bg-card` surface separated from the paper background by a 1px
 * hairline (`ring-border`) and the barely-there `shadow-card` lift, never a
 * drop shadow. Radius is the panel radius (`rounded-xl` = 14px).
 *
 * Use `<Panel>` for a bare frame or compose it with `<PanelHeader>` for the Fig
 * caption rail. Prefer `ChartFrame` when wrapping a chart — it wires the header
 * rail and legend for you.
 */
function Panel({
  padding = true,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Apply the standard panel padding. Set `false` for edge-to-edge content. */
  padding?: boolean;
}) {
  return (
    <div
      data-slot="panel"
      className={cn(
        surfaceCard,
        padding && "p-4 sm:p-5",
        "text-card-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * The Fig caption rail that sits at the top of a Panel: a small sans, muted
 * caption on the left (e.g. `Fig. 1 — Lifetime repaid · Plan 2`) and an optional
 * mono key figure on the right (spruce-ink by default, brick for a cost/peak).
 *
 * The caption is language, so it stays sans. The figure is a numeric readout, so
 * it is set mono/tabular — pass an already-formatted string or a `Figure` node.
 */
function PanelHeader({
  caption,
  figure,
  tone = "spruce",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** Left rail: small sans muted caption, e.g. "Fig. 1 — Lifetime repaid · Plan 2". */
  caption: React.ReactNode;
  /** Optional right rail: the key figure, rendered mono/tabular. */
  figure?: React.ReactNode;
  /** Figure colour: `spruce` (default, on-brand) or `cost` (brick — peak/cost). */
  tone?: "spruce" | "cost";
}) {
  return (
    <div
      data-slot="panel-header"
      className={cn(
        "mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1",
        className,
      )}
      {...props}
    >
      <span className="text-sm font-medium text-muted-foreground">
        {caption}
      </span>
      {figure != null && (
        <span
          className={cn(
            "font-mono text-sm font-semibold tracking-tight tabular-nums",
            tone === "cost" ? "text-signal" : "text-cta",
          )}
        >
          {figure}
        </span>
      )}
    </div>
  );
}

export { Panel, PanelHeader };
