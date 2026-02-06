import type { Loan } from "@/lib/loans/types";
import {
  useLoanConfigState,
  useLoanFrequentState,
} from "@/context/LoanContext";

interface LoanConfig {
  loans: Loan[];
  underGradBalance: number;
  postGradBalance: number;
}

/** Select the loan configuration for simulation calculations */
export function useLoanConfig(): LoanConfig {
  const { underGradPlanType, underGradBalance, postGradBalance } =
    useLoanConfigState();

  const loans: Loan[] = [];

  if (underGradBalance > 0) {
    loans.push({
      planType: underGradPlanType,
      balance: underGradBalance,
    });
  }
  if (postGradBalance > 0) {
    loans.push({ planType: "POSTGRADUATE", balance: postGradBalance });
  }

  return {
    loans,
    underGradBalance,
    postGradBalance,
  };
}

/** Select current salary for chart annotation */
export function useCurrentSalary(): number {
  const { salary } = useLoanFrequentState();
  return salary;
}

interface OverpayConfig {
  monthlyOverpayment: number;
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
  lumpSumPayment: number;
}

/** Select salary growth rate for charts */
export function useSalaryGrowthRate(): number {
  const { salaryGrowthRate } = useLoanConfigState();
  return salaryGrowthRate;
}

/** Select threshold growth rate for charts */
export function useThresholdGrowthRate(): number {
  const { thresholdGrowthRate } = useLoanConfigState();
  return thresholdGrowthRate;
}

/** Select overpay analysis configuration */
export function useOverpayConfig(): OverpayConfig {
  const { monthlyOverpayment, lumpSumPayment } = useLoanFrequentState();
  const { salaryGrowthRate, thresholdGrowthRate } = useLoanConfigState();
  return {
    monthlyOverpayment,
    salaryGrowthRate,
    thresholdGrowthRate,
    lumpSumPayment,
  };
}
