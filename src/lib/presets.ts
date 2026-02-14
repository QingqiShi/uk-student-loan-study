import type { Loan } from "@/lib/loans/types";

export interface Preset {
  id: string;
  label: string;
  description: string;
  loans: Loan[];
  repaymentYear: number;
}

export const PRESETS: Preset[] = [
  {
    id: "plan2-grad",
    label: "2012\u201323 Grad",
    description: "Plan 2 \u00b7 \u00a345k balance",
    loans: [{ planType: "PLAN_2", balance: 45_000 }],
    repaymentYear: 2018,
  },
  {
    id: "plan5-grad",
    label: "2023+ Grad",
    description: "Plan 5 \u00b7 \u00a350k balance",
    loans: [{ planType: "PLAN_5", balance: 50_000 }],
    repaymentYear: 2026,
  },
  {
    id: "plan1-legacy",
    label: "Pre-2012",
    description: "Plan 1 \u00b7 \u00a320k balance",
    loans: [{ planType: "PLAN_1", balance: 20_000 }],
    repaymentYear: 2010,
  },
  {
    id: "ug-pg-combo",
    label: "UG + Masters",
    description: "Plan 2 \u00b7 \u00a345k + \u00a312k postgrad",
    loans: [
      { planType: "PLAN_2", balance: 45_000 },
      { planType: "POSTGRADUATE", balance: 12_000 },
    ],
    repaymentYear: 2018,
  },
];

export const DEFAULT_PRESET_ID = "plan2-grad";

/** Returns true if the given loans exactly match any preset configuration. */
export function isPresetConfig(loans: Loan[]): boolean {
  return PRESETS.some(
    (p) =>
      p.loans.length === loans.length &&
      p.loans.every(
        (pl, i) =>
          loans[i] &&
          pl.planType === loans[i].planType &&
          pl.balance === loans[i].balance,
      ),
  );
}

/** April is when UK student loan repayments typically start (0-indexed month) */
export const REPAYMENT_START_MONTH = 3;

const defaultPreset = PRESETS.find((p) => p.id === DEFAULT_PRESET_ID);
if (!defaultPreset) {
  throw new Error(`Default preset "${DEFAULT_PRESET_ID}" not found in PRESETS`);
}
export const DEFAULT_PRESET: Preset = defaultPreset;
