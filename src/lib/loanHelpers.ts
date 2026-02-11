import type { Loan, UndergraduatePlanType } from "@/lib/loans/types";

/** Get the plan type of the first undergraduate loan, defaulting to PLAN_2 */
export function getUndergraduatePlanType(loans: Loan[]): UndergraduatePlanType {
  const ugLoan = loans.find((l) => l.planType !== "POSTGRADUATE");
  if (!ugLoan) return "PLAN_2";
  return ugLoan.planType as UndergraduatePlanType;
}

/** Get the first undergraduate loan or undefined */
export function getUndergraduateLoan(loans: Loan[]): Loan | undefined {
  return loans.find((l) => l.planType !== "POSTGRADUATE");
}

/** Get the postgraduate loan or undefined */
export function getPostgraduateLoan(loans: Loan[]): Loan | undefined {
  return loans.find((l) => l.planType === "POSTGRADUATE");
}

/** Return a new loans array with the undergraduate plan type changed */
export function setUndergraduatePlanType(
  loans: Loan[],
  planType: UndergraduatePlanType,
): Loan[] {
  const idx = loans.findIndex((l) => l.planType !== "POSTGRADUATE");
  if (idx >= 0) {
    return loans.map((l, i) => (i === idx ? { ...l, planType } : l));
  }
  // No undergraduate loan exists — add one with 0 balance
  return [{ planType, balance: 0 }, ...loans];
}

/** Return a new loans array with the undergraduate loan updated or added */
export function setUndergraduateLoan(
  loans: Loan[],
  planType: UndergraduatePlanType,
  balance: number,
): Loan[] {
  const idx = loans.findIndex((l) => l.planType !== "POSTGRADUATE");
  if (idx >= 0) {
    return loans.map((l, i) => (i === idx ? { planType, balance } : l));
  }
  return [{ planType, balance }, ...loans];
}

/** Return a new loans array with the postgraduate balance updated or added */
export function setPostgraduateLoan(loans: Loan[], balance: number): Loan[] {
  const idx = loans.findIndex((l) => l.planType === "POSTGRADUATE");
  if (idx >= 0) {
    if (balance <= 0) {
      return loans.filter((_, i) => i !== idx);
    }
    return loans.map((l, i) => (i === idx ? { ...l, balance } : l));
  }
  if (balance > 0) {
    return [...loans, { planType: "POSTGRADUATE" as const, balance }];
  }
  return loans;
}
