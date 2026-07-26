import type { ReactNode } from "react";
import { Heading } from "@/components/typography/Heading";
import { SECTION_PAD, SHELL_GUTTER } from "@/lib/layout";

/**
 * The shared index-page section shell: a full-bleed `<section>` with the
 * hairline top seam, fluid gutter and the two-zone (masthead + content)
 * workspace grid, plus the left-rail masthead — heading over intro dek — that
 * every section below a fold repeats. Callers pass their own content grid as
 * `children`; it fills the right-hand grid cell.
 *
 * Used by every full-bleed page under {@link WideLayout} (the homepage rules /
 * levers / tools sections, the overpay bands) so the seam rhythm and the
 * 34ch masthead rail are defined in exactly one place.
 */
export function InstrumentSection({
  id,
  heading,
  intro,
  children,
}: {
  id: string;
  heading: ReactNode;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      // `id` + `scroll-mt-22` make every section a jump target that clears the
      // sticky nameplate — the fold links down to them.
      id={id}
      className={`scroll-mt-22 border-t border-border ${SHELL_GUTTER} ${SECTION_PAD} work:grid work:grid-cols-[34ch_minmax(0,1fr)] work:items-start work:gap-x-[clamp(2.4rem,3vw,4rem)] ultra:max-w-[2160px]`}
      aria-labelledby={`${id}-h`}
    >
      <div className="work:col-start-1">
        <Heading as="h2" size="section" id={`${id}-h`}>
          {heading}
        </Heading>
        <p className="mt-[0.7rem] max-w-[60ch] text-lead text-pretty text-muted-foreground">
          {intro}
        </p>
      </div>
      <div className="work:col-start-2">{children}</div>
    </section>
  );
}
