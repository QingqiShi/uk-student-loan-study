import {
  useBoeBaseRate,
  useCurrentSalary,
  useLoanConfig,
  usePlan2ThresholdSchedule,
  useRpiRate,
  useSalaryGrowthRate,
  useThresholdGrowthRate,
} from "@/hooks/useStoreSelectors";
import { formatGBP } from "@/lib/format";
import { simulate } from "@/lib/loans/engine";
import type { SimulationConfig } from "@/lib/loans/types";
import { primaryPlanName } from "./planInfo";

// Scenario parameters (the deltas themselves are always engine-computed from the
// user's CURRENT selection — never hardcoded — so they track the GOV.UK data).
const MONTHLY_OVERPAY = 100;
const RAISE = 15_000;
const BREAK_START_MONTH = 60; // ~5 years into repayment
const BREAK_MONTHS = 12; // a one-year break

interface LeverDatum {
  name: string;
  description: string;
  /** null → qualitative lever (no computed figure) */
  delta: string | null;
  direction: "down" | "up" | null;
  barPct: number | null;
  /** optional deep-link to the tool that models this lever in full */
  href?: string;
  cta?: string;
}

interface LeverData {
  /** e.g. "£45,000 · Plan 2" — the current selection the deltas are measured against */
  refLabel: string;
  levers: LeverDatum[];
}

function deltaText(delta: number): string {
  if (Math.abs(delta) < 1) return formatGBP(0);
  const sign = delta < 0 ? "−" : "+";
  return `${sign}${formatGBP(Math.abs(delta))}`;
}

/**
 * "What changes your total" — recomputed live for whatever the reader has
 * selected in the fold above (salary, plan, balance, assumptions). Each lever
 * runs the same engine as the calculator with one variable changed, so the
 * figure and its direction (saves = down/spruce, costs = up/brick) are real for
 * the current case, not an illustration of a fixed £45k example.
 */
export function useLeverData(): LeverData {
  const { loans } = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();
  const plan2ThresholdSchedule = usePlan2ThresholdSchedule();
  const rpiRate = useRpiRate();
  const boeBaseRate = useBoeBaseRate();

  const base: SimulationConfig = {
    loans,
    annualSalary: salary,
    salaryGrowthRate,
    thresholdGrowthRate,
    plan2ThresholdSchedule,
    rpiRate,
    boeBaseRate,
  };

  const ref = simulate(base).summary;
  const overpay = simulate({
    ...base,
    monthlyOverpayment: MONTHLY_OVERPAY,
  }).summary;
  const raise = simulate({ ...base, annualSalary: salary + RAISE }).summary;
  const career = simulate({
    ...base,
    careerBreak: { startMonth: BREAK_START_MONTH, months: BREAK_MONTHS },
  }).summary;

  const overpayDelta = Math.round(overpay.totalPaid - ref.totalPaid);
  const raiseDelta = Math.round(raise.totalPaid - ref.totalPaid);
  const careerDelta = Math.round(career.totalPaid - ref.totalPaid);

  const maxAbs = Math.max(
    Math.abs(overpayDelta),
    Math.abs(raiseDelta),
    Math.abs(careerDelta),
    1,
  );
  const barPct = (d: number): number =>
    Math.round((Math.abs(d) / maxAbs) * 100);
  // A delta that rounds to £0 has no direction — render it without the
  // spruce/brick tone or the proportion bar (LeversSection gates both on
  // `direction`), and pair it with the "no change" copy branch below.
  const dir = (d: number): "down" | "up" | null =>
    d === 0 ? null : d < 0 ? "down" : "up";

  const yearsEarly = Math.max(
    0,
    Math.round((ref.monthsToPayoff - overpay.monthsToPayoff) / 12),
  );

  const levers: LeverDatum[] = [
    {
      name: `Overpay ${formatGBP(MONTHLY_OVERPAY)} a month`,
      description:
        overpayDelta === 0
          ? `For this case, overpaying ${formatGBP(MONTHLY_OVERPAY)} a month wouldn't change your lifetime total.`
          : yearsEarly > 0
            ? `Voluntary payments clear the balance about ${String(yearsEarly)} year${yearsEarly === 1 ? "" : "s"} early and cut off the interest that would otherwise keep rolling up.`
            : `Voluntary payments chip the balance down faster and cut off interest before it compounds further.`,
      delta: deltaText(overpayDelta),
      direction: dir(overpayDelta),
      barPct: barPct(overpayDelta),
      href: "/overpay",
      cta: "Open the overpayment calculator",
    },
    {
      name: `Earn ${formatGBP(RAISE)} more a year`,
      description:
        raiseDelta === 0
          ? `For this case, earning ${formatGBP(RAISE)} more a year wouldn't change your lifetime total.`
          : raiseDelta < 0
            ? `A higher salary clears the loan before the write-off, so you pay less overall — not more.`
            : `A higher salary means larger repayments in the years before write-off, so the lifetime total rises.`,
      delta: deltaText(raiseDelta),
      direction: dir(raiseDelta),
      barPct: barPct(raiseDelta),
    },
    {
      name: "Take a one-year career break",
      description:
        careerDelta === 0
          ? `For this case, a one-year career break wouldn't change your lifetime total.`
          : careerDelta > 0
            ? `A year at little or no income pauses repayments, so more interest rolls into the years that follow — nudging the total up.`
            : `A year at little or no income pauses repayments; with the balance written off anyway, you simply repay less over the term.`,
      delta: deltaText(careerDelta),
      direction: dir(careerDelta),
      barPct: barPct(careerDelta),
    },
  ];

  return {
    refLabel: `${formatGBP(salary)} · ${primaryPlanName(loans)}`,
    levers,
  };
}
