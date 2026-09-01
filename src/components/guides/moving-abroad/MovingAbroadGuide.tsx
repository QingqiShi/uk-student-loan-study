import {
  AirplaneTakeOff01Icon,
  AlertCircleIcon,
  CancelCircleIcon,
  CoinsPoundIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Panel } from "@/components/instrument/Panel";
import { Heading } from "@/components/typography/Heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  formatGBP,
  formatGBPPence,
  formatMultiplier,
  formatPercent,
} from "@/lib/format";
import { OVERSEAS_TAX_YEAR } from "@/lib/loans/overseasThresholds";
import { PLAN_CONFIGS } from "@/lib/loans/plans";
import {
  GuideArticle,
  guideBreakout,
  KeyTakeaways,
  Step,
  StepList,
} from "../guide-parts";
import {
  ExternalLink,
  guideLink,
  SeamCell,
  SeamGrid,
} from "../guide-primitives";
import { BandLadderTable } from "./BandLadderTable";
import { FeaturedDestinationsTable } from "./FeaturedDestinationsTable";
import {
  bandCount,
  ESTIMATOR_ANCHOR_ID,
  featured,
  govUkArrearsGuidanceLink,
  govUkHowYouRepayLink,
  govUkOverseasThresholdsLink,
  govUkUpdateEmploymentDetailsLink,
  highestBand,
  lowestBand,
  movingAbroadFaqs,
  SLC_ARREARS_PHONE,
  territoriesBelowSpain,
} from "./overseas-data";
import { OverseasRepaymentEstimator } from "./OverseasRepaymentEstimator";

const undergradRate = formatPercent(PLAN_CONFIGS.PLAN_2.repaymentRate * 100);
const postgradRate = formatPercent(
  PLAN_CONFIGS.POSTGRADUATE.repaymentRate * 100,
);

export function MovingAbroadGuide() {
  return (
    <GuideArticle
      breadcrumbLabel="Moving Abroad"
      title="What happens to your student loan if you move abroad?"
      intro={
        <>
          Moving overseas doesn&rsquo;t make your student loan disappear. The
          Student Loans Company (SLC) continues to collect repayments regardless
          of where you live. The repayment rules are the same as in the UK, but
          the threshold you repay above is set per country, and you pay SLC
          directly instead of through your employer.
        </>
      }
      related={{
        current: "moving-abroad",
        order: ["self-employment", "plan-2-vs-plan-5"],
        tools: ["/repaid", "/"],
        extraLinks: [
          {
            href: govUkHowYouRepayLink,
            label: "GOV.UK: How to repay (leaving the UK)",
          },
          {
            href: govUkUpdateEmploymentDetailsLink,
            label: "GOV.UK: Update your employment details",
          },
          {
            href: govUkOverseasThresholdsLink,
            label: "GOV.UK: Overseas thresholds for Plan 2",
          },
        ],
      }}
    >
      <section className="space-y-4">
        <Heading as="h2" size="section">
          At a glance
        </Heading>
        <SeamGrid columns={2}>
          <SeamCell
            icon={
              <HugeiconsIcon
                icon={CancelCircleIcon}
                className="size-5 text-primary"
              />
            }
            title="Is it wiped?"
          >
            No. Your balance is only written off at the end of your plan&rsquo;s
            term (25 to 40 years), and write-off may not apply if you&rsquo;re
            in breach of your repayment obligations.
          </SeamCell>
          <SeamCell
            icon={
              <HugeiconsIcon
                icon={AirplaneTakeOff01Icon}
                className="size-5 text-primary"
              />
            }
            title="When to tell SLC"
          >
            Before you leave, if you&rsquo;ll be outside the UK for more than 3
            months, even if you won&rsquo;t be earning. The Republic of Ireland
            counts as overseas.
          </SeamCell>
          <SeamCell
            icon={
              <HugeiconsIcon
                icon={CoinsPoundIcon}
                className="size-5 text-primary"
              />
            }
            title="What you repay"
          >
            {undergradRate} of income above your country&rsquo;s threshold (
            {postgradRate} for a Postgraduate loan), paid directly to SLC each
            month and rounded down to whole pounds.
          </SeamCell>
          <SeamCell
            icon={
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="size-5 text-signal"
              />
            }
            title="If you don't respond"
          >
            A fixed monthly amount for your country:{" "}
            {formatGBPPence(featured.australia.plan2FixedMonthly)} in Australia,{" "}
            {formatGBPPence(featured.spain.plan2FixedMonthly)} in Spain for Plan
            2. On a Plan 2 loan, interest also goes to the highest rate.
          </SeamCell>
        </SeamGrid>
      </section>

      <section className="space-y-4">
        <Heading as="h2" size="section">
          You must tell SLC before you leave
        </Heading>
        <p className="text-muted-foreground">
          If you&rsquo;ll be outside the UK for more than 3 months, for work,
          travel or any other reason, you must tell SLC before you go. The duty
          is triggered by the length of the absence, not by whether you&rsquo;ll
          be earning, and the Republic of Ireland counts as overseas. Under 3
          months away you don&rsquo;t need to tell SLC before you go: you stay a
          UK taxpayer, and repayments carry on through PAYE if you&rsquo;re
          employed or Self Assessment if you&rsquo;re self-employed.
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <ExternalLink href={govUkUpdateEmploymentDetailsLink}>
              Update your employment details online
            </ExternalLink>
            . The service tells you exactly what SLC needs, and you can record
            that you&rsquo;re unemployed.
          </li>
          <li>
            Give evidence of your income: usually your last three months&rsquo;
            payslips, or proof such as a recent bank statement if you&rsquo;re
            not earning.
          </li>
          <li>
            SLC then sets a repayment schedule in pounds sterling for up to 12
            months, or defers repayments for 12 months if you&rsquo;re under
            your country&rsquo;s threshold.
          </li>
          <li>
            Update your details every year. SLC reassesses your income annually,
            and you must tell it if your income changes in between.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <Heading as="h2" size="section" id={ESTIMATOR_ANCHOR_ID}>
          Estimate your repayments in any country
        </Heading>
        <p className="text-pretty text-muted-foreground">
          Pick a destination, your plan and your salary. The estimator applies
          SLC&rsquo;s {OVERSEAS_TAX_YEAR} threshold for that country, converts
          at the HMRC rate SLC uses, and shows what you&rsquo;d repay each month
          next to the UK figure, plus what SLC charges instead if you
          don&rsquo;t update your details.
        </p>
      </section>

      <div className={guideBreakout}>
        <OverseasRepaymentEstimator />
      </div>

      <section className="space-y-4">
        <Heading as="h2" size="section">
          Country-by-country: how your threshold changes
        </Heading>
        <p className="text-muted-foreground">
          SLC doesn&rsquo;t use a single overseas threshold. Every territory is
          placed into one of {String(bandCount)} bands, from{" "}
          {formatMultiplier(lowestBand.multiplier)} to{" "}
          {formatMultiplier(highestBand.multiplier)} the UK threshold, using the
          World Bank&rsquo;s Price Level Index, a measure of local costs such as
          food, housing and transport. The bands are reset every 6 April, so
          your repayments can change even if your income hasn&rsquo;t. Middle
          earners abroad feel this most: in a lower-band country, a mid-range
          income that would barely trigger repayments at home pulls a much
          bigger slice into the {undergradRate} repayment band.
        </p>
        <p className="text-muted-foreground">
          The process is the same wherever you go: tell SLC before you leave,
          give details of your gross income (usually your last three
          months&rsquo; payslips), which SLC converts into pounds sterling, and
          update your details every year. Only the threshold changes by country.
          Skip the update and SLC charges the fixed monthly repayment for your
          country, which may be higher than an income-based amount.
        </p>
      </section>

      <div className={guideBreakout}>
        <BandLadderTable />
      </div>

      <div className={guideBreakout}>
        <FeaturedDestinationsTable />
      </div>

      <div className="space-y-4">
        <p className="text-xs text-muted-foreground sm:text-sm">
          Figures are SLC&rsquo;s overseas thresholds for {OVERSEAS_TAX_YEAR},
          set against the UK Plan 2 threshold of{" "}
          {formatGBP(featured.uk.plan2Threshold)}. The band letters are ours;
          GOV.UK lists one row per territory. Every plan has its own table, and
          SLC revises every country each 6 April, so always{" "}
          <ExternalLink href={govUkOverseasThresholdsLink}>
            check the latest figures on GOV.UK
          </ExternalLink>
          .
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Australia, Canada &amp; New Zealand:
            </strong>{" "}
            sit in the same band as the UK (
            {formatMultiplier(featured.australia.multiplier)}), so the threshold
            is identical to the home figure:{" "}
            {formatGBP(featured.australia.plan2Threshold)} for Plan 2. The
            difference is mechanical: you pay SLC directly each month on a
            schedule built from your payslips, converted at HMRC&rsquo;s annual
            average exchange rate.
          </li>
          <li>
            <strong className="text-foreground">Spain &amp; the UAE:</strong>{" "}
            both sit at {formatMultiplier(featured.spain.multiplier)}, band{" "}
            {featured.spain.territory.band} of {String(bandCount)}, which is{" "}
            {formatGBP(featured.spain.plan2Threshold)} for Plan 2. Repayments
            start{" "}
            {formatGBP(
              featured.uk.plan2Threshold - featured.spain.plan2Threshold,
            )}{" "}
            of income earlier than at home. Dubai&rsquo;s lack of local income
            tax makes no difference: your UK student loan is separate from local
            tax, so a tax-free income is caught sooner, not exempted.
          </li>
          <li>
            <strong className="text-foreground">United States:</strong>{" "}
            {formatMultiplier(featured.usa.multiplier)} (
            {formatGBP(featured.usa.plan2Threshold)} for Plan 2) lifts the
            threshold above the UK&rsquo;s, so you keep more of your income
            before repayments begin. Only Bermuda and the Cayman Islands sit
            higher, at {formatMultiplier(highestBand.multiplier)}.
          </li>
          <li>
            <strong className="text-foreground">The lowest bands:</strong>{" "}
            {String(territoriesBelowSpain)} territories sit below Spain&rsquo;s
            band, down to {formatMultiplier(lowestBand.multiplier)} (
            {formatGBP(lowestBand.plan2Threshold)}) in countries such as India,
            Pakistan and Nigeria, where even a modest local income converted to
            pounds can clear the threshold.
          </li>
        </ul>
      </div>

      <section className="space-y-4">
        <Heading as="h2" size="section">
          How SLC works out your income
        </Heading>
        <p className="text-muted-foreground">
          SLC assesses your gross annual income in pounds sterling. If
          you&rsquo;re paid monthly it takes your last three months&rsquo;
          payslips, averages them and multiplies by 12 (12 weekly or 6
          fortnightly payslips work the same way). Regular bonuses, overtime and
          commission are inside that average; one-off payments are added
          afterwards; superannuation isn&rsquo;t counted.
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Exchange rate:</strong>{" "}
            HMRC&rsquo;s average rate for the most recent calendar year,
            reviewed every 6 April. It doesn&rsquo;t follow month-to-month
            movements, so a currency swing changes nothing until the next April.
          </li>
          <li>
            <strong className="text-foreground">Fees:</strong> you repay in
            pounds, and you bear any currency-conversion and bank-transfer costs
            yourself.
          </li>
          <li>
            <strong className="text-foreground">Schedule:</strong> an
            income-based schedule runs for up to 12 months, then SLC reassesses.
            Tell SLC if your income rises or falls in between, so your
            repayments are reassessed.
          </li>
          <li>
            <strong className="text-foreground">UK-taxed income:</strong> income
            already collected through PAYE or Self Assessment is disregarded, so
            you&rsquo;re not assessed twice on the same money.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <Heading as="h2" size="section">
          Interest while you&rsquo;re abroad
        </Heading>
        <p className="text-muted-foreground">
          For Plan 2, the interest rate is set from the income you give in your
          overseas assessment, using your country&rsquo;s lower and upper
          interest thresholds, and applies for the length of that assessment.
          The{" "}
          <Link href="/guides/how-interest-works" className={guideLink}>
            sliding scale
          </Link>{" "}
          is the same shape as at home (RPI at the lower threshold, RPI + 3% at
          the upper), but the thresholds move with the band: Spain&rsquo;s run
          from {formatGBP(featured.spain.plan2Threshold)} to{" "}
          {formatGBP(featured.spain.plan2UpperThreshold)}, the United
          States&rsquo; from {formatGBP(featured.usa.plan2Threshold)} to{" "}
          {formatGBP(featured.usa.plan2UpperThreshold)}, against{" "}
          {formatGBP(featured.uk.plan2Threshold)} to{" "}
          {formatGBP(featured.uk.plan2UpperThreshold)} in the UK. The{" "}
          <Link href="/guides/interest-rate-cap" className={guideLink}>
            Plan 2 interest cap
          </Link>{" "}
          still applies.
        </p>
        <p className="text-muted-foreground">
          If you don&rsquo;t keep your employment details up to date, Plan 2
          interest goes to the highest rate, RPI + 3%, whatever your income, for
          as long as your details are out of date. Plan 1, Plan 4, Plan 5 and
          Postgraduate interest rates are not income-based, so an overseas
          assessment does not change them.
        </p>
      </section>

      <section className="space-y-4">
        <Alert className="border-signal/30 bg-signal-wash text-signal">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
          <AlertTitle>What if you don&rsquo;t update your details?</AlertTitle>
          <AlertDescription className="text-signal">
            <p>
              SLC doesn&rsquo;t stop collecting. It charges the fixed monthly
              repayment for your country instead of an income-based figure. For
              Plan 2 in {OVERSEAS_TAX_YEAR} that is{" "}
              {formatGBPPence(featured.spain.plan2FixedMonthly)} in Spain and
              the UAE, {formatGBPPence(featured.australia.plan2FixedMonthly)} in
              Australia, Canada and New Zealand, and{" "}
              {formatGBPPence(featured.usa.plan2FixedMonthly)} in the United
              States.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 marker:text-signal">
              <li>
                The fixed amount may be higher than an income-based repayment,
                because it is set from twice the median graduate salary rather
                than from your income.
              </li>
              <li>
                It is not an additional charge: every pound paid still reduces
                your balance. But every month you don&rsquo;t pay it becomes{" "}
                <ExternalLink href={govUkArrearsGuidanceLink}>
                  arrears
                </ExternalLink>
                .
              </li>
              <li>
                Plan 2 interest moves to the highest rate, RPI + 3%, for as long
                as your details are out of date.
              </li>
              <li>
                SLC can charge a penalty, demand the whole loan plus interest
                and penalties in one lump sum, and add the cost of tracing you
                and recovering the debt to your loan.
              </li>
              <li>
                SLC can take court action to recover the debt. A court order is
                enforced as a civil debt in the UK and abroad, and you bear the
                legal costs.
              </li>
            </ul>
          </AlertDescription>
        </Alert>
        <p className="text-muted-foreground">
          <strong className="text-foreground">
            Student loans do not appear on credit reports or affect your credit
            score
          </strong>
          . GOV.UK says so in plain words, and that stays true abroad. Only a
          court judgment obtained after legal action could reach your credit
          file.
        </p>
      </section>

      <section className="space-y-4">
        <Heading as="h2" size="section">
          Returning to the UK
        </Heading>
        <p className="text-muted-foreground">
          Update your employment details as soon as you&rsquo;re back after more
          than 3 months away. If you don&rsquo;t, SLC keeps charging you at the
          rate for the country you&rsquo;ve left, which can mean paying more
          than you need to, or a higher interest rate. Once you&rsquo;re in UK
          employment, PAYE deductions restart on top.
        </p>
        <Panel>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground marker:text-primary">
            <li>
              PAYE deductions do not clear overseas arrears. Arrange any arrears
              separately with SLC&rsquo;s arrears line on{" "}
              <span className="font-mono text-foreground tabular-nums">
                {SLC_ARREARS_PHONE}
              </span>
              .
            </li>
            <li>
              Short visits home of under 3 months don&rsquo;t change your
              overseas status: your overseas schedule carries on.
            </li>
            <li>
              Interest reverts to the standard UK calculation from the date you
              return.
            </li>
          </ul>
        </Panel>
      </section>

      <section className="space-y-4">
        <Heading as="h2" size="section">
          Practical steps before you move
        </Heading>
        <p className="text-muted-foreground">
          If you&rsquo;re planning to move abroad, take these steps to stay on
          top of your loan.
        </p>
        <StepList>
          <Step index={1} title="Tell SLC before you leave">
            If you&rsquo;ll be away for more than 3 months, even if you
            won&rsquo;t be earning. The Republic of Ireland counts as overseas.
          </Step>
          <Step index={2} title="Update your employment details online">
            Give the evidence the service asks for (usually three months&rsquo;
            payslips, or a bank statement if you&rsquo;re not earning) so SLC
            sets an income-based schedule or defers your repayments for 12
            months.
          </Step>
          <Step index={3} title="Check your country's threshold">
            Use the{" "}
            <a href={`#${ESTIMATOR_ANCHOR_ID}`} className={guideLink}>
              estimator above
            </a>{" "}
            or the GOV.UK table for your plan, so you know what to expect before
            the first schedule arrives.
          </Step>
          <Step index={4} title="Set up a way to pay">
            A Direct Debit or an international debit card through your online
            account, or an international bank transfer quoting your customer
            reference number. You bear conversion and bank fees.
          </Step>
          <Step index={5} title="Keep records">
            Payslips, the evidence you sent, and every SLC letter and payment
            confirmation.
          </Step>
          <Step index={6} title="Set an annual reminder">
            SLC reassesses your income every year and any schedule lasts at most
            12 months. Tell SLC sooner if your income changes.
          </Step>
        </StepList>
      </section>

      <section className="space-y-4">
        <Heading as="h2" size="section">
          Moving abroad: frequently asked questions
        </Heading>
        <Panel
          padding={false}
          className="divide-y divide-border overflow-hidden"
        >
          {movingAbroadFaqs.map((faq) => (
            <div key={faq.question} className="space-y-2 p-4 sm:p-5">
              <p className="font-semibold text-foreground">{faq.question}</p>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </Panel>
      </section>

      <KeyTakeaways>
        <li>
          Moving abroad does not cancel or pause your student loan. Write-off
          still comes only at the end of your plan&rsquo;s term, and may not
          apply if you&rsquo;re in breach.
        </li>
        <li>
          Tell SLC before you leave for more than 3 months, and update your
          employment details every year, even if you&rsquo;re not earning.
        </li>
        <li>
          Your threshold depends on your country: {String(bandCount)} bands from{" "}
          {formatMultiplier(lowestBand.multiplier)} to{" "}
          {formatMultiplier(highestBand.multiplier)} the UK figure, reset every
          6 April.
        </li>
        <li>
          If you don&rsquo;t update your details, SLC charges your
          country&rsquo;s fixed monthly repayment, applies the highest interest
          rate to a Plan 2 loan, and can demand the whole loan.
        </li>
        <li>
          Student loans don&rsquo;t appear on credit reports or affect your
          credit score, abroad or at home.
        </li>
        <li>
          Before you move, check your remaining balance and repayment timeline
          with the{" "}
          <Link href="/" className={guideLink}>
            repayment calculator
          </Link>
          .
        </li>
      </KeyTakeaways>
    </GuideArticle>
  );
}
