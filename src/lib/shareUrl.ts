import type { UndergraduatePlanType } from "@/lib/loans/types";
import type { LoanState, SalaryGrowthRate } from "@/types/store";
import {
  MIN_SALARY,
  MAX_SALARY,
  MIN_MONTHLY_OVERPAYMENT,
  MAX_MONTHLY_OVERPAYMENT,
} from "@/constants";

// URL param keys
const PARAM_PLAN = "plan";
const PARAM_UG = "ug";
const PARAM_PG = "pg";
const PARAM_SAL = "sal";

// Overpay-specific param keys
const PARAM_OVP = "ovp";
const PARAM_SGR = "sgr";
const PARAM_LSP = "lsp";
const PARAM_REPY = "repy";

// Balance bounds
const MIN_BALANCE = 0;
const MAX_BALANCE = 200_000;

// Lump sum payment bounds (URL validation only)
const MIN_LUMP_SUM = 0;
const MAX_LUMP_SUM = 100_000;

// Repayment year bounds (URL validation only)
const MIN_REPAYMENT_YEAR = 2000;
const MAX_REPAYMENT_YEAR = 2050;

const VALID_PLANS: UndergraduatePlanType[] = [
  "PLAN_1",
  "PLAN_2",
  "PLAN_4",
  "PLAN_5",
];

const VALID_SALARY_GROWTH_RATES: SalaryGrowthRate[] = [
  "none",
  "conservative",
  "moderate",
  "aggressive",
];

function isValidPlan(plan: string): plan is UndergraduatePlanType {
  return VALID_PLANS.includes(plan as UndergraduatePlanType);
}

function isValidSalaryGrowthRate(rate: string): rate is SalaryGrowthRate {
  return VALID_SALARY_GROWTH_RATES.includes(rate as SalaryGrowthRate);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export interface EncodeOptions {
  includeOverpayFields?: boolean;
  repaymentYear?: number;
}

/**
 * Encodes shareable loan state fields to URL search params.
 */
export function encodeStateToParams(
  state: LoanState,
  options: EncodeOptions = {},
): URLSearchParams {
  const params = new URLSearchParams();
  params.set(PARAM_PLAN, state.underGradPlanType);
  params.set(PARAM_UG, String(state.underGradBalance));
  params.set(PARAM_PG, String(state.postGradBalance));
  params.set(PARAM_SAL, String(state.salary));

  if (options.includeOverpayFields) {
    params.set(PARAM_OVP, String(state.monthlyOverpayment));
    params.set(PARAM_SGR, state.salaryGrowthRate);
    params.set(PARAM_LSP, String(state.lumpSumPayment));
    if (options.repaymentYear !== undefined) {
      params.set(PARAM_REPY, String(options.repaymentYear));
    }
  }

  return params;
}

export interface DecodedState extends Partial<LoanState> {
  repaymentYear?: number;
}

/**
 * Decodes URL search params to partial loan state.
 * Invalid values are ignored, out-of-range values are clamped.
 */
export function decodeParamsToState(params: URLSearchParams): DecodedState {
  const result: DecodedState = {};

  const planParam = params.get(PARAM_PLAN);
  if (planParam && isValidPlan(planParam)) {
    result.underGradPlanType = planParam;
  }

  const ugParam = params.get(PARAM_UG);
  if (ugParam !== null) {
    const value = parseInt(ugParam, 10);
    if (!isNaN(value)) {
      result.underGradBalance = clamp(value, MIN_BALANCE, MAX_BALANCE);
    }
  }

  const pgParam = params.get(PARAM_PG);
  if (pgParam !== null) {
    const value = parseInt(pgParam, 10);
    if (!isNaN(value)) {
      result.postGradBalance = clamp(value, MIN_BALANCE, MAX_BALANCE);
    }
  }

  const salParam = params.get(PARAM_SAL);
  if (salParam !== null) {
    const value = parseInt(salParam, 10);
    if (!isNaN(value)) {
      result.salary = clamp(value, MIN_SALARY, MAX_SALARY);
    }
  }

  // Overpay-specific fields
  const ovpParam = params.get(PARAM_OVP);
  if (ovpParam !== null) {
    const value = parseInt(ovpParam, 10);
    if (!isNaN(value)) {
      result.monthlyOverpayment = clamp(
        value,
        MIN_MONTHLY_OVERPAYMENT,
        MAX_MONTHLY_OVERPAYMENT,
      );
    }
  }

  const sgrParam = params.get(PARAM_SGR);
  if (sgrParam !== null && isValidSalaryGrowthRate(sgrParam)) {
    result.salaryGrowthRate = sgrParam;
  }

  const lspParam = params.get(PARAM_LSP);
  if (lspParam !== null) {
    const value = parseInt(lspParam, 10);
    if (!isNaN(value)) {
      result.lumpSumPayment = clamp(value, MIN_LUMP_SUM, MAX_LUMP_SUM);
    }
  }

  const repyParam = params.get(PARAM_REPY);
  if (repyParam !== null) {
    const value = parseInt(repyParam, 10);
    if (!isNaN(value)) {
      result.repaymentYear = clamp(
        value,
        MIN_REPAYMENT_YEAR,
        MAX_REPAYMENT_YEAR,
      );
    }
  }

  return result;
}

export interface ShareUrlOptions {
  baseUrl?: string;
  repaymentYear?: number;
}

/**
 * Generates a shareable URL with loan state encoded in query params.
 * Preserves the current pathname (e.g., /overpay) when generating URLs.
 * When on /overpay, includes overpay-specific fields in the URL.
 */
export function generateShareUrl(
  state: LoanState,
  options: ShareUrlOptions = {},
): string {
  const base =
    options.baseUrl ??
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://studentloanstudy.uk");
  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  const isOverpayPage = path.startsWith("/overpay");
  const params = encodeStateToParams(state, {
    includeOverpayFields: isOverpayPage,
    repaymentYear: options.repaymentYear,
  });

  return `${base}${path}?${params.toString()}`;
}

/**
 * Generates share text with a human-readable message and URL.
 */
export function generateShareText(
  state: LoanState,
  options: ShareUrlOptions = {},
): string {
  const url = generateShareUrl(state, options);
  return `Check out my UK student loan projection: ${url}`;
}
