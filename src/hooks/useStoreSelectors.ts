import type { Loan } from "@/lib/loans";
import type { SalaryGrowthRate } from "@/types/store";
import { useLoanContext } from "@/context";

interface LoanConfig {
  loans: Loan[];
  repaymentStartDate: Date;
  underGradBalance: number;
  postGradBalance: number;
}

/** Select the loan configuration for simulation calculations */
export function useLoanConfig(): LoanConfig {
  const { state } = useLoanContext();

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
}

/** Select current salary for chart annotation */
export function useCurrentSalary(): number {
  const { state } = useLoanContext();
  return state.salary;
}

interface OverpayConfig {
  monthlyOverpayment: number;
  salaryGrowthRate: SalaryGrowthRate;
  alternativeSavingsRate: number;
}

/** Select overpay analysis configuration */
export function useOverpayConfig(): OverpayConfig {
  const { state } = useLoanContext();
  return {
    monthlyOverpayment: state.monthlyOverpayment,
    salaryGrowthRate: state.salaryGrowthRate,
    alternativeSavingsRate: state.alternativeSavingsRate,
  };
}
