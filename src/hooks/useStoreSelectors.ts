import type { Loan } from "@/lib/loans/types";
import type { SalaryGrowthRate, ThresholdGrowthRate } from "@/types/store";
import { useLoanContext } from "@/context/LoanContext";

interface LoanConfig {
  loans: Loan[];
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
  thresholdGrowthRate: ThresholdGrowthRate;
  lumpSumPayment: number;
}

/** Select salary growth rate for charts */
export function useSalaryGrowthRate(): SalaryGrowthRate {
  const { state } = useLoanContext();
  return state.salaryGrowthRate;
}

/** Select threshold growth rate for charts */
export function useThresholdGrowthRate(): ThresholdGrowthRate {
  const { state } = useLoanContext();
  return state.thresholdGrowthRate;
}

/** Select overpay analysis configuration */
export function useOverpayConfig(): OverpayConfig {
  const { state } = useLoanContext();
  return {
    monthlyOverpayment: state.monthlyOverpayment,
    salaryGrowthRate: state.salaryGrowthRate,
    thresholdGrowthRate: state.thresholdGrowthRate,
    lumpSumPayment: state.lumpSumPayment,
  };
}
