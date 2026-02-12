import type { Loan, PlanType } from "@/lib/loans/types";
import type { LoanState } from "@/types/store";
import {
  MIN_SALARY,
  MAX_SALARY,
  MIN_MONTHLY_OVERPAYMENT,
  MAX_MONTHLY_OVERPAYMENT,
} from "@/constants";

// URL param keys — new format
const PARAM_LOANS = "loans";
const PARAM_SAL = "sal";

// Legacy URL param keys (for backward-compatible decoding)
const PARAM_PLAN = "plan";
const PARAM_UG = "ug";
const PARAM_PG = "pg";

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

// Legacy mapping for old string presets to numeric values
const LEGACY_SALARY_GROWTH_MAPPING: Record<string, number> = {
  none: 0,
  conservative: 0.02,
  moderate: 0.04,
  aggressive: 0.06,
};

const VALID_PLANS: PlanType[] = [
  "PLAN_1",
  "PLAN_2",
  "PLAN_4",
  "PLAN_5",
  "POSTGRADUATE",
];

function isValidPlan(plan: string): plan is PlanType {
  return VALID_PLANS.includes(plan as PlanType);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Encodes a loans array to the URL-safe format: "PLAN_2:45000,POSTGRADUATE:12000"
 */
function encodeLoans(loans: Loan[]): string {
  return loans.map((l) => `${l.planType}:${String(l.balance)}`).join(",");
}

/**
 * Decodes the URL loans param back to a Loan[].
 * Returns undefined if the param is invalid.
 */
function decodeLoans(loansParam: string): Loan[] | undefined {
  const pairs = loansParam.split(",");
  const loans: Loan[] = [];

  for (const pair of pairs) {
    const [planType, balanceStr] = pair.split(":");
    if (!planType || !balanceStr || !isValidPlan(planType)) return undefined;
    const balance = parseInt(balanceStr, 10);
    if (isNaN(balance)) return undefined;
    loans.push({
      planType,
      balance: clamp(balance, MIN_BALANCE, MAX_BALANCE),
    });
  }

  return loans.length > 0 ? loans : undefined;
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
  params.set(PARAM_LOANS, encodeLoans(state.loans));
  params.set(PARAM_SAL, String(state.salary));

  if (options.includeOverpayFields) {
    params.set(PARAM_OVP, String(state.monthlyOverpayment));
    params.set(PARAM_SGR, String(state.salaryGrowthRate));
    params.set(PARAM_LSP, String(state.lumpSumPayment));
    if (options.repaymentYear !== undefined) {
      params.set(PARAM_REPY, String(options.repaymentYear));
    }
  }

  return params;
}

export interface DecodedState {
  loans?: Loan[];
  salary?: number;
  monthlyOverpayment?: number;
  salaryGrowthRate?: number;
  lumpSumPayment?: number;
  thresholdGrowthRate?: number;
  repaymentYear?: number;
}

/**
 * Decodes URL search params to partial loan state.
 * Supports both new `loans` param format and legacy `plan`/`ug`/`pg` format.
 * Invalid values are ignored, out-of-range values are clamped.
 */
export function decodeParamsToState(params: URLSearchParams): DecodedState {
  const result: DecodedState = {};

  // Try new format first
  const loansParam = params.get(PARAM_LOANS);
  if (loansParam) {
    const loans = decodeLoans(loansParam);
    if (loans) {
      result.loans = loans;
    }
  }

  // Fall back to legacy format if no `loans` param
  if (!result.loans) {
    const planParam = params.get(PARAM_PLAN);
    const ugParam = params.get(PARAM_UG);
    const pgParam = params.get(PARAM_PG);

    if (planParam || ugParam !== null || pgParam !== null) {
      const loans: Loan[] = [];

      // Parse undergraduate loan from legacy params
      const ugBalance = ugParam !== null ? parseInt(ugParam, 10) : NaN;
      if (planParam && isValidPlan(planParam) && planParam !== "POSTGRADUATE") {
        if (!isNaN(ugBalance)) {
          const clampedBalance = clamp(ugBalance, MIN_BALANCE, MAX_BALANCE);
          loans.push({ planType: planParam, balance: clampedBalance });
        } else {
          // Plan type specified but no balance — include with 0 balance to preserve plan type
          loans.push({ planType: planParam, balance: 0 });
        }
      } else if (!isNaN(ugBalance)) {
        // Balance specified but no valid plan — default to PLAN_2
        loans.push({
          planType: "PLAN_2",
          balance: clamp(ugBalance, MIN_BALANCE, MAX_BALANCE),
        });
      }

      // Parse postgraduate loan from legacy params
      if (pgParam !== null) {
        const pgBalance = parseInt(pgParam, 10);
        if (!isNaN(pgBalance)) {
          const clampedBalance = clamp(pgBalance, MIN_BALANCE, MAX_BALANCE);
          if (clampedBalance > 0) {
            loans.push({ planType: "POSTGRADUATE", balance: clampedBalance });
          }
        }
      }

      if (loans.length > 0) {
        result.loans = loans;
      }
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
  if (sgrParam !== null) {
    // Try parsing as number first (new format)
    const numValue = parseFloat(sgrParam);
    if (!isNaN(numValue)) {
      result.salaryGrowthRate = numValue;
    } else if (sgrParam in LEGACY_SALARY_GROWTH_MAPPING) {
      // Fall back to legacy string preset mapping
      result.salaryGrowthRate = LEGACY_SALARY_GROWTH_MAPPING[sgrParam];
    }
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
