import Link from "next/link";
import { WideLayout } from "@/components/layout/WideLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GUIDES } from "@/lib/guides";
import { SHELL_GUTTER } from "@/lib/layout";
import { LAST_UPDATED } from "@/lib/loans/plans";

// "Updated May 2026" — derived from the automation's LAST_UPDATED so the guides
// masthead carries the same freshness signal as the homepage hero.
const UPDATED_LABEL = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
}).format(new Date(LAST_UPDATED));

// Aggregate the honest topic taxonomy into counts for the orientation rail's
// "by topic" ledger — derived from the data (unique topics in first-appearance
// order) so it self-maintains as guides are added and never drifts from GUIDES.
const TOPIC_SUMMARY = [...new Set(GUIDES.map((guide) => guide.topic))].map(
  (label) => ({
    label,
    count: GUIDES.filter((guide) => guide.topic === label).length,
  }),
);

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "UK Student Loan Guides",
  description:
    "In-depth guides to help you understand UK student loan repayment, interest, and how it fits into your wider finances.",
  numberOfItems: GUIDES.length,
  itemListElement: GUIDES.map((guide, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: guide.title,
    url: `https://studentloanstudy.uk/guides/${guide.slug}`,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://studentloanstudy.uk",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Guides",
      item: "https://studentloanstudy.uk/guides",
    },
  ],
};

export default function GuidesPage() {
  return (
    <WideLayout>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* Three-zone workspace (the same grammar the homepage Fold uses:
          36ch masthead + content + a right-anchored companion): masthead rail,
          a bounded single-column index, and a right-anchored orientation rail.
          index is capped so it never over-stretches, and the leftover width
          becomes a ruled central aisle between two anchored blocks — mass at
          both edges instead of a one-sided void on wide screens. */}
      <section
        className={`${SHELL_GUTTER} pt-[clamp(1.8rem,3.2vw,3rem)] pb-[clamp(2.6rem,5vw,5.5rem)] work:grid work:grid-cols-[34ch_minmax(0,1fr)_minmax(0,68ch)_minmax(0,44ch)] work:items-stretch work:gap-x-[clamp(2.4rem,3vw,4rem)] ultra:max-w-[2160px] ultra:grid-cols-[38ch_minmax(0,1fr)_minmax(0,74ch)_minmax(0,48ch)]`}
        aria-labelledby="guides-h"
      >
        <div className="work:col-start-1 work:flex work:flex-col">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Guides</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Heading
            as="h1"
            size="page-hero"
            id="guides-h"
            className="mt-5 mb-4 max-w-[18ch]"
          >
            Student loan guides
          </Heading>
          <p className="mb-[1.1rem] max-w-[46ch] text-lead text-pretty text-muted-foreground">
            In-depth guides to the questions graduates actually ask — how
            repayment, interest, and write-off work, and how the loan fits into
            your wider finances.
          </p>
          <p className="flex flex-wrap items-center gap-x-[0.65rem] gap-y-[0.4rem] pt-6 font-sans text-meta text-muted-foreground work:mt-auto">
            <span className="font-bold text-primary">✓</span> Independent{" "}
            <span className="text-faint">·</span> GOV.UK sourced{" "}
            <span className="text-faint">·</span> Updated {UPDATED_LABEL}
          </p>
        </div>

        {/* Index ledger: one column, scanned top to bottom, at every width —
            never split into parallel columns. On large screens it is bounded
            and given a full-height hairline right wall (work:border-r) so its
            arrows square to the dek and the wall defines the central aisle. */}
        <div className="mt-[clamp(1.8rem,3.2vw,2.8rem)] work:col-start-3 work:mt-0 work:border-r work:border-border work:pr-[clamp(1.5rem,2vw,2.25rem)]">
          {GUIDES.map((guide) => {
            const isNew =
              guide.newUntil != null && new Date() < new Date(guide.newUntil);
            return (
              <Link
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[clamp(1.25rem,3vw,3.5rem)] border-b border-border py-[clamp(1.1rem,1.9vw,1.9rem)] no-underline"
                href={`/guides/${guide.slug}`}
                key={guide.slug}
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="text-index font-semibold tracking-[-0.011em] transition-colors duration-150 ease-[ease] group-hover:text-primary">
                      {guide.title}
                    </span>
                    {isNew && (
                      <span className="rounded-full bg-accent-wash px-2 py-0.5 text-xs font-semibold tracking-wide text-cta uppercase">
                        New
                      </span>
                    )}
                  </span>
                  <span className="mt-[0.45rem] block max-w-[64ch] text-body text-pretty text-muted-foreground">
                    {guide.description}
                  </span>
                </span>
                <span
                  className="text-lead text-primary transition-transform duration-150 ease-[ease] group-hover:translate-x-[3px]"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            );
          })}
        </div>

        {/* Orientation rail (third zone): a right-anchored companion —
            the anchor the homepage gets from its Readout, which this page
            lacked. Wayfinding into the calculator plus a mono "by topic" ledger
            give the far-right edge real, quiet mass. Below `work` it collapses
            to a full-width closing strip. It holds no guides — the index stays
            one column — so removing it leaves the list unchanged. */}
        <aside className="mt-[clamp(2rem,4vw,3rem)] border-t border-border pt-[clamp(1.5rem,3vw,2rem)] work:col-start-4 work:mt-0 work:border-t-0 work:pt-0">
          {/* Bracketed like the masthead — wayfinding at the top, the "by topic"
              reference at the foot — so on large screens both outer columns
              frame the index top-and-bottom instead of emptying out below a
              short top-anchored block. */}
          <div className="work:ml-auto work:flex work:h-full work:max-w-[42ch] work:flex-col work:justify-between ultra:max-w-[46ch]">
            <div>
              <p className="font-sans text-xs font-semibold tracking-label text-muted-foreground uppercase">
                Where to start
              </p>
              <p className="mt-3 text-body text-pretty text-muted-foreground">
                These guides unpack the figures the calculator produces — the
                interest, the frozen thresholds, and the 2026 rule changes that
                set what you actually repay.
              </p>
              <Link
                href="/"
                className="group mt-4 inline-flex items-baseline gap-1.5 text-cta no-underline"
              >
                <span className="text-body font-medium">
                  Open the calculator
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-150 ease-[ease] group-hover:translate-x-[3px]"
                >
                  →
                </span>
              </Link>
            </div>

            <div className="mt-[clamp(1.8rem,3vw,2.5rem)] work:mt-0">
              <div className="border-t border-border pt-[clamp(1.1rem,1.8vw,1.5rem)]">
                <p className="font-sans text-xs font-semibold tracking-label text-muted-foreground uppercase">
                  By topic
                </p>
                <dl className="mt-3 space-y-2">
                  {TOPIC_SUMMARY.map(({ label, count }) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-4 border-b border-border pb-2 last:border-b-0 last:pb-0"
                    >
                      <dt className="text-meta text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="font-mono text-fig-sm text-foreground tabular-nums">
                        {count}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="mt-[clamp(1.1rem,1.8vw,1.5rem)] flex items-baseline gap-x-2 border-t border-border pt-3 text-meta text-faint">
                <span className="font-mono text-fig-sm text-foreground tabular-nums">
                  {GUIDES.length}
                </span>{" "}
                guides · GOV.UK sourced
              </p>
            </div>
          </div>
        </aside>
      </section>
    </WideLayout>
  );
}
