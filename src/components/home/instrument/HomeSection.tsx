import type { ReactNode } from "react";
import { Heading } from "@/components/typography/Heading";
import { SHELL_GUTTER } from "@/lib/layout";

/**
 * The shared homepage section shell: a full-bleed `<section>` with the hairline
 * top seam, fluid gutter and the two-zone (masthead + content) workspace grid,
 * plus the left-rail masthead — heading over intro dek — that every homepage
 * section repeats. Callers pass their own content grid as `children`; it fills
 * the right-hand grid cell.
 */
export function HomeSection({
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
      className={`border-t border-border ${SHELL_GUTTER} py-[clamp(2.6rem,5vw,5.5rem)] work:grid work:grid-cols-[34ch_minmax(0,1fr)] work:items-start work:gap-x-[clamp(2.4rem,3vw,4rem)] ultra:max-w-[2160px]`}
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
