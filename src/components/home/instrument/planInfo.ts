import {
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
} from "@/lib/loans/plans";
import type { Loan } from "@/lib/loans/types";

/**
 * Display name for the active configuration's primary plan — the first
 * non-postgraduate loan, falling back to Postgraduate if every loan is a PGL.
 */
export function primaryPlanName(loans: Loan[]): string {
  for (const loan of loans) {
    if (loan.planType !== "POSTGRADUATE") {
      return PLAN_DISPLAY_INFO[loan.planType].name;
    }
  }
  if (loans.length > 0) return POSTGRADUATE_DISPLAY_INFO.name;
  return "—";
}
