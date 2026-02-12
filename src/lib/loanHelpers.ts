import type { Loan, PlanType } from "@/lib/loans/types";

/** Toggle a plan type: add with 0 balance if absent, remove if present */
export function toggleLoanPlan(loans: Loan[], planType: PlanType): Loan[] {
  const exists = loans.some((l) => l.planType === planType);
  if (exists) {
    return loans.filter((l) => l.planType !== planType);
  }
  return [...loans, { planType, balance: 0 }];
}

/** Update balance for a specific plan type (no-op if plan not in array) */
export function setLoanBalance(
  loans: Loan[],
  planType: PlanType,
  balance: number,
): Loan[] {
  return loans.map((l) => (l.planType === planType ? { ...l, balance } : l));
}

/** Get the set of plan types currently in the loans array */
export function getSelectedPlanTypes(loans: Loan[]): Set<PlanType> {
  return new Set(loans.map((l) => l.planType));
}
