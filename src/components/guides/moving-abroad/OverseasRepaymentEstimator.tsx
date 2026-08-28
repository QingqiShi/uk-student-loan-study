"use client";

import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useId, useState } from "react";
import { NumericFormat } from "react-number-format";
import { CustomInput } from "@/components/home/CurrencyInput";
import {
  metricValueClass,
  type MetricTone,
} from "@/components/instrument/MetricReadout";
import { Panel, PanelHeader } from "@/components/instrument/Panel";
import { Figure } from "@/components/typography/Figure";
import { Label } from "@/components/ui/label";
import { MAX_SALARY, MIN_SALARY } from "@/constants";
import {
  formatExchangeRate,
  formatGBP,
  formatGBPPence,
  formatMultiplier,
  formatPercent,
} from "@/lib/format";
import {
  estimateOverseasRepayment,
  fromGBP,
  getTerritory,
  requireTerritory,
  toGBP,
  usesSterling,
  type OverseasRepaymentEstimate,
} from "@/lib/loans/overseas";
import {
  OVERSEAS_SOURCE_URLS,
  OVERSEAS_TAX_YEAR,
  OVERSEAS_TERRITORIES,
  type OverseasTerritory,
} from "@/lib/loans/overseasThresholds";
import {
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
} from "@/lib/loans/plans";
import type { PlanType } from "@/lib/loans/types";
import { PRESETS } from "@/lib/presets";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  guideLink,
  SeamCell,
  SeamGrid,
  segmentToggle,
} from "../guide-primitives";

const PLAN_LABELS: Record<PlanType, string> = {
  PLAN_1: PLAN_DISPLAY_INFO.PLAN_1.name,
  PLAN_2: PLAN_DISPLAY_INFO.PLAN_2.name,
  PLAN_4: PLAN_DISPLAY_INFO.PLAN_4.name,
  PLAN_5: PLAN_DISPLAY_INFO.PLAN_5.name,
  POSTGRADUATE: POSTGRADUATE_DISPLAY_INFO.name,
};

/** The chip order, matching PLAN_PAGE_ORDER in src/lib/planContent.ts. */
const PLAN_ORDER: PlanType[] = [
  "PLAN_1",
  "PLAN_2",
  "PLAN_4",
  "PLAN_5",
  "POSTGRADUATE",
];

/**
 * The calculator needs a balance to model and the guide cannot know the
 * reader's, so the link hands over the plan's preset balance.
 */
function presetBalance(plan: PlanType): number {
  return (
    PRESETS.flatMap((preset) => preset.loans).find(
      (loan) => loan.planType === plan,
    )?.balance ?? 45_000
  );
}

const TYPICAL_BALANCE: Record<PlanType, number> = {
  PLAN_1: presetBalance("PLAN_1"),
  PLAN_2: presetBalance("PLAN_2"),
  PLAN_4: presetBalance("PLAN_4"),
  PLAN_5: presetBalance("PLAN_5"),
  POSTGRADUATE: presetBalance("POSTGRADUATE"),
};

const DEFAULT_TERRITORY = requireTerritory("Australia");
const DEFAULT_INCOME_GBP = 40_000;

/**
 * A `<select>` cannot render through `<Input>` — base-ui's input takes no
 * `render` prop — so it carries Input's own classes. Keep in step with
 * src/components/ui/input.tsx.
 */
const SELECT_CLASS = cn(
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  "h-9 appearance-none pr-9",
);

function calculatorHref(plan: PlanType, incomeGBP: number): string {
  const salary = Math.min(
    MAX_SALARY,
    Math.max(MIN_SALARY, Math.round(incomeGBP)),
  );
  return `/?loans=${plan}:${String(TYPICAL_BALANCE[plan])}&sal=${String(salary)}`;
}

function ThresholdNote({ estimate }: { estimate: OverseasRepaymentEstimate }) {
  if (estimate.band.multiplier === 1) {
    return <>the same as the UK&rsquo;s {formatGBP(estimate.ukThreshold)}</>;
  }
  return (
    <>
      {formatMultiplier(estimate.band.multiplier)} the UK&rsquo;s{" "}
      {formatGBP(estimate.ukThreshold)}
    </>
  );
}

function RepaymentNote({ estimate }: { estimate: OverseasRepaymentEstimate }) {
  const { monthlyRepayment, ukMonthlyRepayment, territory } = estimate;
  if (monthlyRepayment === 0) {
    return (
      <>
        Your income is below {territory.name}&rsquo;s threshold. Update your
        details and SLC can defer repayments for 12 months.
      </>
    );
  }
  const delta = monthlyRepayment - ukMonthlyRepayment;
  return (
    <>
      {formatPercent(estimate.repaymentRate * 100)} of the{" "}
      {formatGBP(Math.round(estimate.incomeAboveThreshold))} above your
      threshold &mdash; {formatGBP(Math.round(estimate.annualRepayment))} a
      year, rounded down to whole pounds each month.{" "}
      {delta === 0 ? (
        <span className="font-medium text-foreground">
          The same as in the UK.
        </span>
      ) : (
        <span
          className={cn(
            "font-mono font-semibold tabular-nums",
            delta > 0 ? "text-signal" : "text-cta",
          )}
        >
          {delta > 0 ? "+" : "−"}
          {formatGBP(Math.abs(delta))}
          <span className="font-sans font-medium"> a month vs the UK</span>
        </span>
      )}
    </>
  );
}

function FixedNote({ estimate }: { estimate: OverseasRepaymentEstimate }) {
  const { fixedMonthlyRepayment, monthlyRepayment, plan } = estimate;
  const delta = fixedMonthlyRepayment - monthlyRepayment;
  let comparison: string;
  if (monthlyRepayment === 0) {
    comparison = "a month, whatever your income";
  } else if (delta === 0) {
    comparison = "a month — the same as your income-based figure";
  } else if (delta > 0) {
    comparison = `a month — ${formatGBPPence(delta)} more than your income-based figure`;
  } else {
    comparison = `a month — ${formatGBPPence(-delta)} less than your income-based figure`;
  }
  // Only Plan 2 interest tracks income, so only Plan 2 has a highest rate.
  const interest =
    plan === "PLAN_2" ? ", plus interest at the highest rate" : "";
  return (
    <>
      {comparison}
      {interest}. It still reduces your balance, but unpaid months become
      arrears.
    </>
  );
}

function interestReadout(estimate: OverseasRepaymentEstimate): {
  figure: string;
  note: React.ReactNode;
} {
  const { plan, band, territory } = estimate;
  switch (plan) {
    case "PLAN_2":
      return {
        figure: `RPI + ${(estimate.plan2InterestAboveRpi ?? 0).toFixed(1)}%`,
        note: (
          <>
            Based on the income you give SLC, against {territory.name}&rsquo;s
            interest thresholds of {formatGBP(estimate.threshold)} to{" "}
            {formatGBP(band.plan2UpperThreshold)}: RPI at the lower, RPI + 3% at
            the upper. The{" "}
            <Link href="/guides/interest-rate-cap" className={guideLink}>
              Plan 2 interest cap
            </Link>{" "}
            still applies.
          </>
        ),
      };
    case "PLAN_1":
    case "PLAN_4":
      return {
        figure: "RPI",
        note: "Or the BoE base rate + 1% if that is lower — the same rule as in the UK.",
      };
    case "PLAN_5":
      return {
        figure: "RPI",
        note: "Plan 5 interest is RPI only, in the UK or abroad.",
      };
    case "POSTGRADUATE":
      return {
        figure: "RPI + 3%",
        note: "Postgraduate interest is RPI + 3% wherever you live.",
      };
  }
}

export function OverseasRepaymentEstimator() {
  const id = useId();
  const destinationId = `${id}-destination`;
  const planLabelId = `${id}-plan-label`;
  const salaryId = `${id}-salary`;
  const currencyLabelId = `${id}-currency-label`;

  const [territory, setTerritory] =
    useState<OverseasTerritory>(DEFAULT_TERRITORY);
  const [plan, setPlan] = useState<PlanType>("PLAN_2");
  const [incomeGBP, setIncomeGBP] = useState<number | "">(DEFAULT_INCOME_GBP);
  const [showLocal, setShowLocal] = useState(false);

  const sterling = usesSterling(territory);
  const localCurrency = showLocal && !sterling;
  const income = incomeGBP === "" ? 0 : incomeGBP;
  const displayedIncome =
    incomeGBP === ""
      ? ""
      : Math.round(localCurrency ? fromGBP(incomeGBP, territory) : incomeGBP);

  const estimate = estimateOverseasRepayment({
    plan,
    territory,
    annualIncomeGBP: income,
  });
  const interest = interestReadout(estimate);

  const readouts: {
    eyebrow: string;
    figure: string;
    tone?: MetricTone;
    note: React.ReactNode;
  }[] = [
    {
      eyebrow: `Your repayment threshold in ${territory.name}`,
      figure: formatGBP(estimate.threshold),
      note: <ThresholdNote estimate={estimate} />,
    },
    {
      eyebrow: "Monthly repayment",
      figure: formatGBP(estimate.monthlyRepayment),
      note: <RepaymentNote estimate={estimate} />,
    },
    {
      eyebrow: "If you don't update your details",
      figure: formatGBPPence(estimate.fixedMonthlyRepayment),
      tone: "cost",
      note: <FixedNote estimate={estimate} />,
    },
    {
      eyebrow: "Interest while abroad",
      figure: interest.figure,
      note: interest.note,
    },
  ];

  return (
    <Panel data-slot="overseas-estimator" className="space-y-5">
      <PanelHeader
        caption={`Fig. 1 — Overseas repayment estimator · ${OVERSEAS_TAX_YEAR} SLC thresholds`}
        figure={`Band ${estimate.band.id} · ${formatMultiplier(estimate.band.multiplier)}`}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={destinationId}>Destination</Label>
          <div className="relative">
            <select
              id={destinationId}
              value={territory.name}
              onChange={(event) => {
                const next = getTerritory(event.target.value);
                if (next) setTerritory(next);
              }}
              className={SELECT_CLASS}
            >
              {OVERSEAS_TERRITORIES.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <span
            id={planLabelId}
            className="flex items-center text-sm leading-none font-medium"
          >
            Plan
          </span>
          <div
            role="group"
            aria-labelledby={planLabelId}
            className="flex flex-wrap gap-1"
          >
            {PLAN_ORDER.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={plan === option}
                onClick={() => {
                  setPlan(option);
                }}
                className={segmentToggle(plan === option)}
              >
                {PLAN_LABELS[option]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Label htmlFor={salaryId}>Annual salary</Label>
            <div className="relative">
              {!localCurrency && (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                >
                  £
                </span>
              )}
              <NumericFormat
                id={salaryId}
                value={displayedIncome}
                onValueChange={(values, sourceInfo) => {
                  // Only user input carries an event. A prop-driven re-format
                  // must not round-trip the GBP figure through the local
                  // currency and drift it.
                  if (sourceInfo.event === undefined) return;
                  if (values.floatValue === undefined) {
                    setIncomeGBP("");
                    return;
                  }
                  setIncomeGBP(
                    localCurrency
                      ? toGBP(values.floatValue, territory)
                      : values.floatValue,
                  );
                }}
                customInput={CustomInput}
                className={cn(
                  "h-9 font-mono tabular-nums",
                  !localCurrency && "pl-7",
                )}
                decimalScale={0}
                thousandSeparator
                allowNegative={false}
                inputMode="numeric"
              />
            </div>
          </div>
          {!sterling && (
            <div className="space-y-2">
              <span
                id={currencyLabelId}
                className="flex items-center text-sm leading-none font-medium"
              >
                Currency
              </span>
              <div
                role="group"
                aria-labelledby={currencyLabelId}
                className="flex flex-wrap gap-1"
              >
                <button
                  type="button"
                  aria-pressed={!localCurrency}
                  onClick={() => {
                    setShowLocal(false);
                  }}
                  className={segmentToggle(!localCurrency)}
                >
                  GBP
                </button>
                <button
                  type="button"
                  aria-pressed={localCurrency}
                  onClick={() => {
                    setShowLocal(true);
                  }}
                  className={segmentToggle(localCurrency)}
                >
                  {territory.currency}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div aria-live="polite" data-slot="overseas-estimator-readout">
        <SeamGrid columns={2}>
          {readouts.map((readout) => (
            <SeamCell key={readout.eyebrow} eyebrow={readout.eyebrow}>
              <p className={metricValueClass(readout.tone)}>
                <Figure value={readout.figure} />
              </p>
              <p className="mt-2">{readout.note}</p>
            </SeamCell>
          ))}
        </SeamGrid>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="space-y-1">
          <p>
            {sterling ? (
              <>
                SLC uses a rate of 1 for {territory.name}, so no conversion
                applies.
              </>
            ) : (
              <>
                SLC uses HMRC&rsquo;s annual average rate: 1{" "}
                {territory.currency} ={" "}
                <span className="font-mono text-foreground tabular-nums">
                  {formatExchangeRate(territory.exchangeRateToGBP)}
                </span>
                {localCurrency && (
                  <>
                    {" "}
                    &mdash; your salary is{" "}
                    <span className="font-mono text-foreground tabular-nums">
                      {formatGBP(Math.round(income))}
                    </span>
                  </>
                )}
                .
              </>
            )}
          </p>
          <p>
            <ExternalLink href={OVERSEAS_SOURCE_URLS[plan]}>
              GOV.UK: {PLAN_LABELS[plan]} overseas thresholds,{" "}
              {OVERSEAS_TAX_YEAR}
            </ExternalLink>
          </p>
        </div>
        <Link
          href={calculatorHref(plan, income)}
          className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-foreground no-underline transition-colors hover:text-cta"
        >
          Model the rest of your loan at this salary
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            aria-hidden="true"
            className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </Panel>
  );
}
