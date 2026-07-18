import Link from "next/link";
import { Panel } from "@/components/instrument/Panel";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Heading } from "@/components/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/**
 * Shared building blocks for the guide (article) archetype. Every piece speaks
 * the Instrument voice — flat surfaces, hairline seams, engraved sans labels,
 * figures left to the mono face — so the ten long-form guides read as one
 * calibrated system rather than a stack of recolored Ledger cards.
 */

/** Reading column for an editorial guide — a single centred ~70ch measure. */
export const readingColumn = "mx-auto max-w-2xl";

/**
 * The shared guide masthead + reading column. Renders the centred reading
 * measure, the Home › Guides › [current] breadcrumb, the page-hero heading and
 * its lead paragraph, then the guide body — so every long-form guide opens with
 * the same calibrated header instead of re-inlining ~25 lines of markup.
 */
export function GuideArticle({
  breadcrumbLabel,
  title,
  intro,
  children,
}: {
  breadcrumbLabel: React.ReactNode;
  title: React.ReactNode;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className={cn(readingColumn, "space-y-12")}>
      <header className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/guides" />}>
                Guides
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumbLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-3">
          <Heading as="h1" size="page-hero">
            {title}
          </Heading>
          <p className="text-lead text-pretty text-muted-foreground">{intro}</p>
        </div>
      </header>
      {children}
    </article>
  );
}

/** Inline prose link: spruce-ink with a hairline underline that thickens on hover. */
export const guideLink =
  "font-medium text-cta underline decoration-1 underline-offset-4 transition-[text-decoration-color,color] hover:text-cta/80";

/* Spec-sheet table cell treatments — engraved sans headers, mono figures. */
/** Engraved sans header cell (text column). */
export const specHead = "text-xs font-semibold tracking-wider uppercase";
/** Engraved sans header cell aligned over a figure column. */
export const specHeadNum =
  "text-right text-xs font-semibold tracking-wider uppercase";
/** Body figure cell: mono, tabular, right-aligned, ink. */
export const specNum = "text-right font-mono tabular-nums text-foreground";

/**
 * Key-takeaways summary. A single flat panel with an engraved label and a
 * hairline-marked list — replaces the old sunk-fill callout box.
 */
export function KeyTakeaways({ children }: { children: React.ReactNode }) {
  return (
    <Panel className="space-y-4">
      <Eyebrow as="h2" marker={false}>
        Key takeaways
      </Eyebrow>
      <ul className="list-disc space-y-2.5 pl-5 text-sm text-muted-foreground marker:text-primary sm:text-base">
        {children}
      </ul>
    </Panel>
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

/** A numbered sequence: a flat panel of hairline-separated steps. */
export function StepList({ children }: { children: React.ReactNode }) {
  return (
    <Panel padding={false} className="divide-y divide-border">
      {children}
    </Panel>
  );
}

/** One step of a {@link StepList}: a mono spruce index beside the copy. */
export function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 p-4 sm:p-5">
      <span
        aria-hidden="true"
        className="font-mono text-sm font-semibold text-primary tabular-nums"
      >
        {String(index).padStart(2, "0")}
      </span>
      <div className="space-y-0.5">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
