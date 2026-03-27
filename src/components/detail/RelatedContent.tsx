"use client";

import { ArrowRight01Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <section className="space-y-4">
      <Heading as="h2" size="section">
        Related Guides
      </Heading>
      <div className="grid gap-3 sm:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group block"
          >
            <div className="flex h-full flex-col rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-all duration-200 hover:bg-accent hover:ring-primary/30">
              <div className="mb-2 flex items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <HugeiconsIcon icon={BookOpen01Icon} className="size-4" />
                </div>
                <h3 className="text-sm font-medium">{guide.title}</h3>
              </div>
              <p className="mb-3 flex-1 text-xs text-muted-foreground">
                {guide.description}
              </p>
              <div className="flex items-center gap-1 text-xs font-medium text-primary">
                Read Guide
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
