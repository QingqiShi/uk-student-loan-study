"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { InstrumentSection } from "@/components/instrument/InstrumentSection";
import { LinkIndex, LinkIndexRow } from "@/components/instrument/LinkIndex";
import type { GuideEntry, GuideSlug } from "@/lib/guides";
import { GUIDES } from "@/lib/guides";

const RELATED_GUIDES: Partial<Record<string, GuideSlug[]>> = {
  "/repaid": ["threshold-freeze", "plan-2-vs-plan-5"],
  "/balance": ["threshold-freeze", "plan-2-vs-plan-5"],
  "/interest": ["how-interest-works", "rpi-vs-cpi"],
  "/effective-rate": ["rpi-vs-cpi", "student-loan-vs-mortgage"],
  "/overpay": ["pay-upfront-or-take-loan", "how-interest-works"],
};

/**
 * The guides related to the current route, resolved to full entries. Returns an
 * empty array when the route has no mapping — callers render nothing.
 */
function useRelatedGuides(): GuideEntry[] {
  const pathname = usePathname();
  const guideSlugs = RELATED_GUIDES[pathname];
  if (!guideSlugs) return [];

  const guidesBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
  return guideSlugs
    .map((slug) => guidesBySlug.get(slug))
    .filter((g): g is GuideEntry => g !== undefined);
}

/** A bare index of the current route's related guides, without a heading. */
function RelatedGuideIndex() {
  const guides = useRelatedGuides();
  if (guides.length === 0) return null;

  return (
    <LinkIndex columns={2}>
      {guides.map((guide) => (
        <LinkIndexRow
          key={guide.slug}
          href={`/guides/${guide.slug}`}
          title={guide.title}
          description={guide.description}
        />
      ))}
    </LinkIndex>
  );
}

/**
 * The related-guides band below a fold. Renders nothing at all when the route
 * has no guides mapped — masthead included, so retiring a guide can never leave
 * a seamed band headed "Related guides" with nothing under it.
 */
export function RelatedGuidesSection({ intro }: { intro: ReactNode }) {
  const guides = useRelatedGuides();
  if (guides.length === 0) return null;

  return (
    <InstrumentSection
      id="related-guides"
      heading="Related guides"
      intro={intro}
    >
      {/* Two guides, so past `work` they sit side by side rather than stacking
          into a 70ch column with the rest of an ultra-wide cell left blank.
          Each column still holds a title and a dek at a readable measure; what
          changes is that the band's width goes to a second row of content
          instead of to margin. */}
      <div className="mt-[clamp(0.6rem,1.4vw,1.4rem)] max-w-[70ch] work:mt-0 work:max-w-none">
        <RelatedGuideIndex />
      </div>
    </InstrumentSection>
  );
}
