import { currencyFormatter, DEFAULT_SALARY } from "@/constants";
import { PLAN_DISPLAY_INFO } from "@/lib/loans/plans";
import type { Loan, PlanType } from "@/lib/loans/types";
import { DEFAULT_PRESET } from "@/lib/presets";
import { decodeParamsToState } from "@/lib/shareUrl";

/**
 * Default values derived from DEFAULT_PRESET to stay in sync.
 */
const DEFAULT_LOANS: Loan[] = DEFAULT_PRESET.loans;

/** Type guard: returns true if the plan type has an entry in PLAN_DISPLAY_INFO */
function isUndergraduatePlan(
  planType: PlanType,
): planType is keyof typeof PLAN_DISPLAY_INFO {
  return planType in PLAN_DISPLAY_INFO;
}

export interface DecodedMetadataParams {
  planName: string;
  balance: number;
  pgBalance: number;
  totalBalance: number;
  salary: number;
  formattedBalance: string;
  formattedSalary: string;
  hasShareParams: boolean;
}

/**
 * Parses URL search params into metadata-ready values.
 * Used by generateMetadata and opengraph-image files.
 */
export function parseMetadataParams(
  searchParams:
    | Record<string, string | string[] | undefined>
    | undefined
    | null,
): DecodedMetadataParams {
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (typeof value === "string") {
      urlParams.set(key, value);
    }
  }

  const decoded = decodeParamsToState(urlParams);
  const hasShareParams = Object.keys(decoded).length > 0;

  const loans = decoded.loans ?? DEFAULT_LOANS;
  const salary = decoded.salary ?? DEFAULT_SALARY;

  const ugLoans = loans.filter((l) => l.planType !== "POSTGRADUATE");
  const pgLoans = loans.filter((l) => l.planType === "POSTGRADUATE");
  const balance = ugLoans.reduce((s, l) => s + l.balance, 0);
  const pgBalance = pgLoans.reduce((s, l) => s + l.balance, 0);
  const totalBalance = balance + pgBalance;

  const firstUgLoan = ugLoans.length > 0 ? ugLoans[0] : undefined;
  const planName =
    firstUgLoan && isUndergraduatePlan(firstUgLoan.planType)
      ? PLAN_DISPLAY_INFO[firstUgLoan.planType].name
      : "Postgraduate";

  return {
    planName,
    balance,
    pgBalance,
    totalBalance,
    salary,
    formattedBalance: currencyFormatter.format(totalBalance),
    formattedSalary: currencyFormatter.format(salary),
    hasShareParams,
  };
}
