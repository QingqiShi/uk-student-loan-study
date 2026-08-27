import { Eyebrow } from "@/components/typography/Eyebrow";
import { cn } from "@/lib/utils";

/**
 * The leaf half of the guide archetype: the pieces a client component can pull
 * in without dragging the whole guide shell (breadcrumb, related guides, the
 * contents rail) into its browser chunk. {@link file://./guide-parts.tsx
 * guide-parts.tsx} holds the server-only shell that builds on these.
 */

/** Inline prose link: spruce-ink with a hairline underline that thickens on hover. */
export const guideLink =
  "font-medium text-cta underline decoration-1 underline-offset-4 transition-[text-decoration-color,color] hover:text-cta/80";

/** An off-site prose link (GOV.UK, HMRC), opened in a new tab. */
export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={guideLink}
    >
      {children}
    </a>
  );
}

/**
 * One chip of a segmented toggle — the control every guide figure uses to switch
 * its scenario (salary, RPI, destination). Ink-on-paper when active, a muted
 * chip when not.
 */
export function segmentToggle(active: boolean): string {
  return cn(
    "rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    active
      ? "bg-foreground text-background"
      : "bg-muted text-muted-foreground hover:bg-muted/80",
  );
}

const SEAM_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

/**
 * A spec-sheet grid: cells joined by 1px hairline seams (gap-px over the border
 * ground), the same etched-divider language as the homepage readout. Use it for
 * feature groups that were previously floating icon cards.
 */
export function SeamGrid({
  columns = 2,
  className,
  children,
}: {
  columns?: 1 | 2 | 3;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-xl bg-border ring-1 ring-border",
        SEAM_COLS[columns],
        className,
      )}
    >
      {children}
    </div>
  );
}

/** One cell of a {@link SeamGrid}: optional spruce icon, engraved label, prose. */
export function SeamCell({
  icon,
  eyebrow,
  title,
  children,
  className,
}: {
  icon?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 bg-card p-4 sm:p-5", className)}>
      {icon != null && <div>{icon}</div>}
      {eyebrow != null && <Eyebrow marker={false}>{eyebrow}</Eyebrow>}
      {title != null && (
        <p className="font-semibold text-foreground">{title}</p>
      )}
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
