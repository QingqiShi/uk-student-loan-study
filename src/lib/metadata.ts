import { currencyFormatter, DEFAULT_SALARY } from "@/constants";
import { PLAN_DISPLAY_INFO } from "@/lib/loans/plans";
import { DEFAULT_PRESET } from "@/lib/presets";
import { decodeParamsToState } from "@/lib/shareUrl";

/**
 * Default values derived from DEFAULT_PRESET to stay in sync.
 */
const DEFAULTS = {
  planType: DEFAULT_PRESET.underGradPlanType,
  balance: DEFAULT_PRESET.underGradBalance,
  pgBalance: DEFAULT_PRESET.postGradBalance,
  salary: DEFAULT_SALARY,
};

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
  searchParams: Record<string, string | string[] | undefined>,
): DecodedMetadataParams {
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      urlParams.set(key, value);
    }
  }

  const decoded = decodeParamsToState(urlParams);
  const hasShareParams = Object.keys(decoded).length > 0;

  const planType = decoded.underGradPlanType ?? DEFAULTS.planType;
  const planName = PLAN_DISPLAY_INFO[planType].name;
  const balance = decoded.underGradBalance ?? DEFAULTS.balance;
  const pgBalance = decoded.postGradBalance ?? DEFAULTS.pgBalance;
  const salary = decoded.salary ?? DEFAULTS.salary;
  const totalBalance = balance + pgBalance;

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
