import {
  AnalyticsUpIcon,
  ArrowRight01Icon,
  BookOpen01Icon,
  Calculator01Icon,
  GlobalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type { GuideEntry, GuideSlug } from "@/lib/guides";
import { GUIDES } from "@/lib/guides";

interface ExtraLink {
  href: string;
  label: string;
}

interface RelatedGuidesProps {
  current: GuideSlug;
  order: GuideSlug[];
  extraLinks?: ExtraLink[];
}

export function RelatedGuides({
  current,
  order,
  extraLinks,
}: RelatedGuidesProps) {
  const guidesBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
  const orderedGuides = order
    .filter((slug) => slug !== current)
    .map((slug) => guidesBySlug.get(slug))
    .filter((g): g is GuideEntry => g !== undefined)
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Related Guides</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {orderedGuides.map((guide) => (
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

      {extraLinks && extraLinks.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {extraLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors hover:bg-accent"
            >
              <HugeiconsIcon
                icon={GlobalIcon}
                className="size-4 text-muted-foreground"
              />
              {link.label}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </a>
          ))}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">More Tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/" className="group block">
            <div className="flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 hover:bg-accent hover:ring-1 hover:ring-primary/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <HugeiconsIcon icon={Calculator01Icon} className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium">
                  Student Loan Repayment Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  See how much you will repay in total at your salary
                </p>
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </Link>
          <Link href="/overpay" className="group block">
            <div className="flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 hover:bg-accent hover:ring-1 hover:ring-primary/30">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <HugeiconsIcon icon={AnalyticsUpIcon} className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium">Overpay Calculator</h3>
                <p className="text-xs text-muted-foreground">
                  Pay off faster or invest instead?
                </p>
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
