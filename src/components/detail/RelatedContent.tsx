"use client";

import { usePathname } from "next/navigation";
import { LinkIndex, LinkIndexRow } from "@/components/instrument/LinkIndex";
import { Heading } from "@/components/typography/Heading";
import type { GuideEntry, GuideSlug } from "@/lib/guides";
import { GUIDES } from "@/lib/guides";

const RELATED_GUIDES: Partial<Record<string, GuideSlug[]>> = {
  "/repaid": ["threshold-freeze", "plan-2-vs-plan-5"],
  "/balance": ["threshold-freeze", "plan-2-vs-plan-5"],
  "/interest": ["how-interest-works", "rpi-vs-cpi"],
  "/effective-rate": ["rpi-vs-cpi", "student-loan-vs-mortgage"],
  "/overpay": ["pay-upfront-or-take-loan", "how-interest-works"],
};

export function RelatedContent() {
  const pathname = usePathname();
  const guideSlugs = RELATED_GUIDES[pathname];
  if (!guideSlugs) return null;

  const guidesBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
  const guides = guideSlugs
    .map((slug) => guidesBySlug.get(slug))
    .filter((g): g is GuideEntry => g !== undefined);

  if (guides.length === 0) return null;

  return (
    <section
      className="space-y-4 border-t border-border pt-10"
      aria-labelledby="related-guides-h"
    >
      <Heading as="h2" size="section" id="related-guides-h">
        Related guides
      </Heading>
      <LinkIndex>
        {guides.map((guide) => (
          <LinkIndexRow
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            title={guide.title}
            description={guide.description}
          />
        ))}
      </LinkIndex>
    </section>
  );
}
