import {
  AlertCircleIcon,
  Globe02Icon,
  CoinsPoundIcon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollFadeWrapper } from "@/components/shared/ScrollFadeWrapper";
import { Heading } from "@/components/typography/Heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatGBP } from "@/lib/format";
import { PLAN_CONFIGS } from "@/lib/loans/plans";
import {
  govUkOverseasThresholdsLink,
  movingAbroadFaqs,
  overseasComparisonLabel,
  overseasThresholds,
  UK_PLAN2_THRESHOLD,
} from "./overseas-data";

const undergradRate = `${String(PLAN_CONFIGS.PLAN_2.repaymentRate * 100)}%`;
const postgradRate = `${String(PLAN_CONFIGS.POSTGRADUATE.repaymentRate * 100)}%`;

const govUkAbroadLink =
  "https://www.gov.uk/repaying-your-student-loan/repaying-from-abroad";

const linkClasses =
  "text-primary underline-offset-2 hover:underline font-medium";

export function MovingAbroadGuide() {
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
                <BreadcrumbLink render={<Link href="/guides" />}>
                  Guides
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Moving Abroad</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-2">
            <Heading as="h1">
              What Happens to Your Student Loan If You Move Abroad?
            </Heading>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Moving overseas doesn&rsquo;t make your student loan disappear.
              The Student Loans Company (SLC) continues to collect repayments
              regardless of where you live, and the rules for how much you pay
              change when you leave the UK.
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            You Must Notify SLC
          </Heading>
          <p className="text-sm text-muted-foreground sm:text-base">
            If you&rsquo;re planning to leave the UK for more than three months,
            you are legally required to inform SLC. This applies whether
            you&rsquo;re moving for work, travel, or any other reason.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
            <li>
              Notify SLC <strong>within three months</strong> of moving abroad
            </li>
            <li>Provide your new overseas address and contact details</li>
            <li>
              Submit evidence of your income through the{" "}
              <a
                href={govUkAbroadLink}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                overseas income assessment form
              </a>
            </li>
            <li>
              Continue providing income evidence annually to keep your
              repayments accurate
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            How Repayments Work Abroad
          </Heading>
          <p className="text-sm text-muted-foreground sm:text-base">
            When you live in the UK, repayments are automatically deducted from
            your salary through PAYE. Abroad, the system works differently.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10">
              <div className="mb-2 flex size-9 items-center justify-center rounded-full bg-primary/10">
                <HugeiconsIcon
                  icon={Globe02Icon}
                  className="size-5 text-primary"
                />
              </div>
              <p className="font-medium">Country Thresholds</p>
              <p className="mt-1 text-sm text-muted-foreground">
                SLC sets{" "}
                <a
                  href={govUkAbroadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  country-specific repayment thresholds
                </a>{" "}
                based on local cost of living — they may be higher or lower than
                the UK threshold.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10">
              <div className="mb-2 flex size-9 items-center justify-center rounded-full bg-primary/10">
                <HugeiconsIcon
                  icon={CoinsPoundIcon}
                  className="size-5 text-primary"
                />
              </div>
              <p className="font-medium">Repayment Rates</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You still repay {undergradRate} of income above the threshold
                for undergraduate loans ({postgradRate} for Postgraduate Loans).
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10">
              <div className="mb-2 flex size-9 items-center justify-center rounded-full bg-primary/10">
                <HugeiconsIcon
                  icon={CreditCardIcon}
                  className="size-5 text-primary"
                />
              </div>
              <p className="font-medium">Direct Payments to SLC</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Repayments are made directly to SLC rather than through your
                employer.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Country-by-Country: How Your Threshold Changes
          </Heading>
          <p className="text-sm text-muted-foreground sm:text-base">
            SLC doesn&rsquo;t use a single overseas threshold for everyone.
            Every country is placed into a price-level band that multiplies the
            UK threshold up or down based on local living costs, so the salary
            at which you start repaying can sit below or above the UK&rsquo;s{" "}
            {formatGBP(UK_PLAN2_THRESHOLD)}. This is where{" "}
            <strong>middle earners abroad feel it most</strong> &mdash; in a
            lower-threshold country, a mid-range salary that would barely
            trigger repayments at home can pull a much bigger slice into the{" "}
            {undergradRate} repayment band.
          </p>
          <p className="text-sm text-muted-foreground sm:text-base">
            The process is the same wherever you go: notify SLC within three
            months, complete the overseas income assessment on your worldwide
            income (converted into pounds), and re-submit evidence every year.
            Only the threshold changes by country. Skip the assessment and SLC
            falls back to fixed repayment amounts that are usually higher than
            income-based ones.
          </p>
          <ScrollFadeWrapper className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Destination</TableHead>
                  <TableHead scope="col">Plan 2 threshold (2026/27)</TableHead>
                  <TableHead scope="col">Compared to the UK</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overseasThresholds.map((row) => (
                  <TableRow key={row.country}>
                    <TableHead scope="row">{row.country}</TableHead>
                    <TableCell>{formatGBP(row.threshold)}</TableCell>
                    <TableCell>
                      {overseasComparisonLabel(row.threshold)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollFadeWrapper>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Figures are SLC&rsquo;s Plan 2 (undergraduate) overseas thresholds
            for 2026/27, set against the UK threshold of{" "}
            {formatGBP(UK_PLAN2_THRESHOLD)}. Other plans use a different base
            figure, and SLC revises every country each April &mdash; always{" "}
            <a
              href={govUkOverseasThresholdsLink}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              check the latest figures on GOV.UK
            </a>
            .
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
            <li>
              <strong className="text-foreground">
                Australia, Canada &amp; New Zealand:
              </strong>{" "}
              currently sit in the same band as the UK, so your threshold
              matches the home figure and repayments feel much like they did in
              the UK.
            </li>
            <li>
              <strong className="text-foreground">Spain:</strong> a lower band
              pulls the threshold below the UK&rsquo;s, so repayments start
              earlier &mdash; a classic squeeze on middle earners.
            </li>
            <li>
              <strong className="text-foreground">UAE (Dubai):</strong> there is
              no local income tax, but your UK student loan is separate from
              that &mdash; the SLC threshold is still lower than the UK&rsquo;s,
              so a tax-free salary is caught sooner, not exempted.
            </li>
            <li>
              <strong className="text-foreground">United States:</strong> a
              higher band lifts the threshold above the UK&rsquo;s, so you keep
              more of your salary before repayments begin.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
            <AlertTitle>
              What If You Don&rsquo;t Provide Income Evidence?
            </AlertTitle>
            <AlertDescription>
              <p>
                If you fail to complete the overseas income assessment, SLC
                doesn&rsquo;t simply stop collecting. Instead, they apply{" "}
                <strong>fixed repayment amounts</strong> that are not based on
                your actual earnings.
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  Fixed amounts can be <strong>significantly higher</strong>{" "}
                  than what you would pay based on your real income
                </li>
                <li>
                  This effectively acts as a penalty for not engaging with the
                  process
                </li>
                <li>
                  You can avoid this by submitting your income evidence on time
                  each year
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Consequences of Non-Compliance
          </Heading>
          <div className="rounded-lg border-l-4 border-destructive bg-card p-4 ring-1 ring-foreground/10 sm:p-5">
            <p className="mb-3 text-sm text-muted-foreground sm:text-base">
              Ignoring your student loan obligations while abroad can have
              serious consequences. SLC has several enforcement mechanisms
              available.
            </p>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
              <li>
                SLC can take <strong>legal action</strong> to recover the debt
              </li>
              <li>
                Your debt may be passed to <strong>collection agencies</strong>
              </li>
              <li>
                If you return to the UK, missed payments could{" "}
                <strong>affect your credit record</strong>
              </li>
              <li>
                Additional <strong>penalties and interest</strong> may be
                applied to your balance
              </li>
              <li>
                HMRC can resume automatic deductions from your salary if you
                return to UK employment
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Practical Steps Before You Move
          </Heading>
          <p className="text-sm text-muted-foreground sm:text-base">
            If you&rsquo;re planning to move abroad, take these steps to stay on
            top of your loan.
          </p>
          <div className="space-y-0 divide-y rounded-lg border bg-card ring-1 ring-foreground/10">
            {[
              {
                title: "Notify SLC",
                description:
                  "Inform SLC of your move and new address as early as possible.",
              },
              {
                title: "Complete the overseas income assessment",
                description:
                  "Submit the form to ensure your repayments are based on your actual income.",
              },
              {
                title: "Check your country\u2019s threshold",
                description:
                  "Look up the SLC website so you know what to expect for your destination.",
              },
              {
                title: "Set up a payment method",
                description:
                  "Arrange a way to make direct repayments to SLC from abroad.",
              },
              {
                title: "Keep records",
                description:
                  "Save all correspondence and payment confirmations with SLC.",
              },
              {
                title: "Set annual reminders",
                description:
                  "Resubmit income evidence before the deadline each year.",
              },
            ].map((step, i) => (
              <div key={step.title} className="flex gap-4 p-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Moving Abroad: Frequently Asked Questions
          </Heading>
          <div className="space-y-3">
            {movingAbroadFaqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
              >
                <p className="font-medium text-foreground">{faq.question}</p>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-lg border bg-muted/30 p-4 sm:p-6">
          <Heading as="h2" size="subsection">
            Key Takeaways
          </Heading>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
            <li>
              Moving abroad does <strong>not</strong> cancel or pause your
              student loan repayments.
            </li>
            <li>
              You must notify SLC within three months and provide annual income
              evidence.
            </li>
            <li>
              Repayment thresholds vary by country based on local cost of
              living.
            </li>
            <li>
              Failing to engage with SLC results in fixed repayment amounts that
              are typically higher than income-based payments.
            </li>
            <li>
              Non-compliance can lead to legal action, collection agencies, and
              credit impacts if you return to the UK.
            </li>
            <li>
              Before you move, check your remaining balance and repayment
              timeline with the{" "}
              <Link
                href="/"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                repayment calculator
              </Link>
              .
            </li>
          </ul>
        </section>

        <RelatedGuides
          current="moving-abroad"
          order={["self-employment", "plan-2-vs-plan-5"]}
          extraLinks={[
            {
              href: "https://www.gov.uk/repaying-your-student-loan/repaying-from-abroad",
              label: "GOV.UK: Repaying from Abroad",
            },
          ]}
        />
      </article>
    </PageLayout>
  );
}
