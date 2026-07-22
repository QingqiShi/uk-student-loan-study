import Link from "next/link";
import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";
import { Panel } from "@/components/instrument/Panel";
import { PageLayout } from "@/components/layout/PageLayout";
import { Heading } from "@/components/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { currencyFormatter } from "@/constants";
import { formatGBP, formatPercent } from "@/lib/format";
import { PROSE_LINK } from "@/lib/layout";
import type { PlanPageKey } from "@/lib/planContent";
import { PLAN_PAGES } from "@/lib/planContent";
import { surfaceCard } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { AllPlansTable } from "./AllPlansTable";
import { PlanCtaCards } from "./PlanCtaCards";

interface PlanDetailPageProps {
  planKey: PlanPageKey;
}

const PROSE = "max-w-2xl space-y-3 text-muted-foreground";

/**
 * Figures-Are-Mono: keep the digit in the cell's mono/tabular container but drop
 * the trailing unit WORD to a small sans treatment (mirrors the homepage
 * `.unit`), so "years" never renders in Martian Mono.
 */
function UnitLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-sans font-medium tracking-normal text-muted-foreground"
      style={{ fontSize: "0.58em", marginLeft: "0.22em" }}
    >
      {children}
    </span>
  );
}

export function PlanDetailPage({ planKey }: PlanDetailPageProps) {
  const plan = PLAN_PAGES[planKey];

  return (
    <PageLayout>
      <article className="space-y-12">
        <header className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/plans" />}>
                  Loan Plans
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{plan.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-3">
            <Heading as="h1">What Is a {plan.name} Student Loan?</Heading>
            <p className="font-sans text-sm text-muted-foreground">
              {plan.region} &middot; {plan.years}
            </p>
            <p className="max-w-2xl text-lead text-muted-foreground">
              {plan.heroIntro}
            </p>
          </div>
        </header>

        {/* Key figures — one hairlined readout, not floating stat cards. */}
        <section aria-label={`${plan.name} key figures`}>
          <MetricReadout columns={4}>
            <MetricCell
              label="Repayment threshold"
              value={currencyFormatter.format(plan.yearlyThreshold)}
              tone="emphasis"
            >
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {formatGBP(plan.monthlyThreshold)}/mo
              </span>
            </MetricCell>
            <MetricCell
              label="Repayment rate"
              value={formatPercent(plan.repaymentRate * 100)}
            >
              <span className="text-xs text-muted-foreground">
                of income above threshold
              </span>
            </MetricCell>
            <MetricCell
              label="Interest"
              value={plan.interestCurrent}
              tone="cost"
            >
              <span className="text-xs text-muted-foreground">
                {plan.interestShort}
              </span>
            </MetricCell>
            <MetricCell
              label="Written off after"
              value={
                <>
                  {plan.writeOffYears}
                  <UnitLabel>years</UnitLabel>
                </>
              }
            />
          </MetricReadout>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            What {plan.name} means
          </Heading>
          <div className={PROSE}>
            {plan.whatItIs.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Who is on {plan.name}?
          </Heading>
          <div className={PROSE}>
            {plan.whoItIsFor.map((para) => (
              <p key={para}>{para}</p>
            ))}
            <p>
              Not sure this is you?{" "}
              <Link href="/which-plan" className={PROSE_LINK}>
                Take the 3-question which plan quiz
              </Link>{" "}
              to confirm.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            {plan.name} interest rate
          </Heading>
          <div className={PROSE}>
            {plan.interestParagraphs.map((para) => (
              <p key={para}>{para}</p>
            ))}
            {planKey === "PLAN_2" && (
              <p>
                From September 2026 the government is capping Plan 2 interest at
                6% &mdash; see our{" "}
                <Link href="/guides/interest-rate-cap" className={PROSE_LINK}>
                  Plan 2 interest rate cap guide
                </Link>{" "}
                for what changes.
              </p>
            )}
            <p>
              For a full walkthrough of how student loan interest compounds,
              read{" "}
              <Link href="/guides/how-interest-works" className={PROSE_LINK}>
                how student loan interest works
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            How {plan.name} compares to other plans
          </Heading>
          <p className="max-w-2xl text-muted-foreground">
            {plan.compareParagraph}
          </p>
          <AllPlansTable highlight={planKey} />
          <p className="max-w-2xl text-sm text-muted-foreground">
            See the full breakdown on the{" "}
            <Link href="/plans" className={PROSE_LINK}>
              UK student loan plans hub
            </Link>
            {planKey === "PLAN_2" || planKey === "PLAN_5" ? (
              <>
                {" "}
                or read the in-depth{" "}
                <Link href="/guides/plan-2-vs-plan-5" className={PROSE_LINK}>
                  Plan 2 vs Plan 5 comparison
                </Link>
              </>
            ) : null}
            .
          </p>
        </section>

        <Panel className="space-y-3" padding>
          <Heading as="h2" size="subsection">
            Why middle earners feel {plan.name} the most
          </Heading>
          <p className="max-w-2xl text-muted-foreground">{plan.middleEarner}</p>
          <p className="max-w-2xl text-muted-foreground">
            Middle earners repay the most across every UK plan &mdash; enough to
            make real repayments, but not enough to pay off the balance before
            interest bites. Put your own salary into the{" "}
            <Link href="/" className={PROSE_LINK}>
              student loan repayment calculator
            </Link>{" "}
            to see exactly where you fall.
          </p>
        </Panel>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            {plan.name} FAQs
          </Heading>
          <dl
            className={cn(
              surfaceCard,
              "divide-y divide-border overflow-hidden",
            )}
          >
            {plan.faqs.map((faq) => (
              <div key={faq.question} className="space-y-1.5 p-4 sm:p-5">
                <dt className="font-sans font-semibold text-foreground">
                  {faq.question}
                </dt>
                <dd className="max-w-2xl text-muted-foreground">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Work out your {plan.name} repayments
          </Heading>
          <PlanCtaCards />
        </section>
      </article>
    </PageLayout>
  );
}
