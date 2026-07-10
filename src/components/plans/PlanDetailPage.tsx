import Link from "next/link";
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
import type { PlanPageKey } from "@/lib/planContent";
import { PLAN_PAGES } from "@/lib/planContent";
import { AllPlansTable } from "./AllPlansTable";
import { PlanCtaCards } from "./PlanCtaCards";

interface StatItem {
  label: string;
  value: string;
  sub?: string;
}

interface PlanDetailPageProps {
  planKey: PlanPageKey;
}

const LINK_CLASS =
  "text-primary underline underline-offset-4 hover:text-primary/80";

export function PlanDetailPage({ planKey }: PlanDetailPageProps) {
  const plan = PLAN_PAGES[planKey];

  const stats: StatItem[] = [
    { label: "Who", value: plan.region, sub: plan.years },
    {
      label: "Repayment threshold",
      value: `${currencyFormatter.format(plan.yearlyThreshold)}/yr`,
      sub: `${formatGBP(plan.monthlyThreshold)}/mo`,
    },
    {
      label: "Repayment rate",
      value: formatPercent(plan.repaymentRate * 100),
      sub: "of income above threshold",
    },
    {
      label: "Interest",
      value: plan.interestShort,
      sub: `${plan.interestCurrent} now`,
    },
    {
      label: "Written off after",
      value: `${String(plan.writeOffYears)} years`,
    },
  ];

  return (
    <PageLayout>
      <article className="space-y-8">
        <div className="space-y-4">
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

          <div className="space-y-2">
            <Heading as="h1">What Is a {plan.name} Student Loan?</Heading>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              {plan.heroIntro}
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            {plan.name} at a Glance
          </Heading>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-4">
                <dt className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-semibold">{stat.value}</dd>
                {stat.sub && (
                  <dd className="text-sm text-muted-foreground">{stat.sub}</dd>
                )}
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            What {plan.name} means
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            {plan.whatItIs.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Who is on {plan.name}?
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            {plan.whoItIsFor.map((para) => (
              <p key={para}>{para}</p>
            ))}
            <p>
              Not sure this is you?{" "}
              <Link href="/which-plan" className={LINK_CLASS}>
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
          <div className="space-y-2 text-muted-foreground">
            {plan.interestParagraphs.map((para) => (
              <p key={para}>{para}</p>
            ))}
            {planKey === "PLAN_2" && (
              <p>
                From September 2026 the government is capping Plan 2 interest at
                6% &mdash; see our{" "}
                <Link href="/guides/interest-rate-cap" className={LINK_CLASS}>
                  Plan 2 interest rate cap guide
                </Link>{" "}
                for what changes.
              </p>
            )}
            <p>
              For a full walkthrough of how student loan interest compounds,
              read{" "}
              <Link href="/guides/how-interest-works" className={LINK_CLASS}>
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
          <p className="text-muted-foreground">{plan.compareParagraph}</p>
          <AllPlansTable highlight={planKey} />
          <p className="text-sm text-muted-foreground">
            See the full breakdown on the{" "}
            <Link href="/plans" className={LINK_CLASS}>
              UK student loan plans hub
            </Link>
            {planKey === "PLAN_2" || planKey === "PLAN_5" ? (
              <>
                {" "}
                or read the in-depth{" "}
                <Link href="/guides/plan-2-vs-plan-5" className={LINK_CLASS}>
                  Plan 2 vs Plan 5 comparison
                </Link>
              </>
            ) : null}
            .
          </p>
        </section>

        <section className="space-y-3 rounded-lg border bg-muted/30 p-4 sm:p-6">
          <Heading as="h2" size="subsection">
            Why middle earners feel {plan.name} the most
          </Heading>
          <p className="text-muted-foreground">{plan.middleEarner}</p>
          <p className="text-muted-foreground">
            Middle earners repay the most across every UK plan &mdash; enough to
            make real repayments, but not enough to clear the balance before
            interest bites. Put your own salary into the{" "}
            <Link href="/" className={LINK_CLASS}>
              student loan repayment calculator
            </Link>{" "}
            to see exactly where you fall.
          </p>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            {plan.name} FAQs
          </Heading>
          <dl className="space-y-4">
            {plan.faqs.map((faq) => (
              <div key={faq.question} className="space-y-1">
                <dt className="font-medium">{faq.question}</dt>
                <dd className="text-muted-foreground">{faq.answer}</dd>
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
