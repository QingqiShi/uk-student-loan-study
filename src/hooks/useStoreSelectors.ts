import {
  useLoanConfigState,
  useLoanFrequentState,
} from "@/context/LoanContext";
import type { Loan } from "@/lib/loans/types";

interface LoanConfig {
  loans: Loan[];
  underGradBalance: number;
  postGradBalance: number;
}

/** Select the loan configuration for simulation calculations */
export function useLoanConfig(): LoanConfig {
  const { loans } = useLoanConfigState();

  const underGradBalance = loans
    .filter((l) => l.planType !== "POSTGRADUATE")
    .reduce((s, l) => s + l.balance, 0);
  const postGradBalance = loans
    .filter((l) => l.planType === "POSTGRADUATE")
    .reduce((s, l) => s + l.balance, 0);

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
  rpiRate: number;
  boeBaseRate: number;
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

/** Select RPI rate for simulation */
export function useRpiRate(): number {
  const { rpiRate } = useLoanConfigState();
  return rpiRate;
}

/** Select BOE base rate for simulation */
export function useBoeBaseRate(): number {
  const { boeBaseRate } = useLoanConfigState();
  return boeBaseRate;
}

/** Select whether present value mode is active */
export function useShowPresentValue(): boolean {
  const { showPresentValue } = useLoanConfigState();
  return showPresentValue;
}

/** Select the discount rate for present value calculations */
export function useDiscountRate(): number {
  const { discountRate } = useLoanConfigState();
  return discountRate;
}

/** Select the active discount rate for worker payloads (undefined when PV is off or rate is 0) */
export function useActiveDiscountRate(): number | undefined {
  const showPresentValue = useShowPresentValue();
  const discountRate = useDiscountRate();
  return showPresentValue && discountRate > 0 ? discountRate : undefined;
}

/** Select overpay analysis configuration */
export function useOverpayConfig(): OverpayConfig {
  const { monthlyOverpayment, lumpSumPayment } = useLoanFrequentState();
  const { salaryGrowthRate, thresholdGrowthRate, rpiRate, boeBaseRate } =
    useLoanConfigState();
  return {
    monthlyOverpayment,
    salaryGrowthRate,
    thresholdGrowthRate,
    rpiRate,
    boeBaseRate,
    lumpSumPayment,
  };
}
