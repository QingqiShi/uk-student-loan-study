import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "../store";
import type { Loan } from "@/lib/loans";

interface LoanConfig {
  loans: Loan[];
  repaymentStartDate: Date;
  underGradBalance: number;
  postGradBalance: number;
}

/** Select the loan configuration for simulation calculations */
export function useLoanConfig(): LoanConfig {
  const state = useStore(
    useShallow((s) => ({
      underGradPlanType: s.underGradPlanType,
      underGradBalance: s.underGradBalance,
      postGradBalance: s.postGradBalance,
      repaymentDate: s.repaymentDate,
    })),
  );

  return useMemo(() => {
    const loans: Loan[] = [];

    if (state.underGradBalance > 0) {
      loans.push({
        planType: state.underGradPlanType,
        balance: state.underGradBalance,
      });
    }
    if (state.postGradBalance > 0) {
      loans.push({ planType: "POSTGRADUATE", balance: state.postGradBalance });
    }

    return {
      loans,
      repaymentStartDate: state.repaymentDate ?? new Date(),
      underGradBalance: state.underGradBalance,
      postGradBalance: state.postGradBalance,
    };
  }, [state]);
}

/** Select current salary for chart annotation */
export function useCurrentSalary(): number {
  return useStore((state) => state.salary);
}
