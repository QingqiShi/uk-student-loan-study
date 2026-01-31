import type { UndergraduatePlanType } from "@/lib/loans";

export interface Preset {
  id: string;
  label: string;
  underGradBalance: number;
  postGradBalance: number;
  underGradPlanType: UndergraduatePlanType;
  repaymentYear: number;
}

export const PRESETS: Preset[] = [
  {
    id: "plan2-grad",
    label: "2012-23 Grad",
    underGradBalance: 45_000,
    postGradBalance: 0,
    underGradPlanType: "PLAN_2",
    repaymentYear: 2018,
  },
  {
    id: "plan5-grad",
    label: "2023+ Grad",
    underGradBalance: 50_000,
    postGradBalance: 0,
    underGradPlanType: "PLAN_5",
    repaymentYear: 2026,
  },
  {
    id: "plan1-legacy",
    label: "Pre-2012",
    underGradBalance: 20_000,
    postGradBalance: 0,
    underGradPlanType: "PLAN_1",
    repaymentYear: 2010,
  },
  {
    id: "ug-pg-combo",
    label: "UG+Masters",
    underGradBalance: 45_000,
    postGradBalance: 12_000,
    underGradPlanType: "PLAN_2",
    repaymentYear: 2018,
  },
];

export const DEFAULT_PRESET_ID = "plan2-grad";

/** April is when UK student loan repayments typically start (0-indexed month) */
export const REPAYMENT_START_MONTH = 3;

const defaultPreset = PRESETS.find((p) => p.id === DEFAULT_PRESET_ID);
if (!defaultPreset) {
  throw new Error(`Default preset "${DEFAULT_PRESET_ID}" not found in PRESETS`);
}
export const DEFAULT_PRESET: Preset = defaultPreset;
