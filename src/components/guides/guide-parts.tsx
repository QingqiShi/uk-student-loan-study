import Link from "next/link";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactNode,
} from "react";
import {
  GuideContents,
  type GuideSection,
} from "@/components/guides/GuideContents";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { Panel } from "@/components/instrument/Panel";
import { WideLayout } from "@/components/layout/WideLayout";
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
import { SHELL_GUTTER } from "@/lib/layout";
import { LAST_UPDATED } from "@/lib/loans/plans";
import { cn } from "@/lib/utils";

// "Updated May 2026" — the same freshness signal the guides index and homepage
// hero carry, derived from the figure automation's LAST_UPDATED.
const UPDATED_LABEL = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
}).format(new Date(LAST_UPDATED));

/** Slugify a heading's text into a stable, URL-safe anchor id. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Flatten a heading's children (strings, numbers, interpolations) to text. */
function nodeText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement(node)) {
    return nodeText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

type SectionHeadingElement = React.ReactElement<{
  children?: ReactNode;
  id?: string;
  size?: string;
  className?: string;
}>;

const isSectionHeading = (
  el: React.ReactElement,
): el is SectionHeadingElement =>
  el.type === Heading && (el.props as { size?: string }).size === "section";

/**
 * Walk the guide body, give each section `<Heading size="section">` a stable
 * slug id (server-side, so the anchor targets and the contents rail exist in the
 * initial HTML — shareable `#section` URLs and crawlers work without JS), and
 * return the collected sections for the rail. Only real section headings are
 * picked up; the `Eyebrow`-based labels inside panels (e.g. "Key takeaways") are
 * not `<Heading>`s, so they never leak into the table of contents.
 */
function processGuideBody(children: ReactNode): {
  processed: ReactNode;
  sections: GuideSection[];
} {
  const sections: GuideSection[] = [];
  const seen = new Set<string>();

  const withId = (heading: SectionHeadingElement): React.ReactElement => {
    const label = nodeText(heading.props.children).trim();
    if (!label) return heading;
    let id = heading.props.id ?? slugify(label);
    let n = 2;
    while (seen.has(id)) {
      id = `${slugify(label)}-${String(n)}`;
      n++;
    }
    seen.add(id);
    sections.push({ id, label });
    // `scroll-mt-22` (5.5rem) clears the sticky header when the contents rail
    // jumps to this anchor — applied to exactly the headings that receive ids.
    return cloneElement(heading, {
      id,
      className: cn(heading.props.className, "scroll-mt-22"),
    });
  };

  // Recurse through structural wrappers (`<section>` and fragments) so a heading
  // nested one or more levels down is still found; feature components (charts,
  // tables, panels) hold no section headings and pass through untouched rather
  // than being cloned.
  const walk = (nodes: ReactNode): ReactNode =>
    Children.map(nodes, (child) => {
      if (!isValidElement(child)) return child;
      if (isSectionHeading(child)) return withId(child);
      const kids = (child.props as { children?: ReactNode }).children;
      if (child.type === Fragment) return walk(kids);
      if (child.type === "section")
        return cloneElement(child, undefined, walk(kids));
      return child;
    });

  return { processed: walk(children), sections };
}

/**
 * Shared building blocks for the guide (article) archetype. Every piece speaks
 * the Instrument voice — flat surfaces, hairline seams, engraved sans labels,
 * figures left to the mono face — so the ten long-form guides read as one
 * calibrated system rather than a stack of recolored Ledger cards.
 */

/**
 * The full-bleed guide workspace — the long-form counterpart to the wide
 * homepage and guides-index shells. Below the `work` breakpoint it is a single
 * centred reading column (the pre-redesign guide experience). At `work` and up
 * it opens into three zones, mirroring the guides-index "mass at both edges"
 * grammar:
 *
 *   - a sticky **contents** rail (an auto-built "On this page" table of contents
 *     plus the freshness meta) anchoring the left edge;
 *   - the **reading column** in the middle — prose held at a ~66ch measure while
 *     charts and data tables ({@link guideBreakout}) read wider;
 *   - a sticky **companion** rail (calculator CTA, related guides, tools)
 *     anchoring the right edge — the same block that stacks beneath the article
 *     on narrow screens.
 *
 * Guides pass their cross-links as `related`; the companion renders them, so a
 * guide's body no longer ends with a full-width related-guides section.
 */
export function GuideArticle({
  breadcrumbLabel,
  title,
  intro,
  related,
  children,
}: {
  breadcrumbLabel: React.ReactNode;
  title: React.ReactNode;
  intro: React.ReactNode;
  related?: React.ComponentProps<typeof RelatedGuides>;
  children: React.ReactNode;
}) {
  const { processed, sections } = processGuideBody(children);
  return (
    <WideLayout>
      <div
        className={cn(
          SHELL_GUTTER,
          "w-full py-[clamp(1.8rem,3.2vw,3rem)]",
          "work:grid work:grid-cols-[minmax(0,15rem)_minmax(0,50rem)_minmax(0,17rem)] work:content-start work:justify-center work:gap-x-[clamp(2.5rem,3.5vw,4.5rem)]",
          "ultra:grid-cols-[minmax(0,17rem)_minmax(0,62rem)_minmax(0,19rem)] ultra:gap-x-[clamp(3.5rem,4vw,6rem)]",
        )}
      >
        {/* Contents rail — sticky wayfinding, wide screens only. Capped to the
            viewport so a long list stays reachable on a short window. */}
        <aside className="hidden work:sticky work:top-22 work:block work:max-h-[calc(100dvh-7rem)] work:self-start work:overflow-y-auto">
          <GuideContents sections={sections} />
          <dl className="mt-8 space-y-1.5 border-t border-border pt-5 text-meta text-muted-foreground">
            <div className="flex items-baseline gap-1.5">
              <dt className="sr-only">Last updated</dt>
              <dd>Updated {UPDATED_LABEL}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Source</dt>
              <dd className="flex items-center gap-1.5">
                <span aria-hidden="true" className="font-bold text-primary">
                  ✓
                </span>
                GOV.UK sourced
              </dd>
            </div>
          </dl>
        </aside>

        {/* Reading column — a centred prose measure (~66ch middle track) framed
            by two flexible margin tracks. Header + body children sit in the
            content track (`*:col-start-2`); figures marked `guideBreakout`
            span all three tracks to read wider than the prose. `min-w-0` on
            every child lets a wide table or chart shrink instead of forcing
            horizontal overflow. The font-size is a fluid reading base: 16px
            through laptop widths, easing to 18px only on very wide viewports —
            because the content track is measured in `ch`, the prose column
            grows in pixels while characters-per-line stays ~66. Below the `work`
            breakpoint the tracks collapse to a single centred column with
            full-width figures, matching the pre-redesign reading experience. */}
        <article className="mx-auto grid max-w-200 min-w-0 grid-cols-[minmax(0,1fr)_min(66ch,100%)_minmax(0,1fr)] gap-y-[clamp(2.25rem,3.4vw,3.25rem)] text-[clamp(1rem,0.75rem+0.2vw,1.125rem)] *:col-start-2 *:min-w-0 work:mx-0 work:max-w-none">
          <header className="space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/" />}>
                    Home
                  </BreadcrumbLink>
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
              <p className="guide-lead text-pretty text-muted-foreground">
                {intro}
              </p>
            </div>
          </header>
          {processed}
        </article>

        {/* Companion rail — sticky beside the article on wide, the closing block
            beneath it on narrow. */}
        {related && (
          <aside className="mx-auto mt-12 w-full max-w-200 border-t border-border pt-8 work:sticky work:top-22 work:mx-0 work:mt-0 work:block work:max-h-[calc(100dvh-7rem)] work:max-w-none work:self-start work:overflow-y-auto work:border-t-0 work:pt-0">
            <RelatedGuides {...related} />
          </aside>
        )}
      </div>
    </WideLayout>
  );
}

/** Inline prose link: spruce-ink with a hairline underline that thickens on hover. */
export const guideLink =
  "font-medium text-cta underline decoration-1 underline-offset-4 transition-[text-decoration-color,color] hover:text-cta/80";

/**
 * Breakout figures (charts, wide tables) span all three tracks of the reading
 * grid to read wider than the prose that frames them. The `!` overrides the
 * grid's `*:col-start-2` default — the breakout must always win, mirroring the
 * specificity boost the old `.guide-body > .guide-breakout` rule relied on.
 * Column-relative (not viewport-relative) so figures never collide with the
 * sticky rails on the workspace grid. Apply to a direct child of the article.
 */
export const guideBreakout = "col-span-full!";

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
      <ul className="list-disc space-y-2.5 pl-5 text-muted-foreground marker:text-primary">
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
